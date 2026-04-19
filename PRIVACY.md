# Privacy Policy for CLI Share

CLI Share ("we," "us," or "our") is an open-source tool. This Privacy Policy explains how we handle data.

## 1. No Data Collection
CLI Share is a local-first tool. We **do not collect, store, or transmit** any of your personal data, terminal logs, or metadata to our own servers. 

## 2. GitHub Authentication
To use the sharing feature, you must provide a GitHub Personal Access Token. 
- **Local Storage**: This token is stored exclusively on your local machine in `~/.cli-share/config.json`.
- **Encryption/Protection**: The file is protected with `600` permissions (restricted to the current user).
- **Direct Communication**: The tool communicates directly with the GitHub API. Your token is never shared with us or any third party.

## 3. Terminal Logs
Terminal logs are captured locally into a temporary file (`/tmp/cli-session.log`). These logs are only uploaded to GitHub Gists when you explicitly trigger the `/share` or `cli-share` command.

## 4. Third-Party Services
We use the GitHub Gist API to host your shared conversations. Your use of this feature is subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

## 5. Contact
For any questions regarding privacy, please open an issue on our [GitHub Repository](https://github.com/saurav-shakya/cli-share).
