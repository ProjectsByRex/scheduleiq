const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

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

const OUT_DIR = path.resolve(__dirname, '../logs/x-interactions');
const SNAPSHOT_JSON = path.join(OUT_DIR, 'latest.json');
const SNAPSHOT_MD = path.join(OUT_DIR, 'latest.md');
const HISTORY_JSONL = path.join(OUT_DIR, 'history.jsonl');
const STATE_JSON = path.join(OUT_DIR, 'state.json');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function shortText(text, max = 220) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function utcDateKey(isoString) {
  return new Date(isoString).toISOString().slice(0, 10);
}

async function fetchReplies(maxTweets) {
  const me = await client.currentUserV2();
  const myUser = me.data;
  const paginator = await client.v2.userTimeline(myUser.id, {
    max_results: 100,
    expansions: ['referenced_tweets.id', 'referenced_tweets.id.author_id', 'author_id', 'in_reply_to_user_id'],
    'tweet.fields': ['created_at', 'conversation_id', 'referenced_tweets', 'public_metrics'],
    'user.fields': ['username', 'name']
  });

  const collected = [];
  while (true) {
    const users = new Map();
    for (const u of (paginator.includes?.users || [])) users.set(u.id, u);

    const tweets = new Map();
    for (const t of (paginator.includes?.tweets || [])) tweets.set(t.id, t);

    for (const t of paginator.tweets || []) {
      collected.push({ tweet: t, users, tweets });
      if (collected.length >= maxTweets) break;
    }

    if (collected.length >= maxTweets) break;
    if (!paginator.done) await paginator.fetchNext();
    else break;
  }

  const rows = [];
  for (const item of collected) {
    const t = item.tweet;
    const refs = t.referenced_tweets || [];
    const replied = refs.find((r) => r.type === 'replied_to');
    if (!replied) continue;

    const targetTweet = item.tweets.get(replied.id);
    let targetUser = null;
    if (targetTweet?.author_id) targetUser = item.users.get(targetTweet.author_id);
    if (!targetUser && t.in_reply_to_user_id) targetUser = item.users.get(t.in_reply_to_user_id);

    rows.push({
      created_at: t.created_at,
      my_account: myUser.username,
      my_tweet_id: t.id,
      my_text: t.text,
      my_link: `https://x.com/${myUser.username}/status/${t.id}`,
      target_tweet_id: replied.id,
      target_user_id: targetUser?.id || null,
      target_username: targetUser?.username || null,
      target_name: targetUser?.name || null,
      target_link: targetUser?.username ? `https://x.com/${targetUser.username}/status/${replied.id}` : null,
    });
  }

  return { myUser, collected, rows };
}

function writeSnapshot(snapshot) {
  fs.writeFileSync(SNAPSHOT_JSON, JSON.stringify(snapshot, null, 2));

  const md = [
    `# X interaction snapshot`,
    '',
    `Generated: ${snapshot.generated_at}`,
    `Account: @${snapshot.account.username}`,
    `Scanned tweets: ${snapshot.scanned_tweets}`,
    `Replies found: ${snapshot.reply_count}`,
    '',
  ];

  if (!snapshot.replies.length) {
    md.push('No reply interactions found in the scanned timeline.');
  } else {
    snapshot.replies.forEach((row, i) => {
      md.push(`## ${i + 1}. ${row.target_username ? `@${row.target_username}` : 'Unknown account'}`);
      if (row.target_name) md.push(`Name: ${row.target_name}`);
      md.push(`When: ${row.created_at || 'Unknown'}`);
      if (row.target_link) md.push(`Target post: ${row.target_link}`);
      md.push(`Reply: ${row.my_link}`);
      md.push(`Text: ${shortText(row.my_text)}`);
      md.push('');
    });
  }

  fs.writeFileSync(SNAPSHOT_MD, md.join('\n'));
}

