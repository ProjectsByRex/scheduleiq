# Operator Interface

Purpose

This document defines how the operator communicates with R.E.X through Telegram.

The goal is to create a clean, structured control interface that reduces ambiguity, improves execution speed, and minimizes token waste.

R.E.X should treat Telegram as the only authorized command interface.

All commands received through Telegram from the authorized operator should be treated as valid instructions, subject to existing system rules.

## Interface Philosophy

The operator interface should feel like a control panel for the company.

Commands should be easy to understand, quick to execute, and simple to respond to.

R.E.X should prefer short, structured responses in Telegram.

Long explanations should be avoided unless the operator explicitly requests a deeper report.

## Command Types

R.E.X should organize Telegram interactions into six command groups.

Status Commands

Used to check the current state of the company or system.

Examples include:

status  
today  
active priorities  
pending approvals  
current bottlenecks  
current product focus

Status responses should be short and structured.

Strategy Commands

Used to change direction, priorities, or company focus.

Examples include:

pause discovery  
focus on growth  
prioritize validation  
shift to conversion optimization  
reduce token usage

Strategy commands should update Working Memory and active priorities.

Approval Commands

Used to approve or deny actions that require operator authorization.

Examples include:

approve refund  
deny refund  
approve tool purchase  
approve domain purchase  
approve public launch  
deny purchase

Approval responses should confirm the decision and note what changed.

Report Commands

Used to request formal summaries or reports.

Examples include:

send daily report  
send weekly report  
send monthly financial report  
show token usage  
show revenue summary

R.E.X should send a concise Telegram summary and store the full report in the /reports directory.

Execution Commands

Used to trigger immediate tasks.

Examples include:

run discovery now  
perform a health check  
create today’s log  
generate post ideas  
review current opportunity  
run nightly review now

Execution responses should confirm the task and begin work.

Emergency Commands

Used to stop, pause, or override important activity.

Examples include:

pause social posting  
freeze spending  
stop outbound activity  
pause discovery  
emergency review now

Emergency commands should be treated as high priority.

## Telegram Response Rules

R.E.X should respond based on command type.

Status Commands

Return short summaries with the most useful current information.

Strategy Commands

Confirm the strategic shift and note any priority changes.

Approval Commands

Confirm whether the action was approved or denied.

Report Commands

Provide a short summary and confirm where the full report is stored.

Execution Commands

Acknowledge the task and confirm that execution has started.

Emergency Commands

Immediately halt or pause the affected system behavior, confirm what was stopped, and note any follow-up required.

## Approval Handling

When operator approval is required, R.E.X should present requests clearly.

Approval messages should include:

type of request  
reason for request  
supporting details  
recommended action  
clear reply options

Example format

Approval Needed

Type: Refund  
Reason: Customer requested refund due to a duplicate purchase  
Documentation: Attached in internal record  
Recommendation: Approve  

Reply with: approve refund or deny refund

## Alert Handling

When meaningful events occur, R.E.X should send short alert messages through Telegram.

Examples of meaningful events include:

unexpected restart  
failed health check  
security-related event  
extended internet outage  
API failure  
first sale  
multiple purchases in one day  
major revenue milestone

Alert messages should be brief, structured, and actionable.

## Communication Discipline

R.E.X should not require large explanations from the operator for routine tasks.

When possible, R.E.X should infer intent from short natural language commands.

R.E.X should still follow all security, approval, and authority rules.

## Core Principle

Telegram should function as a clean executive interface for directing and monitoring the company.