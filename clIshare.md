# CLI Share
### Product & Technical Requirements Document — v1.0.0

> *One command. Zero friction. Infinite sharing.*

![Version](https://img.shields.io/badge/version-1.0.0-6C63FF) ![Stack](https://img.shields.io/badge/stack-Node.js-00D4AA) ![Ship](https://img.shields.io/badge/ship-npm%20%2B%20Claude%20Code-FF6B6B) ![License](https://img.shields.io/badge/license-MIT-1A1A2E)

---

# PART 1 — PRODUCT REQUIREMENTS DOCUMENT

---

## 1.1 Executive Summary

> **VISION:** A single `/share` command that captures any CLI AI conversation, preserves its terminal formatting, and publishes it to GitHub Gist as a shareable, permanent link — with zero copy-paste friction.

Developers using AI CLI tools (Claude Code, OpenAI Codex, Gemini CLI, etc.) generate enormous amounts of valuable knowledge inside their terminals — debugging breakthroughs, architecture decisions, prompts that actually work. This knowledge is locked inside sessions that vanish when the window closes.

CLI Share CLI solves this with a one-command sharing infrastructure that treats developer knowledge as a first-class artifact.

---

## 1.2 Problem Statement

| # | Problem | Impact | Current Workaround |
|---|---------|--------|--------------------|
| 1 | Copy-paste destroys terminal UI (ASCII art, borders, spacing) | High | Manual reformatting — slow |
| 2 | ANSI color codes appear as garbage characters | High | Strip manually or lose colors |
| 3 | No native share button in CLI tools | Medium | Screenshot (not searchable) |
| 4 | Knowledge lost when terminal closes | High | None — permanently lost |
| 5 | No canonical URL to link to a session | Medium | Host a blog post manually |

---

## 1.3 Goals & Non-Goals

### ✅ Goals (MVP)

- Intercept and capture raw terminal output during any CLI AI session
- Strip ANSI escape codes cleanly while preserving ASCII structure
- Wrap content in fenced markdown code blocks
- Upload to GitHub Gist (public or private) via Octokit REST API
- Return a clickable, permanent shareable URL
- Support custom range selection (e.g. lines 3–10 only)

### ❌ Non-Goals (v1)

- HTML/CSS color-preserving rendering (v2 roadmap)
- Self-hosted storage backend
- Real-time collaborative sessions
- Mobile or web UI

---

## 1.4 Target Users

| Persona | Description | Primary Use Case |
|---------|-------------|-----------------|
| CLI Developer | Uses Claude Code / Codex daily | Share debugging solutions to team |
| AI Engineer | Experiments with prompt engineering | Document prompt + output pairs |
| Indie Hacker | Solo builder, shares progress publicly | Twitter / community showcase |
| OSS Contributor | Reviews and PRs in terminal | Share AI-assisted code review flows |
| Student | Learning via AI-guided tutorials | Save sessions for future reference |

---

## 1.5 Core Feature: `/share` Command

The entire product surface area is a single command. Everything else is infrastructure supporting it.

### User Flow — Step by Step

| Step | Title | Description |
|------|-------|-------------|
| 1 | Trigger | User types `/share` inside any AI CLI session |
| 2 | Mode Select | Prompt: Full Conversation vs Custom Range |
| 3 | Range Input | If Custom: enter chat range e.g. `"3-15"` |
| 4 | Visibility | Prompt: Public (community) vs Private (team) |
| 5 | Auth Check | System checks `GITHUB_TOKEN` — runs login flow if missing |
| 6 | Processing | Capture raw log → strip ANSI → wrap in markdown fences |
| 7 | Upload | POST to GitHub Gist API via Octokit |
| 8 | Output | Print clickable URL, optionally open browser |

---

## 1.6 Use Cases

### UC-01: Debugging Share
> **SCENARIO:** Dev hits a cryptic TypeScript error. Claude Code walks through the fix. Dev types `/share` → sends Gist link to teammate on Slack.

### UC-02: Learning Content Creation
> **SCENARIO:** "How I built X with AI" posts — raw terminal output as authentic proof-of-work. Shared on Twitter/X or dev.to.

### UC-03: Team Collaboration
> **SCENARIO:** Senior dev shares architecture planning session (private Gist) with team for async review before standup.

### UC-04: Community Showcase
> **SCENARIO:** Raw terminal aesthetic looks authentic and professional. OSS contributors share AI-assisted PR reviews.

---

## 1.7 Output Guarantee

| Element | Requirement | Status |
|---------|-------------|--------|
| ASCII art / logos | Must be fully preserved | ✅ Guaranteed |
| Box-drawing borders | Must be fully preserved | ✅ Guaranteed |
| Whitespace / indentation | Must be fully preserved | ✅ Guaranteed |
| Unicode symbols | Must be fully preserved | ✅ Guaranteed |
| ANSI terminal colors | Stripped (not rendered in markdown) | ⚠️ v2 roadmap |
| Hyperlinks | Preserved as plain text URLs | ✅ Guaranteed |

---

## 1.8 Edge Cases & Handling

| Edge Case | Detection | Response |
|-----------|-----------|----------|
| Empty session log | `rawLog.length === 0` | Error: "Nothing captured yet. Start a session first." |
| Invalid range (e.g. 10-3) | `start >= end` | Error: "End must be greater than start." |
| Range out of bounds | `end > totalLines` | Warning + clamp to max lines |
| Log > 1MB (GitHub limit) | `content.length > 1_000_000` | Prompt to select range or truncate |
| GitHub auth failure | 401 from Octokit | Re-run auth flow with clear instructions |
| Network offline | fetch timeout | Error: "No internet. Log saved locally at `/tmp/cli-share-draft.md`" |

---
---

# PART 2 — TECHNICAL REQUIREMENTS DOCUMENT

---

## 2.1 System Architecture

> **SUMMARY:** A monorepo with three packages: `core` (shared engine), `cli` (npx tool), and `claude-plugin` (Claude Code integration). All three share the same capture/format/upload pipeline.

### Architecture Layers

| Layer | Package | Responsibility |
|-------|---------|----------------|
| Capture Layer | `packages/core/capture.js` | Intercept stdout stream, accumulate raw log |
| Format Layer | `packages/core/formatter.js` | Strip ANSI, apply range, wrap in markdown fences |
| Auth Layer | `packages/core/auth.js` | Read `GITHUB_TOKEN`, run device OAuth flow if missing |
| Upload Layer | `packages/core/uploader.js` | POST to GitHub Gist API via `@octokit/rest` |
| CLI Layer | `packages/cli/index.js` | Interactive inquirer prompts, bin entry point |
| Plugin Layer | `packages/claude-plugin/` | `/share` slash command + script wrapper |

### High-Level Flow

```
User types /share
       │
       ▼
  ┌─────────────┐
  │  CLI Layer  │  ← inquirer prompts (mode, range, visibility)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Capture   │  ← stdout interceptor / script log reader
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Formatter  │  ← strip ANSI → apply range → wrap markdown
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Auth Layer │  ← check token → device OAuth if needed
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Uploader  │  ← POST /gists via Octokit
  └──────┬──────┘
         │
         ▼
  ✅ https://gist.github.com/abc123
```

---

## 2.2 Monorepo Structure

```
cli-share/
├── packages/
│   ├── core/                    ← Shared engine (capture, format, upload)
│   │   ├── capture.js
│   │   ├── formatter.js
│   │   ├── auth.js
│   │   └── uploader.js
│   ├── cli/                     ← npx @saurav-shakya/cli-share standalone tool
│   │   ├── index.js             ← #!/usr/bin/env node
│   │   └── package.json
│   └── claude-plugin/           ← Claude Code integration
│       ├── commands/share.md
│       └── wrapper.sh           ← script-based terminal recorder
├── package.json                 ← workspaces config
└── README.md
```

---

## 2.3 Core Modules (API Reference)

---

### `capture.js` — Raw Terminal Recorder

Monkey-patches `process.stdout.write` to intercept every byte written to the terminal. Non-destructive — original output still renders normally.

```javascript
const { Transform } = require('stream');

let rawLog = '';

function startCapture() {
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk, ...args) => {
    rawLog += chunk.toString();
    return original(chunk, ...args);
  };
}

function stopCapture()  { return rawLog; }
function clearCapture() { rawLog = ''; }
function getSnapshot()  { return rawLog; }

module.exports = { startCapture, stopCapture, clearCapture, getSnapshot };
```

**API:**

| Method | Returns | Description |
|--------|---------|-------------|
| `startCapture()` | `void` | Begin intercepting stdout |
| `stopCapture()` | `string` | Return accumulated rawLog |
| `clearCapture()` | `void` | Reset the buffer |
| `getSnapshot()` | `string` | Read buffer without stopping |

---

### `formatter.js` — ANSI Stripper + Markdown Wrapper

Uses `strip-ansi` to remove all escape sequences, applies optional line range, wraps output in a GitHub-renderable bash fenced code block.

```javascript
const stripAnsi = require('strip-ansi');

function format(rawLog, range) {
  let text = stripColors(rawLog);
  if (range) text = applyRange(text, range);
  return wrapMarkdown(text);
}

function stripColors(text) {
  return stripAnsi(text);
}

function applyRange(text, range) {
  const [start, end] = range.split('-').map(Number);
  return text.split('\n').slice(start - 1, end).join('\n');
}

function wrapMarkdown(text) {
  return '```bash\n' + text + '\n```';
}

module.exports = { format, stripColors, applyRange, wrapMarkdown };
```

**API:**

| Method | Returns | Description |
|--------|---------|-------------|
| `format(rawLog, range?)` | `string` | Main pipeline — full format |
| `stripColors(text)` | `string` | ANSI removal only |
| `applyRange(text, range)` | `string` | Slice by line range `"3-10"` |
| `wrapMarkdown(text)` | `string` | Wrap in ` ```bash ` fences |

---

### `auth.js` — GitHub Authentication

Reads `GITHUB_TOKEN` from environment. If missing, launches GitHub Device Flow OAuth so users authenticate without leaving the terminal.

```javascript
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_PATH = path.join(os.homedir(), '.cli-share', 'config.json');

async function getToken() {
  // 1. Check environment
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;

  // 2. Check saved config
  if (fs.existsSync(CONFIG_PATH)) {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    if (cfg.token && await validateToken(cfg.token)) return cfg.token;
  }

  // 3. Run device flow
  const token = await runDeviceFlow();
  saveToken(token);
  return token;
}

async function validateToken(token) {
  const octokit = new Octokit({ auth: token });
  try { await octokit.users.getAuthenticated(); return true; }
  catch { return false; }
}

function saveToken(token) {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ token }), { mode: 0o600 });
}

