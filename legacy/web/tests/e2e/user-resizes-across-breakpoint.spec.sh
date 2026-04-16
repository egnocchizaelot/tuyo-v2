#!/usr/bin/env bash
# user-resizes-across-breakpoint.spec.sh — E2E scenario: responsive layout transition on window resize
#
# Covers: app/assets/scss/_feed-grid.scss.ab app/app/post/post.directive.js.ab
#
set -euo pipefail
source "$(dirname "$0")/_lib/playwright-wrapper.sh"
SCENARIO_ARTIFACTS="${E2E_ARTIFACTS_DIR:-.artifacts/playwright-cli}/resize-breakpoint"
mkdir -p "$SCENARIO_ARTIFACTS"
FAILED=0

E2E_API_URL="${E2E_API_URL:-http://localhost:8000}"

# --- Per-run account isolation ---
RANDOM_ID=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 6)
E2E_USER_EMAIL="e2e.resizeuser+${RANDOM_ID}@test.local"
E2E_USER_PASSWORD="Test1234!"
E2E_USER_ID=""

setup_accounts() {
  local response user_id
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_USER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"Resize\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[resize-breakpoint] SETUP FAIL: could not create user account" >&2; exit 1
  }
  user_id=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || user_id=""
  E2E_USER_ID="$user_id"
  echo "[resize-breakpoint] Setup: created test user ${E2E_USER_EMAIL}"
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
  echo "[resize-breakpoint] Teardown: removed test user"
}

# --- Helper: detect column count from card row positions ---
# Called inside pwcli run-code via page.evaluate — returns the number of cards in the first row.
_GET_COL_COUNT_JS='(() => {
  const anchors = Array.from(document.querySelectorAll(".feed-grid > .anchor:not(.feed-grid-full-width)"));
  if (anchors.length === 0) return 0;
  const firstTop = anchors[0].getBoundingClientRect().top;
  return anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
})()'

# All resize scenarios share one browser session (viewport resizes happen in the same session).
# Open and login once, then run all scenarios, close at the end.

_email="${E2E_USER_EMAIL}"
_password="${E2E_USER_PASSWORD}"

pwcli open "$E2E_BASE_URL" --browser=chromium
pwcli run-code "async page => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForSelector('.btn-empty-black', { timeout: 15000 });
  await page.click('.btn-empty-black');
  await page.waitForSelector('#iniciar-sesion', { state: 'visible', timeout: 8000 });
  await page.fill('#iniciar-sesion input[name=\"email\"]', '$_email');
  await page.fill('#iniciar-sesion input[name=\"password\"]', '$_password');
  await page.click('#loginButton');
  await page.waitForSelector('#dashboard', { timeout: 20000 });
  await page.waitForSelector('.feed-grid > .anchor', { timeout: 20000 });
}" || { echo "[resize-breakpoint] LOGIN FAIL" >&2; pwcli close || true; exit 1; }

# Scroll down to establish scroll position for AC3/AC8 testing
pwcli run-code "async page => {
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(200);
}"

# --- Scenario A: Desktop to mobile resize ---
scenario_a() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Start at desktop: verify 3-column
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length >= 3;
    }, { timeout: 5000 });

    // Capture scroll position before resize
    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Note the URL before resize (AC7 ABSENT: no page reload)
    const urlBefore = page.url();

    // Resize to 767px (below breakpoint)
    await page.setViewportSize({ width: 767, height: 800 });

    // AC1: Layout switches to single-column
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length === 1;
    }, { timeout: 5000 });

    const colCount = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 2) return -1;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
    });
    if (colCount !== -1 && colCount !== 1) {
      throw new Error('AC1 FAIL: after resize to 767px expected single-column, got ' + colCount + ' cards in first row');
    }

    // AC7 ABSENT: URL unchanged — no full-page reload
    const urlAfter = page.url();
    if (urlAfter !== urlBefore) {
      throw new Error('AC7 FAIL ABSENT: URL changed after resize (from ' + urlBefore + ' to ' + urlAfter + ')');
    }

    // AC3/AC8 ABSENT: Scroll position preserved (within 150px tolerance for layout reflow)
    const scrollAfter = await page.evaluate(() => window.scrollY);
    if (Math.abs(scrollAfter - scrollBefore) > 150) {
      throw new Error('AC3/AC8 FAIL ABSENT: scroll position changed significantly after resize (' +
        scrollBefore + ' -> ' + scrollAfter + ')');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/desktop-to-mobile.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/desktop-to-mobile.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-a.png" || true
  fi
  return "$SFAILED"
}
echo "[resize-breakpoint] $(date '+%H:%M:%S') Running Scenario A: desktop to mobile..."
if scenario_a; then
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Scenario A PASSED"
else
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Scenario A FAILED" >&2
  FAILED=1
fi

