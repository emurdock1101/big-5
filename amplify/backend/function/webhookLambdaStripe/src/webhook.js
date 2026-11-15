/**
 * What happens when Stripe tells us about a payment.
 *
 * 1. Check the message really came from Stripe (its signature), using the live or test
 *    signing secret to match the message. Anything unsigned or forged is turned away.
 * 2. Work out which checkout it belongs to and which products were bought.
 * 3. Test bought: create the login (Cognito emails the temporary password), as before.
 *    Gift Finder bought: add the buyer's existing account to the Gift Finder group.
 *    Anything else: nothing to do here.
 *
 * Every step is safe to repeat: Stripe re-sends a message if we don't answer "OK", and both
 * "payment succeeded" and "checkout completed" may arrive for the same purchase.
 *
 * The outside world (Stripe, Cognito, the secret store) comes in through `deps`, so this file
 * can be tested without AWS or a real Stripe account.
 */
const config = require('./config');

const reply = (status, message, extra = {}) => ({status, body: {message, ...extra}});

/** Find the user the Gift Finder purchase belongs to: their account ID first, then the checkout email. */
async function findBuyer(cognito, session) {
  const ref = session.client_reference_id;
  if (ref) {
    const bySub = await cognito.findUserBySub(ref);
    if (bySub) return bySub;
  }
  const email = session.customer_details?.email || session.customer_email;
  return email ? cognito.findUserByEmail(email) : null;
}

/** Act on one paid checkout. Returns a reply for Stripe. */
async function processSession(session, {stripe, cognito, livemode, log}) {
  if (session.payment_status && session.payment_status !== 'paid') {
    return reply(200, 'Checkout not paid yet; nothing to do.');
  }
  const list = await stripe.checkout.sessions.listLineItems(session.id, {limit: 20});
  const productIds = list.data.map((item) => {
    const p = item.price && item.price.product;
    return typeof p === 'string' ? p : p && p.id;
  });
  const products = livemode ? config.products.live : config.products.test;
  const boughtTest = productIds.some((id) => products.assessment.includes(id));
  const boughtGiftFinder = productIds.some((id) => products.giftFinder.includes(id));
  const done = [];

  if (boughtTest) {
    const email = session.customer_details?.email || session.customer_email;
    if (!email) {
      log('Test purchase with no email on the checkout', session.id);
      return reply(200, 'No email on the checkout; nothing created.');
    }
    const created = await cognito.createUser(email);
    done.push(created ? 'login created' : 'login already existed');
  }

  if (boughtGiftFinder) {
    const user = await findBuyer(cognito, session);
    if (!user) {
      // Not worth retrying: no account will appear on its own. Logged so it can be fixed by hand.
      log('GIFT FINDER PURCHASE WITH NO MATCHING ACCOUNT. Checkout:', session.id);
      done.push('gift finder: no matching account');
    } else {
      await cognito.addToGroup(user.username, config.GIFT_FINDER_GROUP);
      done.push('gift finder unlocked');
    }
  }

  if (!done.length) return reply(200, 'No Personality+ product in this checkout; nothing to do.');
  return reply(200, 'Done', {done});
}

/**
 * Handle one webhook call.
 * @param {{rawBody: string, signature: string | undefined}} req
 * @param {{secrets: () => Promise<{liveKey?: string, testKey?: string, liveWebhookSecret?: string, testWebhookSecret?: string}>,
 *          stripeFor: (key: string) => any, cognito: any, log?: (...a: any[]) => void}} deps
 */
async function handleWebhook(req, deps) {
  const log = deps.log || console.log;

  // Peek at whether this claims to be live or test, only to pick the right secret to check it with.
  let claimed;
  try {
    claimed = JSON.parse(req.rawBody);
  } catch {
    return reply(400, 'Not a Stripe message.');
  }
  const live = claimed && claimed.livemode === true;

  const s = await deps.secrets();
  const signingSecret = live ? s.liveWebhookSecret : s.testWebhookSecret;
  const apiKey = live ? s.liveKey : s.testKey;
  if (!signingSecret || !apiKey) {
    // Stripe will retry, so nothing is lost while the setup is finished.
    log(`Missing ${live ? 'live' : 'test'} Stripe secret(s) in the parameter store.`);
    return reply(500, 'Not set up yet.');
  }

  const stripe = deps.stripeFor(apiKey);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.signature || '', signingSecret);
  } catch (e) {
    log('Rejected a message with a bad or missing Stripe signature.');
    return reply(400, 'Signature check failed.');
  }

  const ctx = {stripe, cognito: deps.cognito, livemode: event.livemode === true, log};
  const obj = event.data && event.data.object;

  if (event.type === 'checkout.session.completed') {
    return processSession(obj, ctx);
  }

  if (event.type === 'payment_intent.succeeded') {
    // The older event. Act only through its checkout, so the product is known; payments made
    // outside Checkout (for example invoices for sessions) are left alone.
    const sessions = await stripe.checkout.sessions.list({payment_intent: obj.id, limit: 1});
    if (!sessions.data.length) return reply(200, 'Not a checkout payment; nothing to do.');
    return processSession(sessions.data[0], ctx);
  }

  return reply(200, `Ignored event type ${event.type}.`);
}

/**
 * Sort the stored Stripe secret keys into live and test by how they start, whatever they are
 * called. (The original `stripe_key` turned out to hold a test key.) Preferred names come first.
 * @param {{stripe_live_key?: string, stripe_test_key?: string, stripe_key?: string}} v
 */
function pickKeys(v) {
  const clean = (x) => (typeof x === 'string' ? x.trim() : '');
  const isLive = (k) => /^(sk|rk)_live_/.test(k);
  const isTest = (k) => /^(sk|rk)_test_/.test(k);
  const liveKey = [v.stripe_live_key, v.stripe_key].map(clean).find(isLive);
  const testKey = [v.stripe_test_key, v.stripe_key].map(clean).find(isTest);
  return {liveKey, testKey};
}

module.exports = {handleWebhook, processSession, pickKeys};