module.exports = { getToken, validateToken, saveToken, runDeviceFlow };
```

**API:**

| Method | Returns | Description |
|--------|---------|-------------|
| `getToken()` | `Promise<string>` | Resolve token or throw |
| `runDeviceFlow()` | `Promise<string>` | GitHub device OAuth |
| `saveToken(token)` | `void` | Persist to `~/.cli-share/config` |
| `validateToken(token)` | `Promise<boolean>` | Verify via `/user` endpoint |

---

### `uploader.js` — GitHub Gist Publisher

Uses `@octokit/rest` to create Gist. Handles filename, visibility, description. Returns the full HTML URL.

```javascript
const { Octokit } = require('@octokit/rest');

async function uploadGist(content, { token, isPublic, filename, description }) {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.gists.create({
    public: isPublic,
    description: description || 'Shared via CLI Share CLI',
    files: {
      [filename || 'cli-chat.md']: { content }
    }
  });

  return data.html_url;
}

module.exports = { uploadGist };
```

**API:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | Formatted markdown content |
| `opts.token` | `string` | GitHub Personal Access Token |
| `opts.isPublic` | `boolean` | `true` = public, `false` = secret |
| `opts.filename` | `string` | Default: `cli-chat.md` |
| `opts.description` | `string` | Gist description label |
| **Returns** | `Promise<string>` | Full Gist HTML URL |

---

## 2.4 GitHub Gist API Integration

### Endpoint

```
POST https://api.github.com/gists
Authorization: Bearer <GITHUB_TOKEN>
Content-Type: application/json
```

### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `public` | `boolean` | Yes | `true` = public gist, `false` = secret gist |
| `description` | `string` | No | Human-readable label shown on Gist page |
| `files` | `object` | Yes | Map of `filename → { content: string }` |
| `files["*.md"]` | `object` | Yes | At least one file required; use `.md` for rendering |

### Response Fields Used

| Field | Type | Usage |
|-------|------|-------|
| `data.html_url` | `string` | Final shareable URL shown to user + opened in browser |
| `data.id` | `string` | Gist ID stored locally for future edit/delete |
| `data.created_at` | `string` | Timestamp logged to `~/.cli-share/history.json` |

### Full Example Request

```javascript
const { Octokit } = require('@octokit/rest');

