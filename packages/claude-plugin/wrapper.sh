#!/bin/bash
# ============================================================================
# CLI Share — Claude Code Session Wrapper
# ============================================================================
#
# This script replaces the `claude` binary so that every Claude Code session
# is transparently recorded to a log file. The `script` command allocates a
# pseudo-terminal (PTY) and captures all raw bytes written to stdout — including
# ANSI escape sequences, cursor movements, and Unicode box-drawing characters.
#
# Setup:
#   1. Rename the real Claude binary:  mv ~/.local/bin/claude ~/.local/bin/claude-code-real
#   2. Symlink this wrapper:           ln -s /path/to/wrapper.sh ~/.local/bin/claude
#   3. Ensure this file is executable: chmod +x /path/to/wrapper.sh
#
# The cli-share CLI reads CLI_SHARE_LOG to find the recorded session.
# ============================================================================

# Generate a unique log filename using the current Unix timestamp
LOG=/tmp/cli-session-$(date +%s).log

# Export the log path so child processes (like npx cli-share) can find it
export CLI_SHARE_LOG=$LOG

# Use `script` to transparently record everything printed to the terminal.
# -q: quiet mode (suppress script's own start/stop messages)
# -c: the command to execute inside the recorded PTY
script -q -c "claude-code-real $@" "$LOG"

