/**
 * Tests for the Stripe webhook. Run with:  node --test webhook.test.js
 * Uses real Stripe signatures (made with fake secrets) and pretend Stripe/Cognito, so nothing
 * leaves this computer.
 */
const test = require('node:test');
const assert = require('node:assert');
const Stripe = require('stripe');
const config = require('./config');
const {handleWebhook} = require('./webhook');

const SECRETS = {
  liveKey: 'sk_live_fake',
  testKey: 'sk_test_fake',
  liveWebhookSecret: 'whsec_live_fake',
  testWebhookSecret: 'whsec_test_fake',
};
const TEST_PRODUCT = config.products.test.assessment[0];
const LIVE_PRODUCT = config.products.live.assessment[0];
const GF_LIVE = 'prod_giftfinder_live_fake';
const GF_TEST = 'prod_giftfinder_test_fake';
config.products.live.giftFinder = [GF_LIVE];
config.products.test.giftFinder = [GF_TEST];

const signer = Stripe('sk_test_fake');
const sign = (payload, secret) => signer.webhooks.generateTestHeaderString({payload, secret});

function event(type, object, livemode = false) {
  return JSON.stringify({id: 'evt_1', object: 'event', type, livemode, data: {object}});
}

function setup({products = [TEST_PRODUCT], sessionsForPI = null, users = {}, existing = [], secrets = SECRETS} = {}) {
  const calls = {created: [], grouped: [], logs: []};
  const fakeStripe = {
    webhooks: signer.webhooks,
    checkout: {
      sessions: {
        listLineItems: async () => ({data: products.map((p) => ({price: {product: p}}))}),
        list: async () => ({data: sessionsForPI || []}),
      },
    },
  };
  const cognito = {
    createUser: async (email) => {
      if (existing.includes(email)) return false;
      calls.created.push(email);
      return true;
    },
    findUserBySub: async (sub) => (users[sub] ? {username: users[sub]} : null),
    findUserByEmail: async (email) => (users[email] ? {username: users[email]} : null),
    addToGroup: async (username, group) => calls.grouped.push([username, group]),
  };
  const deps = {
    secrets: async () => secrets,
    stripeFor: () => fakeStripe,
    cognito,
    log: (...a) => calls.logs.push(a.join(' ')),
  };
  return {deps, calls};
}

const session = (extra = {}) => ({
  id: 'cs_1',
  object: 'checkout.session',
  payment_status: 'paid',
  customer_details: {email: 'buyer@example.com'},
  ...extra,
});

test('a forged or unsigned message is turned away', async () => {
  const {deps, calls} = setup();
  const body = event('checkout.session.completed', session());
  const unsigned = await handleWebhook({rawBody: body, signature: undefined}, deps);
  assert.strictEqual(unsigned.status, 400);
  const forged = await handleWebhook({rawBody: body, signature: sign(body, 'whsec_wrong')}, deps);
  assert.strictEqual(forged.status, 400);
  assert.deepStrictEqual(calls.created, []);
});

test('a test message signed with the live secret is turned away (modes cannot be mixed)', async () => {
  const {deps, calls} = setup();
  const body = event('checkout.session.completed', session(), false);
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.liveWebhookSecret)}, deps);
  assert.strictEqual(res.status, 400);
  assert.deepStrictEqual(calls.created, []);
});

test('buying the test creates the login', async () => {
  const {deps, calls} = setup({products: [TEST_PRODUCT]});
  const body = event('checkout.session.completed', session());
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.created, ['buyer@example.com']);
  assert.deepStrictEqual(calls.grouped, []);
});

test('live purchases use the live products and live secret', async () => {
  const {deps, calls} = setup({products: [LIVE_PRODUCT]});
  const body = event('checkout.session.completed', session(), true);
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.liveWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.created, ['buyer@example.com']);
});

test('a live product bought in test mode is ignored (and the reverse)', async () => {
  const {deps, calls} = setup({products: [LIVE_PRODUCT]});
  const body = event('checkout.session.completed', session(), false);
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.created, []);
});

