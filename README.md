# 🚀 CLI Share

**Share your terminal conversations instantly as professional GitHub Gists.**

CLI Share is a powerful tool designed for developers using AI CLI tools (like Claude Code, Codex, and others). It captures your terminal session, cleans up the mess of ANSI codes and animations, and publishes a beautiful, readable Markdown file to GitHub Gists.

## ✨ Features

- **🎯 Instant Sharing**: One command (`/share`) to go from terminal to a shareable URL.
- **🛡️ Professional Formatting**: Built-in VT100 terminal emulator ensures that ASCII art, boxes, and layouts are perfectly preserved, unlike naive copy-pasting.
- **🤖 AI Optimized**: Specifically built to handle the rich, dynamic output of modern AI CLI tools.
- **🔒 Secure**: Handles GitHub authentication via environment variables or a secure local config (`~/.cli-share/config.json`).
- **💬 Claude Code Integration**: Includes a native slash command for seamless sharing within Claude Code sessions.

---

## 🚀 Installation

```bash
npm install -g @saurav-singh/cli-share
```

## 🛠️ Setup

1. **Authentication**:
   Ensure you have a [GitHub Personal Access Token](https://github.com/settings/tokens) with `gist` scope.
   
   You can either:
   - Export it: `export GITHUB_TOKEN=your_token`
   - Or save it: Our tool will prompt you once and save it to `~/.cli-share/config.json`.

## 🤖 Claude Code Integration

CLI Share works best when integrated directly into your **Claude Code** session as a slash command.

### Method A: Official Plugin (Recommended)
The easiest way to install CLI Share is using the native plugin system:
```bash
/plugin marketplace add saurav-shakya/cli-share
```

### Method B: Manual Skill Setup
If you prefer manual setup, copy the skill definition to your Claude config:
```bash
mkdir -p ~/.claude/commands/
cp packages/claude-plugin/commands/share.md ~/.claude/commands/
```

### 🔴 Essential: Enable Session Recording
Claude Code doesn't save your terminal output to a file by default. To share conversations, you must use our **session wrapper**:

1. Find your `claude` binary path: `which claude`
2. Rename it: `mv $(which claude) $(dirname $(which claude))/claude-code-real`
3. Link our wrapper: 
   ```bash
   ln -s $(pwd)/packages/claude-plugin/wrapper.sh /usr/local/bin/claude
   ```

Now, every time you run `claude`, it will be recorded and ready to share via `/share`.

---

## 📖 Usage

### Standard CLI

```bash
cli-share
```
This will launch an interactive wizard to choose:
1. **Full Conversation** or **Custom Range**
2. **Public** or **Private** visibility

### Non-Interactive (Conversational)

```bash
cli-share --full --public
cli-share --range=1-50 --private
```

### 🎨 How it looks in Claude Code

When you are in a Claude Code session, you can simply type `/share`:

```text
❯ /share
● Do you want to share the (1)Full Conversation or a (2)Custom Range?
  (3)Public or (4)Private?

❯ 1 and 3

● Uploading to GitHub Gist...
✅ Gist created: https://gist.github.com/saurav-singh/af12999ea...

● Your conversation has been shared publicly!
```

### 💡 Example Use Cases

*   **Example 1: Bug Debugging** 🐛
    You're working with Claude Code and hit a complex build error. Instead of copy-pasting lines, type `/share` and send the Gist link to a teammate. They'll see the exact terminal state, including color-coded errors.
*   **Example 2: Documentation & Tutorials** 📝
    Capturing a perfect "Getting Started" workflow? Use `cli-share` to generate a beautiful Markdown log that you can embed directly into your project's documentation or a blog post.
*   **Example 3: GitHub Issue Reporting** 🚩
    When reporting a CLI bug to an open-source project, provide a `cli-share` link. It gives maintainers a high-fidelity look at the terminal output, making it much easier for them to diagnose the issue.

---

## 🏗️ Monorepo Structure

- `packages/core`: The engine handling terminal parsing, formatting, and Gist uploading.
- `packages/cli`: The main command-line interface.
- `packages/claude-plugin`: Integration layer for Claude Code including a session wrapper.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔒 Security & Privacy

We take your security and privacy seriously:
- **Local Storage Only**: Your GitHub Personal Access Token is stored exclusively on your local machine in `~/.cli-share/config.json`.
- **Strict Permissions**: The configuration file is created with `600` permissions (read/write access only for the current user), preventing other users on the system from accessing it.
- **Direct Communication**: The tool communicates directly with the GitHub API. Your token is **never** sent to any third-party servers, analytics platforms, or middle-men.
- **Minimal Scopes**: We recommend creating a token with only the `gist` scope to ensure the tool has the minimum permissions necessary to function.

## 📜 License

MIT © 2026 CLI Share