async function uploadGist(content, { token, isPublic, filename, description }) {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.gists.create({
    public: isPublic,
    description: description || 'Shared via CLI Share CLI',
    files: {
      [filename || 'cli-chat.md']: { content }
    }
  });

  // data.html_url → "https://gist.github.com/username/abc123"
  return data.html_url;
}
```

### Example Response

```json
{
  "id": "abc123def456",
  "html_url": "https://gist.github.com/username/abc123def456",
  "public": true,
  "description": "Shared via CLI Share CLI",
  "created_at": "2025-04-19T10:30:00Z",
  "files": {
    "cli-chat.md": {
      "filename": "cli-chat.md",
      "type": "text/plain",
      "size": 2048
    }
  }
}
```

---

## 2.5 CLI Package (`npx @saurav-shakya/cli-share`)

Full interactive CLI entry point with `inquirer` prompts.

```javascript
#!/usr/bin/env node

const inquirer = require('inquirer');
const { format }      = require('../core/formatter');
const { uploadGist }  = require('../core/uploader');
const { getToken }    = require('../core/auth');
const fs   = require('fs');
const open = require('open');
const chalk = require('chalk');

async function main() {
  // 1. Read captured log
  const logPath = process.env.CLI_SHARE_LOG || '/tmp/cli-session.log';
  if (!fs.existsSync(logPath)) {
    console.error(chalk.red('❌ Nothing captured. Start a session first.'));
    process.exit(1);
  }
  const rawLog = fs.readFileSync(logPath, 'utf8');

  if (!rawLog.trim()) {
    console.error(chalk.red('❌ Log is empty.'));
    process.exit(1);
  }

  // 2. Interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'What to share?',
      choices: ['Full Conversation', 'Custom Range']
    },
    {
      type: 'input',
      name: 'range',
      message: 'Enter range (e.g. 3-15):',
      when: (a) => a.mode === 'Custom Range',
      validate: (v) => /^\d+-\d+$/.test(v) || 'Format: start-end (e.g. 3-15)'
    },
    {
      type: 'list',
      name: 'visibility',
      message: 'Visibility?',
      choices: ['Public', 'Private']
    }
  ]);

  // 3. Format
  const content = format(rawLog, answers.range);

  // 4. Check content size (GitHub limit: 1MB)
  if (content.length > 1_000_000) {
    console.error(chalk.yellow('⚠️  Log too large. Please select a custom range.'));
    process.exit(1);
  }

  // 5. Auth
  const token = await getToken();

  // 6. Upload
  console.log(chalk.blue('⏳ Uploading to GitHub Gist...'));
  const url = await uploadGist(content, {
    token,
    isPublic: answers.visibility === 'Public',
    filename: `cli-chat-${Date.now()}.md`
  });

  // 7. Done
  console.log(chalk.green(`\n✅ Gist created: ${url}\n`));
  open(url);
}

