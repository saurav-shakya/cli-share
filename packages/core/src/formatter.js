/**
 * @fileoverview Terminal output formatter with a built-in VT100 screen buffer emulator.
 *
 * AI CLI tools like Claude Code use rich terminal UIs with cursor movements,
 * line rewrites, progress spinners, and ANSI escape sequences. A naive
 * regex-based strip would leave behind broken animation frames and garbage text.
 *
 * This module solves the problem by simulating a virtual terminal screen buffer:
 * it processes every character, carriage return, backspace, and CSI escape
 * sequence (cursor up/down/forward/back, erase line, erase display) to produce
 * the final visible state of the terminal — exactly what the user saw on screen.
 *
 * The result is then optionally sliced by line range and wrapped in a Markdown
 * fenced code block for clean GitHub Gist rendering.
 *
 * @module cli-share/core/formatter
 */

// strip-ansi is an ESM-only package in v7+, so we import it asynchronously.
let stripAnsi;
(async () => {
    stripAnsi = (await import('strip-ansi')).default;
})();

/**
 * Main entry point: takes raw terminal output and returns clean Markdown.
 * @param {string} rawLog - The raw terminal capture including ANSI codes.
 * @param {string} [range] - Optional line range in "start-end" format (e.g. "5-20").
 * @returns {string} A Markdown-formatted fenced code block of the cleaned output.
 */
function format(rawLog, range) {
  let text = parseTerminal(rawLog);
  if (stripAnsi) text = stripAnsi(text);
  
  if (range) text = applyRange(text, range);
  return wrapMarkdown(text);
}

/**
 * VT100 Terminal Screen Buffer Emulator.
 *
 * Simulates a 2D character grid that processes raw terminal byte streams.
 * Handles the following control sequences:
 *   - \n   (Line Feed)      → Move cursor to next row, column 0
 *   - \r   (Carriage Return) → Reset cursor column to 0
 *   - \b   (Backspace)       → Move cursor one column left
 *   - ESC[nA (Cursor Up)     → Move cursor up n rows
 *   - ESC[nB (Cursor Down)   → Move cursor down n rows
 *   - ESC[nC (Cursor Forward) → Move cursor right n columns
 *   - ESC[nD (Cursor Back)    → Move cursor left n columns
 *   - ESC[nK (Erase in Line)  → Clear characters on the current line
 *   - ESC[nJ (Erase in Display) → Clear the entire screen buffer (mode 2)
 *
 * After processing, the grid is flattened into a plain-text string with
 * excess blank lines collapsed.
 *
 * @param {string} raw - Raw terminal output bytes.
 * @returns {string} The final visible screen content as plain text.
 */
function parseTerminal(raw) {
  const lines = [];   // 2D sparse array: lines[row][col] = character
  let x = 0;          // Current cursor column
  let y = 0;          // Current cursor row
  let max_y = 0;      // Tracks the furthest row written to

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (char === '\n') {
      // Line Feed: advance to next row, reset column
      y++;
      if (y > max_y) max_y = y;
      x = 0;
    } else if (char === '\r') {
      // Carriage Return: move cursor back to column 0 (used for line rewrites)
      x = 0;
    } else if (char === '\b' || char === '\x08') {
      // Backspace: shift cursor one position left
      if (x > 0) x--;
    } else if (char === '\x1b') {
      // ESC character: beginning of a CSI (Control Sequence Introducer) escape
      if (raw[i+1] === '[') {
         let j = i + 2;
         let argString = "";
         // Collect numeric arguments and separators (e.g., "38;2;255")
         while (j < raw.length && ((raw[j] >= '0' && raw[j] <= '9') || raw[j] === ';' || raw[j] === '?')) {
            argString += raw[j];
            j++;
         }
         const cmd = raw[j];  // The final command character (A, B, C, D, K, J, m, etc.)
         const args = argString.split(';').map(n => parseInt(n) || 1);

         // Cursor movement commands
         if (cmd === 'A') { y = Math.max(0, y - args[0]); }           // Cursor Up
         else if (cmd === 'B') { y += args[0]; if (y > max_y) max_y = y; }  // Cursor Down
         else if (cmd === 'C') { x += args[0]; }                       // Cursor Forward
         else if (cmd === 'D') { x = Math.max(0, x - args[0]); }      // Cursor Back
         else if (cmd === 'K') {
            // Erase in Line: clear from cursor to end of line (mode 0) or entire line (mode 2)
            if (!lines[y]) lines[y] = [];
            let arg0 = isNaN(args[0]) ? 0 : args[0];
            if (arg0 === 2) lines[y] = [];
            else lines[y].splice(x, lines[y].length - x);
         } else if (cmd === 'J') {
            // Erase in Display: mode 2 clears the entire screen
            let arg0 = isNaN(args[0]) ? 0 : args[0];
            if (arg0 === 2) {
               lines.length = 0;
               y = 0; x = 0; max_y = 0;
            }
         }
         // All other sequences (colors, modes, etc.) are silently consumed
         i = j;
      } else {
        // Two-character escape (e.g., ESC followed by a non-'[' char): skip it
        i++;
      }
    } else {
      // Visible character: write it to the screen buffer
      let code = char.charCodeAt(0);
      if (code >= 32 || code === 9) {
        if (code === 9) { x += 4; }  // Tab: advance 4 columns
        else {
          if (!lines[y]) lines[y] = [];
          lines[y][x] = char;
          x++;
        }
      }
      // Control characters below 32 (except tab) are silently ignored
    }
  }

  // Flatten the 2D buffer into a string, filling gaps with spaces
  let output = "";
  for (let row = 0; row <= max_y; row++) {
    if (lines[row]) {
       let rowStr = "";
       for (let col = 0; col < lines[row].length; col++) {
          rowStr += lines[row][col] || ' ';
       }
       output += rowStr.trimEnd() + '\n';
    } else {
       output += '\n';
    }
  }

  // Collapse runs of 4+ blank lines into 2, then trim leading/trailing whitespace
  return output.replace(/\n{4,}/g, '\n\n').trim();
}

/**
 * Legacy stub — retained for backward compatibility.
 * Color stripping is now handled by the parseTerminal + stripAnsi pipeline.
 * @param {string} text
 * @returns {string}
 */
function stripColors(text) {
  return text;
}

/**
 * Extracts a specific line range from the formatted text.
 * @param {string} text - The full formatted text.
 * @param {string} range - Range string in "start-end" format (1-indexed).
 * @returns {string} The sliced text containing only the requested lines.
 */
function applyRange(text, range) {
  const [start, end] = range.split('-').map(Number);
  return text.split('\n').slice(start - 1, end).join('\n');
}

/**
 * Wraps text in a Markdown fenced code block with bash syntax highlighting.
 * @param {string} text - The plain text to wrap.
 * @returns {string} Markdown-formatted output.
 */
function wrapMarkdown(text) {
  return '```bash\n' + text + '\n```';
}

module.exports = { format, parseTerminal, stripColors, applyRange, wrapMarkdown };

