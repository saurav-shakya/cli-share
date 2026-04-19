/**
 * @fileoverview Handles GitHub authentication credentials via environmental variables,
 * locally stored configuration files, and GitHub OAuth Device Flow (placeholder).
 * @module cli-share/core/auth
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const os = require('os');
const path = require('path');
const open = require('open');

// Config directory for persistent token storage
const CONFIG_PATH = path.join(os.homedir(), '.cli-share', 'config.json');

/**
 * Retrieves a valid GitHub token from the environment, local config, or starts OAuth.
 * @returns {Promise<string>} A validated GitHub Personal Access Token.
 */
async function getToken() {
  // 1. Check environment variables
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;

  // 2. Check local saved configuration
  if (fs.existsSync(CONFIG_PATH)) {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    if (cfg.token && await validateToken(cfg.token)) return cfg.token;
  }

  // 3. Run OAuth Device flow if no token is found
  const token = await runDeviceFlow();
  saveToken(token);
  return token;
}

/**
 * Validates a GitHub token by testing it against the authenticated user endpoint.
 * @param {string} token - The GitHub token to validate.
 * @returns {Promise<boolean>} Resolves to true if valid, false otherwise.
 */
async function validateToken(token) {
  const octokit = new Octokit({ auth: token });
  try { 
    await octokit.users.getAuthenticated(); 
    return true; 
  }
  catch { return false; }
}

/**
 * Saves a GitHub token to the local config securely.
 * Permissions are set to 600 to prevent unauthorized local file access.
 * @param {string} token - The token to persist.
 */
function saveToken(token) {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ token }), { mode: 0o600 });
}

/**
 * Prompts the user to manually input a GitHub Personal Access Token (PAT).
 * This is the fallback for when no environment variable or config file is found.
 * @returns {Promise<string>} The user-provided token.
 */
async function promptForToken() {
  const inquirer = (await import('inquirer')).default;
  const chalk = (await import('chalk')).default;

  console.log(chalk.yellow('\n🔑 No GitHub token found.'));
  console.log(chalk.gray('To share conversations, you need a GitHub Personal Access Token with "gist" scope.'));
  console.log(chalk.gray('Create one here: https://github.com/settings/tokens\n'));

  const { token } = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message: 'Enter your GitHub Personal Access Token:',
      validate: (input) => input.length > 0 || 'Token cannot be empty.'
    }
  ]);

  if (await validateToken(token)) {
    console.log(chalk.green('✅ Token validated and saved successfully!\n'));
    return token;
  } else {
    console.error(chalk.red('❌ Invalid token. Please check your permissions and try again.'));
    process.exit(1);
  }
}

/**
 * Initializes the GitHub OAuth Device Authorization Flow or Manual Prompt.
 * @returns {Promise<string>} The generated or provided token.
 */
async function runDeviceFlow() {
  // We fall back to manual PAT prompt for now as it's more reliable for CLI users
  // without a pre-registered OAuth Application.
  return await promptForToken();
}

module.exports = { getToken, validateToken, saveToken, runDeviceFlow };
