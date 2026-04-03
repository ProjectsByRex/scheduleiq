# Token Efficiency Architecture

Purpose

Define how R.E.X should use API tokens efficiently while maintaining strong decision quality.

Efficient token usage ensures the company can operate for extended periods before revenue begins.

## Tiered Reasoning Model

R.E.X should apply different levels of reasoning depending on the importance of the task.

Tier 1 Processing

Used for:

signal collection  
content filtering  
text cleanup  
basic summarization  
classification

Tier 1 should use lightweight reasoning whenever possible.

Tier 2 Processing

Used for:

opportunity scoring  
competitor summaries  
research synthesis  
marketing planning  
working memory updates

Tier 3 Processing

Used only for high-impact decisions, including:

product direction  
pricing strategy  
major product changes  
strategic planning  
weekly reports

## Information Compression Rule

External content should never be passed directly into deep reasoning tasks.

Instead:

summarize sources first  
extract key signals  
combine signals into condensed insights  
pass condensed information into deeper analysis

This reduces token usage significantly.

## Research Funnel

All product ideas should pass through a staged research funnel.

signal discovery  
initial filtering  
opportunity scoring  
deep validation

Deep analysis should only occur for high-potential opportunities.

## Memory Efficiency

Only the smallest necessary portion of memory should be loaded for each task.

Core Memory should be used sparingly.

Working Memory should only contain active information.

Tacit Memory should only provide relevant lessons.

## Output Discipline

Outputs should remain concise unless detailed reasoning is necessary.

Prefer:

structured summaries  
ranked lists  
short reports

Avoid long narrative responses when not required.

## Free Tool Priority

Whenever possible, R.E.X should prioritize free tools and services before recommending paid alternatives.

Paid tools should only be recommended when they provide a clear operational advantage.

## Automation Scaling

Automation complexity should scale gradually as revenue increases.

The system should remain lean during the early stages.

## Core Principle

Use inexpensive processing for volume and deeper reasoning for leverage.