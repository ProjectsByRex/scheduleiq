# Command Library

Purpose

This document defines the standard Telegram commands the operator may use to interact with R.E.X.

These commands are grouped by function so R.E.X can interpret them consistently.

R.E.X should support both exact command wording and clear natural language variations with the same intent.

## Status Commands

Purpose

Check the current state of the company, product, or system.

Supported commands

status  
today  
what are today’s priorities  
show active priorities  
show pending approvals  
show current bottlenecks  
show current product focus  
show current business phase  
show current token usage  
show network status  
show system health

Expected behavior

Return a concise summary of the requested information.

## Strategy Commands

Purpose

Change business direction, priorities, or operating emphasis.

Supported commands

focus on growth  
pause discovery  
resume discovery  
prioritize validation  
prioritize execution  
prioritize conversion optimization  
reduce token usage  
increase focus on social growth  
shift to retention  
go into background discovery mode

Expected behavior

Update current priorities and Working Memory as needed.

Confirm the change clearly.

## Approval Commands

Purpose

Approve or deny actions that require operator permission.

Supported commands

approve refund  
deny refund  
approve purchase  
deny purchase  
approve subscription  
deny subscription  
approve domain purchase  
deny domain purchase  
approve integration  
deny integration  
approve launch  
deny launch  
approve pricing change  
deny pricing change

Expected behavior

Record the decision, update the approvals queue, and confirm the result.

## Report Commands

Purpose

Request formal reports or summaries.

Supported commands

send daily report  
send weekly report  
send monthly financial report  
show monthly summary  
show year to date summary  
show token report  
show revenue report  
show expense report  
show profit allocation  
show distribution summary

Expected behavior

Send a concise Telegram summary and store the full report in /reports.

## Execution Commands

Purpose

Trigger immediate work.

Supported commands

run discovery now  
perform health check  
create today’s log  
run startup check  
run nightly review now  
generate post ideas  
review current opportunity  
score current opportunity  
draft landing page  
review bottlenecks  
generate social thread  
generate short post  
review current product direction

Expected behavior

Acknowledge the task and begin execution.

## Emergency Commands

Purpose

Immediately pause, stop, or override important activity.

Supported commands

pause social posting  
resume social posting  
freeze spending  
unfreeze spending  
stop outbound activity  
pause discovery  
resume discovery  
pause execution  
resume execution  
emergency review now  
lock system review

Expected behavior

Treat these commands as high priority and confirm what was changed immediately.

## Approval Response Shortcuts

Purpose

Allow simple operator replies to approval requests.

Supported commands

approve  
deny  
approve refund  
deny refund  
approve purchase  
deny purchase  
approve launch  
deny launch

Expected behavior

Apply the response to the current pending approval item when context is clear.

If context is unclear, ask for clarification through Telegram.

## Report Request Shortcuts

Purpose

Provide quick access to the most important reports.

Supported commands

daily report  
weekly report  
monthly report  
financial summary  
token summary  
profit summary

Expected behavior

Interpret these as report requests and respond with the appropriate summary.

## Natural Language Support

R.E.X should support normal language commands that clearly match the intent of the library.

Examples

What’s the top priority today  
Pause new product discovery for now  
Show me current approvals  
Send me this week’s summary  
Run a health check

These should be mapped to the correct command category.

## Core Principle

Commands should be easy to understand, easy to execute, and easy to confirm.