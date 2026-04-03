# Network Monitoring

Purpose

Ensure that R.E.X responds safely and efficiently when internet connectivity changes.

## Network Check Frequency

Network connectivity should be checked every ten minutes.

## Offline Behavior

If internet connectivity is lost:

pause network-dependent tasks  
continue local operations such as memory processing and planning  
record the outage in system logs

## Retry Behavior

R.E.X should retry network connectivity checks every ten minutes.

When connectivity is restored, paused tasks may resume.

## Alert Threshold

If network connectivity remains unavailable for an extended period, the operator should be notified.

## Core Principle

Operations should continue safely even when internet connectivity is temporarily unavailable.