# --- Boundary: Minimum delta 769px → 767px ---
scenario_a_boundary() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Start at 769px — should be 3-column (above breakpoint)
    await page.setViewportSize({ width: 769, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length >= 3;
    }, { timeout: 5000 });
    const at769 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      return { colCount: anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length };
    });
    if (!at769.skip && at769.colCount < 3) {
      throw new Error('BV-1 FAIL: at 769px expected 3-column, got ' + at769.colCount);
    }

    // Resize to 767px — should switch to single-column
    await page.setViewportSize({ width: 767, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length === 1;
    }, { timeout: 5000 });
    const at767 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 2) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      return { colCount: anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length };
    });
    if (!at767.skip && at767.colCount !== 1) {
      throw new Error('AC5 BV-1 FAIL: after 769->767px resize expected single-column, got ' + at767.colCount);
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/boundary-769-to-767.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/boundary-769-to-767.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-boundary-769-to-767.png" || true
  fi
  return "$SFAILED"
}
echo "[resize-breakpoint] $(date '+%H:%M:%S') Running Boundary: 769px to 767px..."
if scenario_a_boundary; then
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Boundary 769→767 PASSED"
else
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Boundary 769→767 FAILED" >&2
  FAILED=1
fi

# --- Scenario B: Mobile to desktop resize ---
scenario_b() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Ensure we're at 767px (mobile) from prior scenario
    await page.setViewportSize({ width: 767, height: 800 });
    const scrollBefore = await page.evaluate(() => window.scrollY);
    const urlBefore = page.url();

    // Resize to 1280px (desktop)
    await page.setViewportSize({ width: 1280, height: 800 });

    // AC2: Layout switches to 3-column
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length >= 3;
    }, { timeout: 5000 });

    const colCount = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return -1;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
    });
    if (colCount !== -1 && colCount < 3) {
      throw new Error('AC2 FAIL: after resize to 1280px expected 3-column grid, got ' + colCount + ' cards in first row');
    }

    // AC7 ABSENT: URL unchanged
    const urlAfter = page.url();
    if (urlAfter !== urlBefore) {
      throw new Error('AC7 FAIL ABSENT: URL changed after mobile-to-desktop resize');
    }

    // AC3/AC8 ABSENT: Scroll position preserved
    const scrollAfter = await page.evaluate(() => window.scrollY);
    if (Math.abs(scrollAfter - scrollBefore) > 200) {
      throw new Error('AC3/AC8 FAIL ABSENT: scroll position changed significantly after resize (' +
        scrollBefore + ' -> ' + scrollAfter + ')');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/mobile-to-desktop.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/mobile-to-desktop.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-b.png" || true
  fi
  return "$SFAILED"
}
echo "[resize-breakpoint] $(date '+%H:%M:%S') Running Scenario B: mobile to desktop..."
if scenario_b; then
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Scenario B PASSED"
else
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Scenario B FAILED" >&2
  FAILED=1
fi

# --- Boundary: Minimum delta 767px → 769px ---
scenario_b_boundary() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Start at 767px — single-column
    await page.setViewportSize({ width: 767, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length === 1;
    }, { timeout: 5000 });

    // Resize to 769px — should switch to 3-column
    await page.setViewportSize({ width: 769, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length >= 3;
    }, { timeout: 5000 });

    const at769 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      return { colCount: anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length };
    });
    if (!at769.skip && at769.colCount < 3) {
      throw new Error('AC6 BV-2 FAIL: after 767->769px resize expected 3-column, got ' + at769.colCount);
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/boundary-767-to-769.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/boundary-767-to-769.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-boundary-767-to-769.png" || true
  fi
  return "$SFAILED"
}
echo "[resize-breakpoint] $(date '+%H:%M:%S') Running Boundary: 767px to 769px..."
if scenario_b_boundary; then
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Boundary 767→769 PASSED"
else
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Boundary 767→769 FAILED" >&2
  FAILED=1
fi

# --- Rapid resize stress test (EQ-3) ---
scenario_rapid_resize() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Rapid resize across breakpoint multiple times
    const widths = [1280, 600, 1280, 600, 1280];
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      // No artificial delay — just set and move on (stress test)
    }

    // After final resize to 1280px, verify 3-column is correctly rendered
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length >= 3;
    }, { timeout: 8000 });

    const result = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      // Check for overlapping cards (visual glitch indicator)
      const rects = anchors.slice(0, 6).map(a => a.getBoundingClientRect());
      let hasOverlap = false;
      for (let i = 0; i < rects.length - 1; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          if (rects[i].right > rects[j].left + 5 && rects[i].bottom > rects[j].top + 5 &&
              rects[i].left < rects[j].right - 5 && rects[i].top < rects[j].bottom - 5) {
            hasOverlap = true;
          }
        }
      }
      return { colCount: firstRowCount, hasOverlap };
    });

    if (!result.skip && result.colCount < 3) {
      throw new Error('AC4 FAIL EQ-3: after rapid resize, expected 3-column at 1280px, got ' + result.colCount + ' in first row');
    }
    if (result.hasOverlap) {
      throw new Error('AC4 FAIL EQ-3: cards are overlapping after rapid resize — visual glitch detected');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/rapid-resize-final.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/rapid-resize-final.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-rapid-resize.png" || true
  fi
  return "$SFAILED"
}
echo "[resize-breakpoint] $(date '+%H:%M:%S') Running Rapid Resize stress test..."
if scenario_rapid_resize; then
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Rapid Resize PASSED"
else
  echo "[resize-breakpoint] $(date '+%H:%M:%S') Rapid Resize FAILED" >&2
  FAILED=1
fi

# Close the shared browser session
pwcli close || true

# --- Teardown (always runs, even on failure) ---
echo "[resize-breakpoint] Teardown: cleaning up test account ${E2E_USER_EMAIL}..."
teardown_accounts

[ "$FAILED" -eq 0 ]
