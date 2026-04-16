#!/usr/bin/env bash
# user-views-mobile-feed.spec.sh — E2E scenario: mobile single-column feed layout
#
# Covers: app/assets/scss/_feed-grid.scss.ab app/app/post/post.directive.js.ab
#
set -euo pipefail
source "$(dirname "$0")/_lib/playwright-wrapper.sh"
SCENARIO_ARTIFACTS="${E2E_ARTIFACTS_DIR:-.artifacts/playwright-cli}/mobile-feed"
mkdir -p "$SCENARIO_ARTIFACTS"
FAILED=0

E2E_API_URL="${E2E_API_URL:-http://localhost:8000}"

# --- Per-run account isolation ---
RANDOM_ID=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 6)
E2E_USER_EMAIL="e2e.mobileuser+${RANDOM_ID}@test.local"
E2E_USER_PASSWORD="Test1234!"
E2E_USER_ID=""

setup_accounts() {
  local response user_id
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_USER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"Mobile\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[mobile-feed] SETUP FAIL: could not create user account" >&2; exit 1
  }
  user_id=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || user_id=""
  E2E_USER_ID="$user_id"
  echo "[mobile-feed] Setup: created test user ${E2E_USER_EMAIL}"
}
setup_accounts

teardown_accounts() {
  local token=""
  token=$(curl -sf -X POST "${E2E_API_URL}/tuyo_login/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_USER_EMAIL}\",\"password\":\"${E2E_USER_PASSWORD}\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null) || token=""
  if [ -n "$token" ] && [ -n "$E2E_USER_ID" ]; then
    curl -sf -X DELETE "${E2E_API_URL}/users/${E2E_USER_ID}/" \
      -H "Authorization: Token ${token}" || true
  fi
  echo "[mobile-feed] Teardown: removed test user"
}

# --- Helper: count cards in the first row to determine column count ---
# Returns the number of cards sharing the same top position as the first card.
# col_count=1 means single-column layout; col_count=3 means 3-column layout.

# --- Scenario A: Single-column layout on mobile (375px and 767px) ---
# Scenarios A and B share a single login session across viewport changes.
scenario_a_and_b() {
  local SFAILED=0
  local _email="${E2E_USER_EMAIL}" _password="${E2E_USER_PASSWORD}"

  # Open at 375x812 (mobile)
  pwcli open "$E2E_BASE_URL" --browser=chromium
  pwcli run-code "async page => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForSelector('.btn-empty-black', { timeout: 15000 });
    await page.click('.btn-empty-black');
    await page.waitForSelector('#iniciar-sesion', { state: 'visible', timeout: 8000 });
    await page.fill('#iniciar-sesion input[name=\"email\"]', '$_email');
    await page.fill('#iniciar-sesion input[name=\"password\"]', '$_password');
    await page.click('#loginButton');
    await page.waitForSelector('#dashboard', { timeout: 20000 });
    await page.waitForSelector('.feed-grid > .anchor', { timeout: 20000 });
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    # AC1/AC4 ABSENT: Single-column at 375px
    pwcli run-code "async page => {
      const check = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
        if (anchors.length === 0) return { error: 'no cards found' };
        const firstTop = anchors[0].getBoundingClientRect().top;
        const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
        const firstCardWidth = anchors[0].getBoundingClientRect().width;
        const viewportWidth = window.innerWidth;
        return {
          colCount: firstRowCount,
          cardWidth: firstCardWidth,
          viewportWidth
        };
      });
      if (check.error) throw new Error('AC1 FAIL: ' + check.error);
      if (check.colCount !== 1) {
        throw new Error('AC1/AC4 FAIL ABSENT: at 375px expected single-column, first row has ' + check.colCount + ' cards');
      }
      // AC2: Card fills viewport width (standard mobile)
      if (check.cardWidth < check.viewportWidth * 0.8) {
        throw new Error('AC2 FAIL: card width (' + check.cardWidth + 'px) too narrow for mobile viewport (' + check.viewportWidth + 'px)');
      }
    }" || SFAILED=1
  fi

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/single-column-375.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/single-column-375.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-375px.png" || true
  fi

  # BV-1: At 767px — still single-column
  local SFAILED_BV1=0
  pwcli run-code "async page => {
    await page.setViewportSize({ width: 767, height: 812 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      const count = Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return count === 1;
    }, { timeout: 5000 });
    const check767 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 2) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return { colCount: firstRowCount };
    });
    if (!check767.skip && check767.colCount !== 1) {
      throw new Error('AC3/BV-1 FAIL: at 767px expected single-column, first row has ' + check767.colCount + ' cards');
    }
  }" || SFAILED_BV1=1

  if [ "$SFAILED_BV1" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/single-column-767.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/single-column-767.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-767px.png" || true
    SFAILED=1
  fi

  # BV-2/Scenario B cross-reference: At 768px — 3-column grid activates
  local SFAILED_BV2=0
  pwcli run-code "async page => {
    await page.setViewportSize({ width: 768, height: 812 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      const count = Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return count >= 3;
    }, { timeout: 5000 });
    const check768 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return { colCount: firstRowCount };
    });
    if (!check768.skip && check768.colCount < 3) {
      throw new Error('AC3/BV-2 FAIL: at 768px expected 3-column grid, first row has ' + check768.colCount + ' cards');
    }
  }" || SFAILED_BV2=1

  if [ "$SFAILED_BV2" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/desktop-768.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/desktop-768.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-768px.png" || true
    SFAILED=1
  fi

  # AC5 ABSENT: No layout regression (no 3-column on mobile viewports already checked above)
  # AC5 ABSENT: No notice wider than viewport on mobile
  pwcli run-code "async page => {
    await page.setViewportSize({ width: 375, height: 812 });
    const check = await page.evaluate(() => {
      const vw = window.innerWidth;
      const noticeCards = document.querySelectorAll('.feed-grid-full-width');
      const overflowing = Array.from(noticeCards).filter(n => n.getBoundingClientRect().width > vw + 5);
      const hasHScrollbar = document.body.scrollWidth > document.body.clientWidth + 5;
      return { overflowCount: overflowing.length, hasHScrollbar };
    });
    if (check.overflowCount > 0) throw new Error('AC5 FAIL ABSENT: notice card wider than viewport on mobile');
    if (check.hasHScrollbar) throw new Error('AC5 FAIL ABSENT: horizontal scrollbar visible on mobile — layout overflow');
  }" || SFAILED=1

  pwcli close || true
  return "$SFAILED"
}
echo "[mobile-feed] $(date '+%H:%M:%S') Running Scenarios A+B (mobile viewports + cross-reference)..."
if scenario_a_and_b; then
  echo "[mobile-feed] $(date '+%H:%M:%S') Scenarios A+B PASSED"
else
  echo "[mobile-feed] $(date '+%H:%M:%S') Scenarios A+B FAILED" >&2
  FAILED=1
fi

# --- Teardown (always runs, even on failure) ---
echo "[mobile-feed] Teardown: cleaning up test account ${E2E_USER_EMAIL}..."
teardown_accounts

[ "$FAILED" -eq 0 ]
