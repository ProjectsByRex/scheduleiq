#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

WORKSPACE = Path('/Users/rex/.openclaw/workspace')
DASHBOARD_DIR = WORKSPACE / 'scheduleiq-dashboard'
DASHBOARD_FILE = DASHBOARD_DIR / 'index.html'
LEADS_FILE = WORKSPACE / 'scheduleiq' / 'data' / 'pilot-leads.jsonl'
TODAY_PRIORITY_FILE = WORKSPACE / 'TODAY_PRIORITY.md'
TZ = ZoneInfo('America/New_York')


def run(cmd, cwd=None, check=True):
    return subprocess.run(cmd, cwd=cwd, check=check, text=True, capture_output=True)


def fmt_dt(dt: datetime) -> str:
    s = dt.astimezone(TZ).strftime('%b %d, %Y · %I:%M %p ET')
    return s.replace(' 0', ' ')


def get_head_commit_ts() -> tuple[str, datetime]:
    sha = run(['git', 'rev-parse', '--short', 'HEAD'], cwd=DASHBOARD_DIR).stdout.strip()
    ts = int(run(['git', 'log', '-1', '--format=%ct'], cwd=DASHBOARD_DIR).stdout.strip())
    return sha, datetime.fromtimestamp(ts, TZ)


def get_lead_mtime() -> datetime | None:
    if not LEADS_FILE.exists():
        return None
    return datetime.fromtimestamp(LEADS_FILE.stat().st_mtime, TZ)


def replace_timestamp_block(text: str, label: str, value: str) -> str:
    pattern = rf'(<div>{re.escape(label)}</div>\s*<strong>)(.*?)(</strong>)'
    return re.sub(pattern, rf'\1{value}\3', text, count=1, flags=re.S)


def replace_current_blocker(text: str, blocker_value: str, blocker_hint: str) -> str:
    pattern = r'(<div class="label">Current blocker</div>\s*<div class="value">)(.*?)(</div>\s*<div class="hint">)(.*?)(</div>)'
    return re.sub(pattern, lambda m: m.group(1) + blocker_value + m.group(3) + blocker_hint + m.group(5), text, count=1, flags=re.S)


def replace_idle_indicator(text: str, idle_message: str) -> str:
    pattern = r'(<div class="title">Idle indicator</div>\s*<div class="meta">)(.*?)(</div>)'
    return re.sub(pattern, lambda m: m.group(1) + html.escape(idle_message) + m.group(3), text, count=1, flags=re.S)


def replace_no_change_log_row(text: str, checked_str: str, proof: str) -> str:
    row = f'<tr><td>{checked_str}</td><td>Dashboard state check executed</td><td><span class="pill warn">No change</span></td><td>{proof}</td></tr>'
    pattern = r'<tr><td>.*?</td><td>Dashboard state check executed</td><td><span class="pill warn">No change</span></td><td>.*?</td></tr>'
    if re.search(pattern, text, flags=re.S):
        return re.sub(pattern, row, text, count=1, flags=re.S)
    marker = '</table>\n    </div>\n\n    <div class="panel" style="margin-top:16px;">\n      <h2>Links / assets</h2>'
    insert = row + '\n      '
    return text.replace(marker, '</table>\n    </div>\n\n    <div class="panel" style="margin-top:16px;">\n      <h2>Links / assets</h2>', 1)


REQUIRED_SCOREBOARD_FIELDS = {
    'Outreach Sent Today': '0',
    'Conversations Started': '0',
    'Replies Received': '0',
    'Active Leads': '0',
    'Estimated MRR': '0',
}


def ensure_revenue_scoreboard_section() -> str:
    text = TODAY_PRIORITY_FILE.read_text() if TODAY_PRIORITY_FILE.exists() else '# TODAY_PRIORITY.md\n\n'

    section_lines = ['## Revenue Scoreboard', '']
    for label, default in REQUIRED_SCOREBOARD_FIELDS.items():
        match = re.search(rf'- {re.escape(label)}:\s*(.*)', text)
        value = match.group(1).strip() if match else default
        section_lines.append(f'- {label}: {value}')
    section = '\n'.join(section_lines) + '\n'

    if re.search(r'## Revenue Scoreboard\n(.*?)(?:\n## |\Z)', text, flags=re.S):
        text = re.sub(r'## Revenue Scoreboard\n(.*?)(?=\n## |\Z)', section.rstrip('\n'), text, count=1, flags=re.S)
    else:
        if text and not text.endswith('\n'):
            text += '\n'
        text += '\n' + section

    TODAY_PRIORITY_FILE.write_text(text)
    return text


def extract_revenue_scoreboard() -> dict[str, str]:
    text = ensure_revenue_scoreboard_section()
    section_match = re.search(r'## Revenue Scoreboard\n(.*?)(?:\n## |\Z)', text, flags=re.S)
    section = section_match.group(1) if section_match else ''

    fields = dict(REQUIRED_SCOREBOARD_FIELDS)

    for label in fields:
        match = re.search(rf'- {re.escape(label)}:\s*(.*)', section)
        fields[label] = match.group(1).strip() if match else REQUIRED_SCOREBOARD_FIELDS[label]

    return fields


