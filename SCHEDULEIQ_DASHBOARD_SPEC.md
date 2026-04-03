# SCHEDULEIQ_DASHBOARD_SPEC.md

Date: 2026-03-23
Timezone: America/New_York

## Purpose
A non-local, clean operator dashboard for ScheduleIQ so the operator can check company status from anywhere and see what R.E.X is doing, what changed, what is blocked, and what is needed next.

This dashboard should focus only on ScheduleIQ.

## Core Requirement
The dashboard cannot be local-only.
It must be accessible remotely through a hosted web app or cloud dashboard.

## Primary Goal
Give the operator a single clean place to monitor:
- current revenue
- active projects / workstreams
- timelines
- product status
- analytics
- blockers
- operator approvals / inputs needed
- recent execution completed by R.E.X

## Dashboard Sections

### 1. Executive Overview
Top-level summary cards:
- Current focus
- Current phase
- Today’s priority
- This week’s objective
- Current blocker
- Next milestone
- Last updated time

### 2. Revenue
Show:
- MRR
- total revenue
- revenue this month
- number of paying customers
- average revenue per customer
- recent payments
- refunds (if any)

If revenue is zero, show zero clearly rather than leaving blank.

### 3. Projects / Workstreams
For ScheduleIQ only.
Show active workstreams such as:
- MVP definition
- product build
- onboarding
- landing page
- customer outreach
- analytics setup
- billing setup

Each should show:
- status
- owner
- progress
- next action
- due date / target date

### 4. Timeline / Roadmap
Show:
- current phase
- milestone list
- target dates
- slipped items
- completed milestones

Suggested phase labels:
- Definition
- Validation
- Build
- Launch Prep
- Launch
- Early Traction

### 5. Analytics
Show core operating metrics:
- landing page visitors
- signups
- activation rate
- trial starts
- conversions to paid
- churn
- retention
- feature usage
- top traffic sources

Only include metrics that are instrumented.
If not instrumented yet, show "not yet connected" cleanly.

### 6. Current Work Log
A clean feed of what R.E.X has completed and what is in progress.
Include:
- timestamp
- task
- status
- proof / output link
- notes

This is the anti-drift section.

### 7. What I Need From Gavin
A dedicated approval / dependency section.
Show:
- decision needed
- why it matters
- urgency
- recommended option
- waiting since

Examples:
- approve pricing
- approve domain purchase
- approve public launch
- confirm target niche

### 8. Risks / Blockers
Show:
- blocker
- severity
- impact
- owner
- proposed resolution

### 9. Documents / Assets
Quick links to:
- product brief
- MVP spec
- roadmap
- landing page
- analytics dashboard
- payment dashboard
- customer notes
- outreach tracker

## Recommended First Version
Build a lightweight hosted web dashboard with these initial modules:
1. Executive overview
2. Revenue
3. Active projects
4. Timeline
5. What I need from Gavin
6. Current work log

Analytics can be phase 2 if instrumentation is not ready yet.

## Hosting Requirement
Must be hosted remotely.
Good options:
- a simple hosted web app
- Vercel-hosted dashboard
- Supabase-backed dashboard
- hosted internal operator portal

Do not rely on a local-only file or localhost tool.

## Data Model Outline
Suggested entities:
- company_metrics
- workstreams
- milestones
- work_log
- approvals_needed
- blockers
- links_assets

## Update Behavior
The dashboard should be updated whenever:
- a work block starts or ends
- a milestone changes
- a blocker appears
- a decision is needed
- revenue changes
- a new proof artifact is created

## MVP Dashboard Fields

### Executive Overview Fields
- product_name
- current_focus
- current_phase
- today_priority
- week_objective
- current_blocker
- next_milestone
- last_updated_at

### Revenue Fields
- mrr
- total_revenue
- revenue_this_month
- paying_customers
- arpu
- last_payment_at

### Workstream Fields
- name
- status
- percent_complete
- next_action
- target_date
- notes

### Milestone Fields
- milestone
- phase
- target_date
- status
- notes

### Approval Fields
- item
- reason
- urgency
- recommendation
- waiting_since
- status

## Immediate Build Recommendation
Build this as an operator-facing hosted ScheduleIQ dashboard first, not as a general company dashboard.
Keep it narrow, clean, and execution-oriented.

## Immediate Next Steps
1. Finalize ScheduleIQ dashboard structure
2. Choose hosting stack
3. Define initial data sources
4. Build v1 operator dashboard
5. Connect live work log + milestones + approvals

## Open Decisions For Gavin
1. Do you want this dashboard as:
   - a simple internal web app
   - a polished investor-style dashboard
   - a utilitarian operator console
2. Do you want manual updates first, or should I plan for live data connections from the start?
3. Do you want ScheduleIQ-only now, with multi-product support later?

## Default Recommendation
- utilitarian operator console
- ScheduleIQ-only
- hosted web app
- manual + semi-automated updates first
- add live integrations after the structure is proven