function writeDailySummary(snapshot) {
  const byDay = new Map();
  for (const row of snapshot.replies) {
    const key = utcDateKey(row.created_at || snapshot.generated_at);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(row);
  }

  for (const [day, rows] of byDay.entries()) {
    const dayDir = path.join(OUT_DIR, 'daily');
    ensureDir(dayDir);
    const jsonPath = path.join(dayDir, `${day}.json`);
    const mdPath = path.join(dayDir, `${day}.md`);

    const accounts = [...new Set(rows.map((r) => r.target_username).filter(Boolean))].sort();
    const daySnapshot = {
      day,
      generated_at: snapshot.generated_at,
      account: snapshot.account,
      reply_count: rows.length,
      unique_accounts: accounts,
      replies: rows,
    };
    fs.writeFileSync(jsonPath, JSON.stringify(daySnapshot, null, 2));

    const md = [
      `# X daily interaction summary — ${day}`,
      '',
      `Account: @${snapshot.account.username}`,
      `Replies/comments logged: ${rows.length}`,
      `Unique accounts engaged: ${accounts.length}`,
      accounts.length ? `Accounts: ${accounts.map((a) => `@${a}`).join(', ')}` : 'Accounts: none',
      '',
    ];

    rows.forEach((row, i) => {
      md.push(`## ${i + 1}. ${row.target_username ? `@${row.target_username}` : 'Unknown account'}`);
      md.push(`When: ${row.created_at || 'Unknown'}`);
      if (row.target_link) md.push(`Target post: ${row.target_link}`);
      md.push(`Reply: ${row.my_link}`);
      md.push(`Text: ${shortText(row.my_text)}`);
      md.push('');
    });

    fs.writeFileSync(mdPath, md.join('\n'));
  }
}

function detectNewReplies(rows) {
  const state = readJson(STATE_JSON, { seen_reply_ids: [] });
  const seen = new Set(state.seen_reply_ids || []);
  const fresh = rows.filter((r) => !seen.has(r.my_tweet_id));
  const nextSeen = [...new Set([...rows.map((r) => r.my_tweet_id), ...seen])].slice(0, 5000);
  fs.writeFileSync(STATE_JSON, JSON.stringify({ seen_reply_ids: nextSeen, updated_at: new Date().toISOString() }, null, 2));
  return fresh;
}

async function main() {
  const limitArg = Number(process.argv[2] || 100);
  const maxTweets = Number.isFinite(limitArg) && limitArg > 0 ? Math.min(limitArg, 800) : 100;

  ensureDir(OUT_DIR);

  const { myUser, collected, rows } = await fetchReplies(maxTweets);
  const generatedAt = new Date().toISOString();
  const newReplies = detectNewReplies(rows);

  const snapshot = {
    generated_at: generatedAt,
    account: {
      id: myUser.id,
      name: myUser.name,
      username: myUser.username,
    },
    scanned_tweets: collected.length,
    reply_count: rows.length,
    new_reply_count: newReplies.length,
    replies: rows,
    new_replies: newReplies,
  };

  writeSnapshot(snapshot);
  writeDailySummary(snapshot);

  const historyLine = JSON.stringify({
    generated_at: snapshot.generated_at,
    account_username: myUser.username,
    scanned_tweets: collected.length,
    reply_count: rows.length,
    new_reply_count: newReplies.length,
  });
  fs.appendFileSync(HISTORY_JSONL, historyLine + '\n');

  console.log(JSON.stringify({
    ok: true,
    account: `@${myUser.username}`,
    scanned_tweets: collected.length,
    reply_count: rows.length,
    new_reply_count: newReplies.length,
    new_replies: newReplies.slice(0, 10).map((r) => ({
      when: r.created_at,
      handle: r.target_username,
      target_link: r.target_link,
      reply_link: r.my_link,
      text: shortText(r.my_text, 140),
    })),
    files: {
      latest_json: SNAPSHOT_JSON,
      latest_md: SNAPSHOT_MD,
      history_jsonl: HISTORY_JSONL,
      daily_dir: path.join(OUT_DIR, 'daily'),
      state_json: STATE_JSON,
    }
  }, null, 2));
}

main().catch((error) => {
  console.error('Failed to log X interactions.');
  console.error(error);
  process.exit(1);
});
