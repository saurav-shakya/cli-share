/**
 * @fileoverview In-process stdout capture utility.
 * Monkey-patches process.stdout.write to intercept all terminal output
 * into a buffer, while still passing data through to the real stdout.
 *
 * Note: For Claude Code integration, the shell `wrapper.sh` (using the
 * `script` command) is the primary capture mechanism. This module serves
 * as an alternative for direct Node.js process capture scenarios.
 *
 * @module cli-share/core/capture
 */

const { Transform } = require('stream');

/** @type {string} Internal buffer holding all captured stdout output. */
let rawLog = '';

/**
 * Begins capturing all stdout output by wrapping process.stdout.write.
 * Every chunk written to stdout is appended to the internal buffer.
 */
function startCapture() {
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk, ...args) => {
    rawLog += chunk.toString();
    return original(chunk, ...args);
  };
}

/**
 * Stops capturing and returns the accumulated raw log.
 * @returns {string} The full captured stdout content.
 */
function stopCapture()  { return rawLog; }

/**
 * Clears the internal capture buffer.
 */
function clearCapture() { rawLog = ''; }

/**
 * Returns the current snapshot of the capture buffer without stopping.
 * @returns {string} The current captured content.
 */
function getSnapshot()  { return rawLog; }

module.exports = { startCapture, stopCapture, clearCapture, getSnapshot };

