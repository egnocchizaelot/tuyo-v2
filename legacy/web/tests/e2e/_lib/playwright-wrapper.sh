#!/usr/bin/env bash
# playwright-wrapper.sh — thin wrapper for playwright-cli in E2E scenario scripts
# Source this file at the top of each *.spec.sh scenario:
#   source "$(dirname "$0")/_lib/playwright-wrapper.sh"

set -euo pipefail

# Use globally installed playwright-cli, fall back to npx
_PWCLI_BIN=""
if command -v playwright-cli &>/dev/null; then
  _PWCLI_BIN="playwright-cli"
elif npx --yes @playwright/cli --version &>/dev/null 2>&1; then
  _PWCLI_BIN="npx @playwright/cli"
else
  echo "ERROR: playwright-cli not found. Install it globally: pnpm add -g @playwright/cli@latest" >&2
  exit 1
fi

# pwcli — invoke playwright-cli, forwarding all arguments
pwcli() {
  $_PWCLI_BIN "$@"
}

export -f pwcli

# pwcli_wait_for — retry a pwcli eval assertion until it matches or times out
#
# Usage: pwcli_wait_for <js_expression> <grep_pattern> <timeout_seconds> <description>
#
# Evaluates <js_expression> via `pwcli eval` every 1s. If the output matches
# <grep_pattern> (via grep -q), returns 0. If <timeout_seconds> elapses without
# a match, prints a FAIL message to stderr and returns 1.
#
# Examples:
#   pwcli_wait_for "window.location.pathname" '"/dashboard"' 10 "redirect to dashboard"
#   pwcli_wait_for "!!document.querySelector('[data-testid=modal]')" 'true' 5 "modal visible"
#
pwcli_wait_for() {
  local expr="$1"
  local pattern="$2"
  local timeout="${3:-10}"
  local desc="${4:-assertion}"
  local elapsed=0
  local result=""

  while [ "$elapsed" -lt "$timeout" ]; do
    result=$(pwcli eval "$expr" 2>/dev/null) || true
    if echo "$result" | grep -q "$pattern"; then
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done

  # Final attempt — let it fail loudly
  result=$(pwcli eval "$expr" 2>/dev/null) || true
  if echo "$result" | grep -q "$pattern"; then
    return 0
  fi

  echo "WAIT_FOR TIMEOUT after ${timeout}s: $desc (expected pattern: $pattern, got: $result)" >&2
  return 1
}
export -f pwcli_wait_for
