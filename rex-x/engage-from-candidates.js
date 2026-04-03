const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const IN_JSON = path.resolve(__dirname, '../logs/x-discovery/candidates.json');
const OUT_JSON = path.resolve(__dirname, '../logs/x-discovery/engagement-last.json');

function runNode(script, args) {
  return execFileSync('node', [path.resolve(__dirname, script), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
function short(text, max = 110) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function main() {
  const raw = JSON.parse(fs.readFileSync(IN_JSON, 'utf8'));
  const candidates = raw.candidates || [];
  const likes = [];
  const reposts = [];
  const follows = [];
  let quote = null;
  const used = new Set();
  const followedHandles = new Set();

  // Prioritize quote first so the hard success criteria is more likely to be met.
  for (const c of candidates) {
    if (quote) break;
    const text = `Worth paying attention to: ${short(c.text, 90)}`;
    try {
      runNode('like-x.js', [c.tweet_id]);
      likes.push(c);
      used.add(c.tweet_id);
      runNode('quote-x.js', [c.tweet_id, text]);
      quote = c;
      followedHandles.add(c.handle);
    } catch {}
  }

  for (const c of candidates) {
    if (reposts.length >= 2) break;
    if (used.has(c.tweet_id)) continue;
    try {
      runNode('like-x.js', [c.tweet_id]);
      likes.push(c);
      runNode('repost-x.js', [c.tweet_id]);
      reposts.push(c);
      used.add(c.tweet_id);
      followedHandles.add(c.handle);
    } catch {}
  }

  for (const c of candidates) {
    if (likes.length >= 20) break;
    if (used.has(c.tweet_id)) continue;
    try {
      runNode('like-x.js', [c.tweet_id]);
      likes.push(c);
      used.add(c.tweet_id);
      followedHandles.add(c.handle);
    } catch {}
  }

  for (const c of candidates) {
    if (follows.length >= 5) break;
    if (!c.handle || followedHandles.has(`done:${c.handle}`)) continue;
    try {
      runNode('follow-x.js', [c.handle]);
      follows.push(c.handle);
      followedHandles.add(`done:${c.handle}`);
    } catch {}
  }

  try { runNode('log-x-interactions.js', ['200']); } catch {}

  const success = (quote ? 1 : 0) >= 1 && reposts.length >= 2 && likes.length >= 20;
  const result = {
    generated_at: new Date().toISOString(),
    replies_sent: 0,
    quote_tweets: quote ? 1 : 0,
    likes: likes.length,
    reposts: reposts.length,
    follows: follows.length,
    success: success ? 'yes' : 'no',
    new_handles: [...new Set([...(quote ? [quote.handle] : []), ...likes.map(x => x.handle), ...reposts.map(x => x.handle), ...follows])],
    links: [...new Set([...(quote ? [quote.url] : []), ...reposts.map(x => x.url), ...likes.slice(0, 5).map(x => x.url)])],
    opportunities: candidates.length ? `candidate pool size ${candidates.length}` : 'none',
    blocker: success ? 'none' : (candidates.length ? 'hard engagement targets not fully met from current candidate pool' : 'no discovery candidates available'),
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main();
