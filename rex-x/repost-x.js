const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../API_KEYS.env') });

const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing X keys in API_KEYS.env: ${missing.join(', ')}`);
  process.exit(1);
}

function extractTweetId(input) {
  const s = String(input || '').trim();
  const m = s.match(/status\/(\d+)/);
  if (m) return m[1];
  const n = s.match(/^(\d+)$/);
  if (n) return n[1];
  return null;
}

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function main() {
  const target = process.argv[2];
  const tweetId = extractTweetId(target);

  if (!tweetId) {
    console.error('Use: node repost-x.js <tweet-url-or-id>');
    process.exit(1);
  }

  try {
    const me = await client.currentUserV2();
    const result = await client.v2.retweet(me.data.id, tweetId);
    console.log('Tweet reposted successfully.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to repost tweet.');
    console.error(error);
    process.exit(1);
  }
}

main();