test('the same purchase arriving twice does no harm', async () => {
  const {deps, calls} = setup({existing: ['buyer@example.com']});
  const body = event('checkout.session.completed', session());
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.done, ['login already existed']);
  assert.deepStrictEqual(calls.created, []);
});

test('buying the Gift Finder adds the account (found by its ID) to the group, and creates no login', async () => {
  const sub = '11111111-2222-3333-4444-555555555555';
  const {deps, calls} = setup({products: [GF_TEST], users: {[sub]: 'user-abc'}});
  const body = event('checkout.session.completed', session({client_reference_id: sub, customer_details: {email: 'typed-something-else@example.com'}}));
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.grouped, [['user-abc', 'gift-finder']]);
  assert.deepStrictEqual(calls.created, []);
});

test('a Gift Finder buyer without an account ID is found by email', async () => {
  const {deps, calls} = setup({products: [GF_TEST], users: {'buyer@example.com': 'user-xyz'}});
  const body = event('checkout.session.completed', session());
  await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.deepStrictEqual(calls.grouped, [['user-xyz', 'gift-finder']]);
});

test('a Gift Finder purchase with no matching account is logged loudly, not retried', async () => {
  const {deps, calls} = setup({products: [GF_TEST]});
  const body = event('checkout.session.completed', session());
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.grouped, []);
  assert.ok(calls.logs.some((l) => l.includes('NO MATCHING ACCOUNT')));
});

test('session products and other purchases do nothing on the site', async () => {
  const {deps, calls} = setup({products: ['prod_six_sessions']});
  const body = event('checkout.session.completed', session());
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.created, []);
  assert.deepStrictEqual(calls.grouped, []);
});

test('the older "payment succeeded" event works through its checkout', async () => {
  const {deps, calls} = setup({sessionsForPI: [session()]});
  const body = event('payment_intent.succeeded', {id: 'pi_1', object: 'payment_intent'});
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.created, ['buyer@example.com']);
});

test('"payment succeeded" outside Checkout (e.g. an invoice) creates nothing', async () => {
  const {deps, calls} = setup({sessionsForPI: []});
  const body = event('payment_intent.succeeded', {id: 'pi_2', object: 'payment_intent'});
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(calls.created, []);
});

test('unpaid checkouts do nothing', async () => {
  const {deps, calls} = setup();
  const body = event('checkout.session.completed', session({payment_status: 'unpaid'}));
  await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.deepStrictEqual(calls.created, []);
});

test('missing secrets answer 500, so Stripe retries once setup is finished', async () => {
  const {deps, calls} = setup({secrets: {liveKey: 'sk_live_fake'}});
  const body = event('checkout.session.completed', session());
  const res = await handleWebhook({rawBody: body, signature: sign(body, SECRETS.testWebhookSecret)}, deps);
  assert.strictEqual(res.status, 500);
  assert.deepStrictEqual(calls.created, []);
});

test('the app loads with its real wiring (no AWS calls at load time)', () => {
  process.env.stripe_key = '/amplify/app/dev/AMPLIFY_webhookLambdaStripe_stripe_key';
  const app = require('./app');
  assert.strictEqual(typeof app, 'function');
});

test('keys are sorted into live and test by how they start, not by their names', () => {
  const {pickKeys} = require('./webhook');
  // What Patrick found: the original stripe_key holds a test key.
  assert.deepStrictEqual(pickKeys({stripe_key: 'sk_test_orig', stripe_live_key: 'rk_live_new'}), {
    liveKey: 'rk_live_new',
    testKey: 'sk_test_orig',
  });
  // A dedicated test key wins over the original one.
  assert.strictEqual(pickKeys({stripe_key: 'sk_test_orig', stripe_test_key: 'sk_test_sandbox'}).testKey, 'sk_test_sandbox');
  // A test key stored under the live name is never used for live.
  assert.strictEqual(pickKeys({stripe_live_key: 'sk_test_oops'}).liveKey, undefined);
  // Stray spaces from pasting don't matter.
  assert.strictEqual(pickKeys({stripe_live_key: '  rk_live_x \n'}).liveKey, 'rk_live_x');
});
