---
description: Share this conversation to GitHub Gist
---

To execute the cli-share CLI, you will use conversational arguments rather than interactive prompts to avoid breaking the session.
When the user types `/share`, do the following:
1. Ask the user exactly: "Do you want to share the (1)Full Conversation or a (2)Custom Range? \n (3)Public or (4)Private ?"
2. Wait for their response. If they say "Custom Range", clarify what the line number range is (e.g., "10-20").
3. Once you have their decisions, execute the bash command non-interactively using the correct flags.

Available flags:
Mode: `--full` OR `--range=START-END`
Visibility: `--public` OR `--private`

Example Commands you should run based on their answer:
`npx @saurav-shakya/cli-share --full --public`
`npx @saurav-shakya/cli-share --range=10-20 --private`

Do NOT use `! npx @saurav-shakya/cli-share`. Run it standardly once you have the flags!
After the CLI outputs the URL, show the URL to the user.

