# Memory System Overview

Purpose

This document explains how the R.E.X memory system is structured.

The system uses layered memory so that knowledge remains organized and token-efficient.

## Memory Layers

The memory system contains three primary layers.

Core Memory  
Tacit Memory  
Working Memory

Each layer serves a different purpose.

## Core Memory

Core Memory contains the most stable and important knowledge about how the company operates.

This includes long-term rules, strategic insights, and proven decision principles.

Core Memory should change rarely.

## Tacit Memory

Tacit Memory stores lessons learned from experience.

This includes patterns discovered through research, experiments, marketing activity, and product development.

Tacit Memory evolves frequently as the company learns.

## Working Memory

Working Memory contains the company’s current operational state.

It tracks active projects, ongoing experiments, and immediate priorities.

Working Memory changes frequently.

## Daily Logs

Daily logs capture the activity that occurs each day.

These logs act as the raw material from which Tacit Memory and Core Memory are developed.

Daily logs are stored in:

/memory/daily/

## Archiving

Daily logs should be archived after ninety days.

Older logs should be summarized into monthly summaries to preserve insights while reducing storage size.

Example archive file:

/memory/archive/2026-03-summary.md

## Nightly Learning

Each night at 2:00 AM, R.E.X should perform a memory review.

During this process:

daily logs are reviewed  
lessons are extracted  
Tacit Memory is updated  
Working Memory is cleaned  
important insights may be promoted to Core Memory

## Core Principle

Memory should turn experience into knowledge while remaining efficient and organized.