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

const TARGETS_PATH = path.resolve(__dirname, 'target_accounts.json');
const QUERIES_PATH = path.resolve(__dirname, 'search_queries.json');
const OUT_DIR = path.resolve(__dirname, '../logs/x-discovery');
const OUT_JSON = path.join(OUT_DIR, 'candidates.json');
const OUT_MD = path.join(OUT_DIR, 'candidates.md');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function short(text, max = 220) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}
async function safeUserByUsername(username) {
  try { return await client.v2.userByUsername(username); } catch { return null; }
}
async function safeTimeline(userId, max = 5) {
  try {
    const safeMax = Math.max(5, Math.min(max, 10));
    return await client.v2.userTimeline(userId, { max_results: safeMax, exclude: ['replies','retweets'] });
  } catch {
    return null;
  }
}
async function safeSearch(query, max = 5) {
  try {
    return await client.v2.search(query, {
      max_results: Math.min(max, 10),
      expansions: ['author_id'],
      'tweet.fields': ['created_at','public_metrics','author_id'],
      'user.fields': ['username','name']
    });
  } catch { return null; }
}
function scorePost(post) {
  const t = (post.text || '').toLowerCase();
  let score = 0;
  const positive = ['saas','founder','startup','customer','users','product','ship','shipping','automation','agent','ai','validation','revenue','distribution','operator'];
  const negative = ['politics','giveaway','follow me','gm','good morning','motivation','viral'];
  for (const p of positive) if (t.includes(p)) score += 2;
  for (const n of negative) if (t.includes(n)) score -= 3;
  score += Math.min(5, Math.floor((post.like_count || 0) / 25));
  score += Math.min(3, Math.floor((post.retweet_count || 0) / 10));
  return score;
}

async function main() {
  const targets = JSON.parse(fs.readFileSync(TARGETS_PATH, 'utf8'));
  const queries = JSON.parse(fs.readFileSync(QUERIES_PATH, 'utf8'));
  const collected = [];

  const handles = [];
  for (const arr of Object.values(targets.categories || {})) {
    for (const item of arr) handles.push(item.handle);
  }
  const uniqueHandles = [...new Set(handles)].slice(0, 12);

  for (const handle of uniqueHandles) {
    const user = await safeUserByUsername(handle);
    if (!user?.data?.id) continue;
    const tl = await safeTimeline(user.data.id, 4);
    const tweets = tl?.tweets || tl?.data?.data || [];
    for (const tweet of tweets) {
      if (!tweet?.id || !tweet?.text) continue;
      collected.push({
        source: 'target_account',
        handle,
        tweet_id: tweet.id,
        url: `https://x.com/${handle}/status/${tweet.id}`,
        text: tweet.text,
        created_at: tweet.created_at || null,
        like_count: tweet.public_metrics?.like_count || 0,
        retweet_count: tweet.public_metrics?.retweet_count || 0,
      });
    }
  }

  for (const q of (queries.queries || []).slice(0, 4)) {
    const result = await safeSearch(q.query, 5);
    const users = new Map();
    for (const u of (result?.includes?.users || [])) users.set(u.id, u);
    const tweets = result?.data?.data || result?.tweets || [];
    for (const tweet of tweets) {
      const author = users.get(tweet.author_id);
      const handle = author?.username || 'unknown';
      collected.push({
        source: `search:${q.name}`,
        handle,
        tweet_id: tweet.id,
        url: `https://x.com/${handle}/status/${tweet.id}`,
        text: tweet.text,
        created_at: tweet.created_at || null,
        like_count: tweet.public_metrics?.like_count || 0,
        retweet_count: tweet.public_metrics?.retweet_count || 0,
      });
    }
  }

  const deduped = uniqBy(collected, (x) => x.tweet_id)
    .filter((x) => x.handle && x.handle !== 'ProjectsByRex')
    .map((x) => ({ ...x, score: scorePost(x) }))
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);

  ensureDir(OUT_DIR);
  const payload = {
    generated_at: new Date().toISOString(),
    candidate_count: deduped.length,
    candidates: deduped,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = ['# X discovery candidates', '', `Generated: ${payload.generated_at}`, `Candidates: ${payload.candidate_count}`, ''];
  for (const [i, c] of deduped.entries()) {
    md.push(`## ${i + 1}. @${c.handle}`);
    md.push(`Score: ${c.score}`);
    md.push(`Source: ${c.source}`);
    md.push(`URL: ${c.url}`);
    md.push(`Text: ${short(c.text)}`);
    md.push('');
  }
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(JSON.stringify({ ok: true, candidate_count: deduped.length, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
}

main().catch((err) => {
  console.error('Failed to discover X candidates.');
  console.error(err);
  process.exit(1);
});
