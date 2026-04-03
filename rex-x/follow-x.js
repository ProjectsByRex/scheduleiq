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

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function main() {
  const username = (process.argv[2] || '').replace(/^@/, '').trim();
  if (!username) {
    console.error('Use: node follow-x.js <username>');
    process.exit(1);
  }

  try {
    const me = await client.currentUserV2();
    const target = await client.v2.userByUsername(username);
    const result = await client.v2.follow(me.data.id, target.data.id);
    console.log(JSON.stringify({
      me: me.data.username,
      target: target.data.username,
      target_id: target.data.id,
      result,
    }, null, 2));
  } catch (error) {
    console.error('Failed to follow account.');
    console.error(error);
    process.exit(1);
  }
}

main();