main().catch((err) => {
  console.error(chalk.red(`❌ ${err.message}`));
  process.exit(1);
});
```

### `package.json` bin entry

```json
{
  "name": "@cli-share/cli",
  "version": "1.0.0",
  "bin": {
    "cli-share": "./index.js"
  },
  "dependencies": {
    "cli-share-core": "workspace:*",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0",
    "open": "^9.0.0"
  }
}
```

---

## 2.6 Claude Code Plugin Integration

### Slash Command Registration

Claude Code reads custom commands from `.claude/commands/` in any project directory.

**File:** `.claude/commands/share.md`

```markdown
---
description: Share this conversation to GitHub Gist
---

Execute the cli-share CLI: run `npx @saurav-shakya/cli-share` in the current terminal.
This will capture the session, prompt for options, and return a shareable GitHub Gist URL.
```

### Terminal Recording Wrapper

Since Claude Code controls its own stdout, the cleanest capture strategy is a transparent shell wrapper using the Unix `script` command:

```bash
#!/bin/bash
# ~/.local/bin/claude  ← rename real binary to claude-code-real

LOG=/tmp/cli-session-$(date +%s).log
export CLI_SHARE_LOG=$LOG

# 'script' transparently records everything printed to terminal
script -q -c "claude-code-real $@" $LOG
```

**Windows (PowerShell) equivalent:**

```powershell
# wrapper profile entry
$env:CLI_SHARE_LOG = "$env:TEMP\cli-session-$(Get-Date -Format 'yyyyMMddHHmmss').log"
Start-Transcript -Path $env:CLI_SHARE_LOG -Append
claude-code-real @args
Stop-Transcript
```

---

## 2.7 Authentication Flow

| Step | Title | Description |
|------|-------|-------------|
| 1 | Check ENV | Read `process.env.GITHUB_TOKEN` — if present, validate and proceed |
| 2 | Check Config | Read `~/.cli-share/config.json` — use saved token if valid |
| 3 | Device Flow | `POST /login/device/code` → display code + URL to user |
| 4 | Poll | `GET /login/oauth/access_token` every 5s until user authorizes |
| 5 | Save | Write token to `~/.cli-share/config.json` (chmod 600) |
| 6 | Continue | Proceed with upload using new token |

> **Required Scope:** GitHub personal access token needs only the `gist` scope. No repo, no user data access required. Principle of least privilege.

---

## 2.8 Dependencies

### Runtime

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@octokit/rest` | `^20.x` | GitHub Gist API client | MIT |
| `strip-ansi` | `^7.x` | Remove ANSI escape sequences | MIT |
| `inquirer` | `^9.x` | Interactive CLI prompts | MIT |
| `open` | `^9.x` | Open URL in default browser | MIT |
| `chalk` | `^5.x` | Terminal output styling | MIT |

