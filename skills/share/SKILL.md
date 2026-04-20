---
description: Share this conversation to GitHub Gist
---

# Share Conversation

IMPORTANT: The npm package name is `@saurav-singh/cli-share` (scoped package). You MUST use this exact name. Do NOT use `cli-share` without the scope.

When the user invokes this skill, do the following:

1. Ask the user: "Do you want to share the (1) Full Conversation or a (2) Custom Range?\n(3) Public or (4) Private?"
2. Wait for their response. If they choose "Custom Range", ask for the line number range (e.g., "10-20").
3. Once you have their choices, run the command using the EXACT package name shown below.

## Command Format

ALWAYS use `@saurav-singh/cli-share` as the package name. Never omit the `@saurav-singh/` scope.

For full conversation, public:
```bash
npx @saurav-singh/cli-share --full --public
```

For full conversation, private:
```bash
npx @saurav-singh/cli-share --full --private
```

For custom range, public:
```bash
npx @saurav-singh/cli-share --range=START-END --public
```

For custom range, private:
```bash
npx @saurav-singh/cli-share --range=START-END --private
```

Replace START-END with the actual line numbers the user specified.

After the CLI outputs the URL, display the Gist URL to the user.
