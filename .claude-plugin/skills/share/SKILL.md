---
name: share
description: "Share the current terminal conversation to a GitHub Gist."
disable-model-invocation: false
user-invocable: true
---

# Instructions

When the user wants to share their conversation, follow these steps:

1.  Ask the user: "Do you want to share the (1)Full Conversation or a (2)Custom Range? \n (3)Public or (4)Private ?"
2.  Wait for their decision.
3.  Execute the `cli-share` command non-interactively based on their choice:
    - If Full + Public: `npx cli-share --full --public`
    - If Full + Private: `npx cli-share --full --private`
    - If Range (e.g. 10-20) + Public: `npx cli-share --range=10-20 --public`
    - If Range + Private: `npx cli-share --range=10-20 --private`
4.  After execution, the CLI will output a Gist URL. Display this link to the user.

> [!NOTE]
> This command uses the standardized `cli-share` binary which preserves terminal formatting using VT100 emulation.
