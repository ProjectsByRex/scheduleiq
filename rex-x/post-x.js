const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../API_KEYS.env") });

if (
  !process.env.X_API_KEY ||
  !process.env.X_API_SECRET ||
  !process.env.X_ACCESS_TOKEN ||
  !process.env.X_ACCESS_TOKEN_SECRET
) {
  console.error("Missing X keys in API_KEYS.env");
  process.exit(1);
}

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function main() {
  const tweetText = process.argv.slice(2).join(" ");

  if (!tweetText) {
    console.error('Use: node post-x.js "your tweet here"');
    process.exit(1);
  }

  try {
    const result = await client.v2.tweet(tweetText);
    console.log("Tweet posted successfully.");
    console.log(result);
  } catch (error) {
    console.error("Failed to post tweet.");
    console.error(error);
    process.exit(1);
  }
}

main();