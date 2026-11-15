/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TESTRESULTSTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const aws = require('aws-sdk');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

/**
 * Decode a JWT payload (base64url) without verifying signature.
 * Verification is handled by API Gateway / Cognito authorizer upstream.
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
  } catch (_) {
    return null;
  }
}

function isAdmin(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  const groups = payload['cognito:groups'];
  return Array.isArray(groups) && groups.includes('admins');
}

const BUCKET = process.env.STORAGE_TESTRESULTSTORAGE_BUCKETNAME;

// GET /admin/users — list all users from S3 object keys
app.get('/admin/users', async function (req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({error: 'Forbidden: admins only'});
  }

  try {
    const s3 = new aws.S3();
    const objects = [];
    let continuationToken;

    do {
      const params = {
        Bucket: BUCKET,
        ...(continuationToken ? {ContinuationToken: continuationToken} : {}),
      };
      const response = await s3.listObjectsV2(params).promise();
      objects.push(...(response.Contents || []));
      continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    // Extract unique user prefixes from keys like "{email}-{subId}/{email}-results"
    const usersMap = new Map();
    for (const obj of objects) {
      const key = obj.Key || '';
      const slashIdx = key.indexOf('/');
      if (slashIdx === -1) continue;
      const prefix = key.substring(0, slashIdx); // "{email}-{subId}"
      if (usersMap.has(prefix)) continue;

      // Split prefix into email and subId by finding last occurrence of "-{uuid}"
      // subId is a UUID: 8-4-4-4-12 hex chars. We find the first "-" that starts a UUID segment.
      // Strategy: split on "-" and try to find where the UUID starts (it has a fixed pattern).
      // Simpler: the prefix is "{email}-{subId}" where subId contains hyphens too.
      // Email won't contain the UUID pattern, so find the index of "-" followed by 8 hex chars "-" 4 hex...
      const uuidPattern = /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const match = prefix.match(uuidPattern);
      if (!match) continue;

      const subId = match[0].slice(1); // remove leading "-"
      const email = prefix.slice(0, prefix.length - match[0].length);

      usersMap.set(prefix, {email, subId, key});
    }

    return res.json(Array.from(usersMap.values()));
  } catch (err) {
    console.error('Error listing S3 objects:', err);
    return res.status(500).json({error: 'Failed to list users'});
  }
});

// GET /admin/results?email=...&subId=... — fetch a specific user's results
app.get('/admin/results', async function (req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({error: 'Forbidden: admins only'});
  }

  const {email, subId} = req.query;
  if (!email || !subId) {
    return res.status(400).json({error: 'Missing email or subId query params'});
  }

  try {
    const s3 = new aws.S3();
    const s3Key = `${email}-${subId}/${email}-results`;
    const response = await s3
      .getObject({
        Bucket: BUCKET,
        Key: s3Key,
      })
      .promise();

    const data = JSON.parse(response.Body.toString('utf8'));
    return res.json(data);
  } catch (err) {
    console.error('Error fetching S3 object:', err);
    return res.status(500).json({error: 'Failed to fetch results'});
  }
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
