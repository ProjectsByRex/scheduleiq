# System Map

Purpose

This document provides a high-level map of the R.E.X operating system.

It helps R.E.X understand where information lives and which files should be consulted for different types of decisions.

This file should be used as a navigation guide when searching for rules, strategies, or operational procedures.

## Root System Files

SYSTEM.md

Defines the overall mission, core rules, loading priority, and operating philosophy of R.E.X.

BOOTLOADER.md

Defines the startup sequence and system health checks that occur when R.E.X begins a session or restarts.

SYSTEM_MAP.md

Provides a high-level map of the operating system and file structure.

---

## Identity Layer

Purpose

Defines the identity, voice, and public persona of the company.

Files

IDENTITY.md  
Defines the internal identity of R.E.X.

USER_IDENTITY.md  
Defines the relationship between the operator and R.E.X.

VOICE.md  
Defines the communication style used publicly and internally.

COMPANY.md  
Defines the company's mission and brand context.

---

## Authority and Security

Purpose

Defines the rules that govern authority, commands, and system protection.

Files

RULES.md  
Defines core behavioral rules.

COMMAND_PROTOCOL.md  
Defines how commands are received and validated.

SECURITY.md  
Defines security policies and restrictions.

---

## Memory System

Purpose

Stores operational knowledge and experience over time.

Files

CORE_MEMORY.md  
Stores long-term principles and stable knowledge.

WORKING_MEMORY.md  
Tracks active projects, priorities, and ongoing work.

TACIT_MEMORY.md  
Stores lessons learned from experience.

MEMORY.md  
Explains how the memory system works.

DAILY_LOG_TEMPLATE.md  
Template used to generate daily operational logs.

Additional directories

/memory/daily  
Stores daily activity logs.

/memory/archive  
Stores archived summaries.

---

## Operations

Purpose

Controls daily execution, scheduling, approvals, and system behavior.

Files

CRON_JOBS.md  
Defines the daily operational schedule.

STARTUP_SYSTEM_CHECK.md  
Defines system checks performed at startup.

NETWORK_MONITOR.md  
Defines behavior during network interruptions.

NIGHTLY_MEMORY_REVIEW.md  
Defines nightly memory consolidation.

APPROVALS.md  
Defines actions that require operator approval.

DECISION_RULES.md  
Defines how R.E.X evaluates decisions.

BUSINESS_FOCUS_RULES.md  
Defines focus rules to prevent distraction.

BOTTLENECKS.md  
Defines how recurring operational problems are detected.

OPERATOR_INTERFACE.md  
Defines how the operator communicates with R.E.X.

COMMAND_LIBRARY.md  
Defines the supported Telegram command structure.

---

## Product System

Purpose

Controls product discovery, validation, and creation.

Files

DISCOVERY_ENGINE.md  
Defines how R.E.X searches for product opportunities.

OPPORTUNITY_SCORING.md  
Defines how opportunities are evaluated.

PRODUCT_PLAYBOOK.md  
Defines how products are built and launched.

---

## Strategy and Economics

Purpose

Defines long-term direction and financial discipline.

Strategy

LONG_TERM_STRATEGY.md  
Defines the long-term mission and company vision.

GROWTH_PHASES.md  
Defines the stages of company development.

Economics

TOKEN_BUDGET.md  
Defines API spending limits.

TOKEN_EFFICIENCY.md  
Defines how tokens should be used efficiently.

PROFIT_ALLOCATION.md  
Defines how profits are distributed.

---

## Social and Reporting

Purpose

Controls public communication and company reporting.

Social

PUBLIC_COMMUNICATION.md  
Defines public communication policies.

POST_ENGINE.md  
Defines social posting behavior and schedule.

Reporting

CEO_REPORT.md  
Defines daily, weekly, and monthly reporting systems.

Reports Directory

/reports  
Stores generated operational and financial reports.

---

## Logs

Purpose

Stores internal activity records used for system awareness and debugging.

/logs

Stores operational logs, research logs, and system events.

---

## Core Principle

The R.E.X operating system is modular.

Each layer exists for a specific purpose.

When solving problems or making decisions, R.E.X should load only the files relevant to the current task.