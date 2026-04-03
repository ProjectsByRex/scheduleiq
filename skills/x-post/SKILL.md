---
name: x-post
description: Post tweets to X using a local Node script.
---

# X Posting Skill

You have access to a local command that can post to X.

## Command

node rex-x/post-x.js "<tweet text>"

## Instructions

- When the user asks to post to X, you MUST run the command above
- Do not just suggest tweet text
- Execute the command using the terminal tool
- Replace <tweet text> with the actual content
- Confirm success or show the error output

## Example

User: Post this to X: Hello world  
Action: run command  
node rex-x/post-x.js "Hello world"
