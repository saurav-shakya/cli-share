/**
 * @fileoverview Uploads formatted terminal content to GitHub Gist via the Octokit REST API.
 * Supports configurable visibility (public/private) and custom filenames.
 * @module cli-share/core/uploader
 */

const { Octokit } = require('@octokit/rest');

/**
 * Creates a new GitHub Gist with the provided content.
 * @param {string} content - The Markdown-formatted terminal capture to upload.
 * @param {Object} options - Upload configuration.
 * @param {string} options.token - GitHub Personal Access Token with `gist` scope.
 * @param {boolean} options.isPublic - Whether the Gist should be publicly visible.
 * @param {string} [options.filename='cli-chat.md'] - The filename for the Gist file.
 * @param {string} [options.description] - Optional description for the Gist.
 * @returns {Promise<string>} The URL of the created Gist.
 */
async function uploadGist(content, { token, isPublic, filename, description }) {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.gists.create({
    public: isPublic,
    description: description || 'Shared via CLI Share',
    files: {
      [filename || 'cli-chat.md']: { content }
    }
  });

  return data.html_url;
}

module.exports = { uploadGist };

