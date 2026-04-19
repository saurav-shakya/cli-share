/**
 * @fileoverview Central export barrel for the cli-share-core package.
 * Re-exports all public APIs from the sub-modules so consumers can do:
 *
 *   const { format, uploadGist, getToken } = require('cli-share-core');
 *
 * @module cli-share/core
 */

const { format, parseTerminal, stripColors, applyRange, wrapMarkdown } = require('./formatter.js');
const { uploadGist } = require('./uploader.js');
const { getToken, validateToken, saveToken, runDeviceFlow } = require('./auth.js');
const { startCapture, stopCapture, clearCapture, getSnapshot } = require('./capture.js');

module.exports = {
  // Formatter — VT100 terminal emulation and Markdown output
  format,
  parseTerminal,
  stripColors,
  applyRange,
  wrapMarkdown,

  // Uploader — GitHub Gist API integration
  uploadGist,

  // Auth — Token management and OAuth device flow
  getToken,
  validateToken,
  saveToken,
  runDeviceFlow,

  // Capture — In-process stdout interception
  startCapture,
  stopCapture,
  clearCapture,
  getSnapshot,
};