### Dev

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `^5.x` | Type checking (optional but recommended) |
| `jest` | `^29.x` | Unit testing |
| `@types/node` | `^20.x` | Node.js type definitions |

### Install

```bash
# From monorepo root
npm install

# Or standalone
npm install @octokit/rest strip-ansi inquirer open chalk
npm install -D typescript jest @types/node
```

---

## 2.9 Error Handling Strategy

| Error Type | Code | User Message | Recovery |
|------------|------|--------------|---------|
| Empty capture buffer | `E001` | "Nothing captured. Start a session first." | Exit cleanly |
| Invalid line range | `E002` | "Range end must be greater than start." | Re-prompt |
| Content > 1MB | `E003` | "Log too large. Select a range." | Force range mode |
| 401 Unauthorized | `E004` | "GitHub auth failed. Re-authenticating..." | Restart auth flow |
| Network timeout | `E005` | "No internet. Draft saved locally." | Save to `/tmp` |
| 429 Rate Limited | `E006` | "GitHub rate limit. Retry in 60s." | Auto-retry with backoff |

```javascript
// Error handler pattern
async function safeUpload(content, opts) {
  try {
    return await uploadGist(content, opts);
  } catch (err) {
    if (err.status === 401) throw new AppError('E004', 'GitHub auth failed. Re-authenticating...');
    if (err.status === 429) throw new AppError('E006', 'Rate limited. Retry in 60s.');
    if (err.code === 'ENOTFOUND') {
      saveDraftLocally(content);
      throw new AppError('E005', 'No internet. Draft saved locally.');
    }
    throw err;
  }
}
```

---

## 2.10 Security Considerations

### Token Storage
Config stored at `~/.cli-share/config.json` with file permissions `600` (owner read/write only). Never committed to git — `.gitignore` template provided.

```bash
# .gitignore (auto-added by cli-share init)
.cli-share/
*.log
/tmp/cli-session*.log
```

### Scope Minimization
Only the `gist` scope is requested. The token cannot read repos, access org data, or modify user settings. Clearly communicated during auth flow.

### Sensitive Data Detection
CLI warns if log content contains patterns matching API keys before uploading:

```javascript
const SENSITIVE_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/,     // OpenAI keys
  /ghp_[a-zA-Z0-9]{36}/,     // GitHub PATs
  /Bearer\s+[a-zA-Z0-9+/=]{20,}/,  // Bearer tokens
  /AKIA[0-9A-Z]{16}/,        // AWS access keys
];

function checkSensitiveData(content) {
  return SENSITIVE_PATTERNS.some(p => p.test(content));
}
```

---

## 2.11 Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| v1.0 | `/share` command + GitHub Gist upload | 🏗️ Build now |
| v1.0 | `npx @saurav-shakya/cli-share` standalone CLI | 🏗️ Build now |
| v1.0 | Claude Code `/share` plugin | 🏗️ Build now |
| v1.1 | HTML export with ANSI color preservation | 📋 Planned |
| v1.1 | Session history dashboard (local) | 📋 Planned |
| v1.2 | One-click edit/delete of previous gists | 📋 Planned |
| v2.0 | `cli-share.dev` web gallery (opt-in public feed) | 🔮 Future |
| v2.0 | Team workspaces with private org sharing | 🔮 Future |

---

## 2.12 Quick Start (Dev Setup)

```bash
# 1. Clone and install
git clone https://github.com/yourname/cli-share
cd cli-share
npm install

# 2. Set GitHub token
export GITHUB_TOKEN=ghp_yourTokenHere

# 3. Link CLI globally
npm run build
npm link packages/cli

# 4. Start a Claude Code session with wrapper
cp packages/claude-plugin/wrapper.sh ~/.local/bin/claude
chmod +x ~/.local/bin/claude

# 5. Inside any session, type:
/share
```

---

*CLI Share CLI — Developer knowledge sharing infrastructure.*
*Built with Node.js · Ships as npm package + Claude Code plugin · MIT License*