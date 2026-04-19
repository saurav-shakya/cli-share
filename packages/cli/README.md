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
npm install -g @saurav-shakya/cli-share
```

## 🛠️ Setup

1. **Authentication**:
   Ensure you have a [GitHub Personal Access Token](https://github.com/settings/tokens) with `gist` scope.
   
   You can either:
   - Export it: `export GITHUB_TOKEN=your_token`
   - Or save it: Our tool will prompt you once and save it to `~/.cli-share/config.json`.

2. **Claude Code Integration**:
   If you use Claude Code, you can use our wrapper to enable conversational sharing.
   See [packages/claude-plugin](packages/claude-plugin/README.md) for details.

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