def outreach_status(scoreboard: dict[str, str]) -> str:
    match = re.search(r'\d+', scoreboard.get('Outreach Sent Today', ''))
    outreach_count = int(match.group(0)) if match else 0
    return 'On Track' if outreach_count >= 20 else 'Behind'


def replace_revenue_scoreboard_json(text: str, scoreboard: dict[str, str]) -> str:
    payload = {
        'outreachSentToday': scoreboard.get('Outreach Sent Today', ''),
        'conversationsStarted': scoreboard.get('Conversations Started', ''),
        'repliesReceived': scoreboard.get('Replies Received', ''),
        'activeLeads': scoreboard.get('Active Leads', ''),
        'estimatedMrr': scoreboard.get('Estimated MRR', ''),
    }
    replacement = 'const revenueScoreboard = ' + json.dumps(payload, indent=6) + ';'
    pattern = r'const revenueScoreboard = \{.*?\};'
    return re.sub(pattern, replacement, text, count=1, flags=re.S)


def sync():
    now = datetime.now(TZ)
    checked_str = fmt_dt(now)

    text = DASHBOARD_FILE.read_text()

    commit_sha, commit_dt = get_head_commit_ts()
    lead_dt = get_lead_mtime()
    today_priority_dt = datetime.fromtimestamp(TODAY_PRIORITY_FILE.stat().st_mtime, TZ) if TODAY_PRIORITY_FILE.exists() else None
    scoreboard = extract_revenue_scoreboard()
    status = outreach_status(scoreboard)

    latest_real_dt = commit_dt
    latest_real_proof = f'Git commit <code>{commit_sha}</code> + <code>scheduleiq-dashboard/index.html</code>'
    latest_real_label = fmt_dt(commit_dt)

    if lead_dt and lead_dt > latest_real_dt:
        latest_real_dt = lead_dt
        latest_real_proof = '<code>scheduleiq/data/pilot-leads.jsonl</code>'
        latest_real_label = fmt_dt(lead_dt)

    if today_priority_dt and today_priority_dt > latest_real_dt:
        latest_real_dt = today_priority_dt
        latest_real_proof = '<code>TODAY_PRIORITY.md</code>'
        latest_real_label = fmt_dt(today_priority_dt)

    text = replace_timestamp_block(text, 'Last checked', checked_str)
    text = replace_revenue_scoreboard_json(text, scoreboard)

    existing_last_updated = re.search(r'<div>Last updated</div>\s*<strong>(.*?)</strong>', text, flags=re.S)
    current_last_updated = existing_last_updated.group(1).strip() if existing_last_updated else ''
    real_changed = current_last_updated != latest_real_label

    blocker_hint = (
        'Revenue Scoreboard is behind. Daily outreach is below 20, so outreach remains the highest priority task.'
        if status == 'Behind'
        else 'No active blocker confirmed during this check.'
    )

    if real_changed:
        text = replace_timestamp_block(text, 'Last updated', latest_real_label)
        text = replace_current_blocker(text, status if status == 'Behind' else 'None', blocker_hint)
        idle_msg = f'Execution changed. Dashboard refreshed to reflect the latest confirmed work as of {latest_real_label}.'
    else:
        text = replace_current_blocker(text, status if status == 'Behind' else 'None', blocker_hint)
        idle_msg = f'No meaningful execution change detected during this run. Dashboard check refreshed, but execution state remains unchanged since {latest_real_label}.'

    text = replace_idle_indicator(text, idle_msg)
    no_change_proof = f'No newer commits or lead data after <code>{commit_sha}</code> and <code>pilot-leads.jsonl</code>'
    text = replace_no_change_log_row(text, checked_str, no_change_proof)

    DASHBOARD_FILE.write_text(text)

    run(['git', 'add', 'index.html'], cwd=DASHBOARD_DIR)
    diff = run(['git', 'diff', '--cached', '--quiet'], cwd=DASHBOARD_DIR, check=False)
    if diff.returncode == 0:
        print('dashboard_sync: no_file_change')
        print(f'last_checked: {checked_str}')
        print(f'last_updated: {latest_real_label}')
        return

    msg = 'chore: sync dashboard check state'
    run(['git', 'commit', '-m', msg], cwd=DASHBOARD_DIR)
    run(['git', 'pull', '--rebase', 'origin', 'main'], cwd=DASHBOARD_DIR)
    run(['git', 'push', 'origin', 'main'], cwd=DASHBOARD_DIR)

    print('dashboard_sync: pushed')
    print(f'last_checked: {checked_str}')
    print(f'last_updated: {latest_real_label}')
    print(f'real_execution_changed: {str(real_changed).lower()}')


if __name__ == '__main__':
    sync()
