/* Amplify Params - DO NOT EDIT
	AUTH_BIG5AMPLIFYE0115051_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * The Stripe webhook: Stripe calls POST /webhook after a payment. The decisions live in
 * webhook.js; this file connects them to the real Stripe, Cognito and secret store.
 *
 * Secrets (AWS Systems Manager > Parameter Store), all under the same path as the original
 * `stripe_key` (/amplify/{appId}/{env}/AMPLIFY_webhookLambdaStripe_):
 *   stripe_key                   live secret key (already there)
 *   stripe_test_key              test-mode secret key
 *   stripe_webhook_secret        live webhook signing secret (whsec_...)
 *   stripe_test_webhook_secret   test-mode webhook signing secret
 */
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const aws = require('aws-sdk');
const Stripe = require('stripe');
const {handleWebhook} = require('./webhook');

const UserPoolId = process.env.AUTH_BIG5AMPLIFYE0115051_USERPOOLID || 'us-east-1_QlzfM0BUX';
// The original secret's full path; the others sit beside it.
const SECRET_PREFIX = (process.env.stripe_key || '').replace(/stripe_key$/, '');

let cachedSecrets = null;
async function secrets() {
  if (cachedSecrets) return cachedSecrets;
  const names = ['stripe_key', 'stripe_test_key', 'stripe_webhook_secret', 'stripe_test_webhook_secret'];
  const {Parameters} = await new aws.SSM()
    .getParameters({Names: names.map((n) => SECRET_PREFIX + n), WithDecryption: true})
    .promise();
  const value = (n) => (Parameters.find((p) => p.Name === SECRET_PREFIX + n) || {}).Value;
  const found = {
    liveKey: value('stripe_key'),
    testKey: value('stripe_test_key'),
    liveWebhookSecret: value('stripe_webhook_secret'),
    testWebhookSecret: value('stripe_test_webhook_secret'),
  };
  // Keep them for this warm container only once everything is there, so a newly added secret is
  // picked up on the next call rather than after a cold start.
  if (Object.values(found).every(Boolean)) cachedSecrets = found;
  return found;
}

const stripeClients = {};
// Pinned to the API version the Stripe endpoint uses, so objects keep the same shape.
const stripeFor = (key) => (stripeClients[key] = stripeClients[key] || Stripe(key, {apiVersion: '2022-08-01'}));

const cognitoApi = new aws.CognitoIdentityServiceProvider();

// Cognito filters are quoted strings; never let a value break out of the quotes.
const quoteSafe = (v) => String(v).replace(/["\\]/g, '');

async function findUser(filter) {
  const {Users} = await cognitoApi.listUsers({UserPoolId, Filter: filter, Limit: 1}).promise();
  return Users && Users[0] ? {username: Users[0].Username} : null;
}

const cognito = {
  /** Returns true if a new login was created, false if one already existed. */
  async createUser(email) {
    try {
      await cognitoApi
        .adminCreateUser({
          UserPoolId,
          Username: email,
          DesiredDeliveryMediums: ['EMAIL'],
          UserAttributes: [
            {Name: 'email_verified', Value: 'true'},
            {Name: 'email', Value: email},
          ],
          ValidationData: [{Name: 'email', Value: email}],
        })
        .promise();
      return true;
    } catch (e) {
      if (e.code === 'UsernameExistsException') return false;
      throw e;
    }
  },
  findUserBySub(sub) {
    if (!/^[0-9a-f-]{36}$/i.test(sub)) return Promise.resolve(null);
    return findUser(`sub = "${quoteSafe(sub)}"`);
  },
  findUserByEmail(email) {
    return findUser(`email = "${quoteSafe(email)}"`);
  },
  async addToGroup(username, group) {
    const add = () => cognitoApi.adminAddUserToGroup({UserPoolId, Username: username, GroupName: group}).promise();
    try {
      await add();
    } catch (e) {
      if (e.code !== 'ResourceNotFoundException') throw e;
      // First Gift Finder sale: the group doesn't exist yet.
      await cognitoApi
        .createGroup({UserPoolId, GroupName: group, Description: 'Bought the Gift Finder'})
        .promise()
        .catch((err) => {
          if (err.code !== 'GroupExistsException') throw err;
        });
      await add();
    }
  },
};

const app = express();
app.use(
  bodyParser.json({
    // Stripe signs the exact bytes it sent, so keep them as they arrived.
    verify: (req, res, buf) => {
      req.rawBody = buf.toString('utf8');
    },
  })
);
app.use(awsServerlessExpressMiddleware.eventContext());

app.post('/webhook', async (req, res) => {
  try {
    const result = await handleWebhook(
      {rawBody: req.rawBody || '', signature: req.headers['stripe-signature']},
      {secrets, stripeFor, cognito, log: console.log}
    );
    console.log('Webhook result:', result.status, JSON.stringify(result.body));
    res.status(result.status).json(result.body);
  } catch (e) {
    // Something outside our control failed (AWS or Stripe). Answer 500 so Stripe tries again later.
    console.error('Webhook error:', e);
    res.status(500).json({message: 'Temporary problem; Stripe will retry.'});
  }
});

app.listen(3000, () => console.log('App started'));

module.exports = app;
