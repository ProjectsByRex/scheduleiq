# R.E.X Bootloader

Purpose

This document defines the startup sequence R.E.X should follow whenever the system boots, restarts, or begins a new operational session.

The goal is to ensure that R.E.X starts from a safe, informed, and operationally consistent state.

## Startup Order

When starting a new session, R.E.X should load context in the following order.

1. SYSTEM.md

2. Identity Layer
IDENTITY.md
USER_IDENTITY.md
VOICE.md
COMPANY.md

3. Authority and Security
RULES.md
COMMAND_PROTOCOL.md
SECURITY.md

4. Memory System
CORE_MEMORY.md
WORKING_MEMORY.md
TACIT_MEMORY.md
MEMORY.md

5. Current Day Log
If a daily log for the current date exists, load it.
If no daily log exists, create one using DAILY_LOG_TEMPLATE.md and then load it.

## Startup Health Check

Before beginning active work, R.E.X should perform a startup health check.

The health check should verify:

current system date and time  
internet connectivity  
API availability for required services  
payment processor connectivity  
memory file accessibility  
reporting folder accessibility  
next scheduled task  
pending approvals  
active primary product focus

## Offline Boot Behavior

If internet connectivity is unavailable during startup:

record the outage in the daily log  
switch immediately into offline mode  
pause network dependent tasks  
continue local-only tasks such as memory review, planning, and file maintenance  
retry connectivity checks based on the defined network retry schedule

## Pending Approvals

If pending approvals exist, R.E.X should surface them early in the startup process.

Pending approvals should be noted in working memory and included in any relevant operator summary.

R.E.X should not stop working while waiting for approval.

Instead, R.E.X should continue progressing on other available tasks that do not require approval.

## Daily Log Creation

If a daily log for the current date does not exist, R.E.X should automatically create one from DAILY_LOG_TEMPLATE.md.

The daily log should then become the primary record for the current day's work.

## Highest Priority Determination

During startup, R.E.X should identify the single highest priority objective for the day.

This objective should be based on:

current business phase  
active product status  
scheduled tasks  
pending opportunities  
known bottlenecks  
operator directives

This objective should guide the day’s focus until new information justifies a change.

## Startup Recovery

If the system has restarted after interruption, R.E.X should:

log the restart event  
review unfinished work  
determine what tasks were interrupted  
resume with the next highest value task or the next scheduled operation

## Operator Notifications

R.E.X should not send a startup notification for routine boots.

Telegram notifications should only be sent for meaningful events such as:

unexpected restart  
failed health check  
extended internet outage  
API failure  
security event  
payment system issue

## Core Principle

Start every session with clarity, system awareness, and a single focused objective.