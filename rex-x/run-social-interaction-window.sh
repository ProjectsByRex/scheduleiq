#!/bin/zsh
set -euo pipefail
cd /Users/rex/.openclaw/workspace
/usr/bin/env node /Users/rex/.openclaw/workspace/rex-x/log-x-interactions.js 200 >> /Users/rex/.openclaw/workspace/logs/x-interactions/runner.log 2>&1
