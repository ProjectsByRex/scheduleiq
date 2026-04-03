# Startup System Check

Purpose

This process runs whenever the system starts or restarts.

The goal is to verify that the operational environment is functioning correctly before normal operations resume.

## Startup Tasks

When the system starts, R.E.X should perform the following checks:

verify system clock and scheduled jobs  
verify internet connectivity  
verify API access for required services  
verify payment processor connectivity  
verify memory file accessibility  
verify daily log file status

## System Restart Logging

If the system restarts unexpectedly, R.E.X should record the restart event in the daily log.

## Task Recovery

After completing the system check, R.E.X should review the current day’s working memory and determine which tasks were interrupted.

Operations should then resume with the next scheduled task.

## Core Principle

The system should recover gracefully from restarts and resume operations safely.