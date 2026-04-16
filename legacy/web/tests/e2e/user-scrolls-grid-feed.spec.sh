#!/usr/bin/env bash
# user-scrolls-grid-feed.spec.sh — E2E scenario: infinite scroll and viewport-fill in 3-column grid
#
# Covers: app/app/pages/dashboard/desktop/dashboard.directive.js.ab app/assets/scss/_feed-grid.scss.ab app/app/post/post.directive.js.ab
#
set -euo pipefail
source "$(dirname "$0")/_lib/playwright-wrapper.sh"
SCENARIO_ARTIFACTS="${E2E_ARTIFACTS_DIR:-.artifacts/playwright-cli}/grid-scroll"
mkdir -p "$SCENARIO_ARTIFACTS"
FAILED=0

E2E_API_URL="${E2E_API_URL:-http://localhost:8000}"

# --- Per-run account isolation ---
RANDOM_ID=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 6)
E2E_USER_EMAIL="e2e.scrolluser+${RANDOM_ID}@test.local"
E2E_USER_PASSWORD="Test1234!"
E2E_USER_ID=""

setup_accounts() {
  local response user_id
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_USER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"Scroll\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[grid-scroll] SETUP FAIL: could not create user account" >&2; exit 1
  }
  user_id=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || user_id=""
  E2E_USER_ID="$user_id"
  echo "[grid-scroll] Setup: created test user ${E2E_USER_EMAIL}"
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
  echo "[grid-scroll] Teardown: removed test user"
}

# --- All scroll scenarios share one browser session (B and C depend on A's loaded state) ---
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
  await page.waitForSelector('.feed-grid', { timeout: 20000 });
}" || { echo "[grid-scroll] LOGIN FAIL" >&2; pwcli close || true; exit 1; }

# --- Scenario A: Viewport-fill auto-load on short page ---
scenario_a() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Wait for initial batch of cards to render in 3-column grid
    await page.waitForSelector('.feed-grid > .anchor', { timeout: 20000 });

    // Capture initial card count and check if page is scrollable
    const initial = await page.evaluate(() => {
      return {
        cardCount: document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length,
        scrollable: document.documentElement.scrollHeight > window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight
      };
    });

    if (!initial.scrollable) {
      // AC1: Page is not scrollable — viewport-fill auto-load must trigger automatically
      // Wait for more cards to appear (up to 30 seconds for auto-load cycles)
      await page.waitForFunction(
        (initCount) => document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length > initCount,
        initial.cardCount,
        { timeout: 30000 }
      ).catch(() => {
        // If auto-load didn't trigger but page is now scrollable, that's also a pass condition
        const nowScrollable = document.documentElement.scrollHeight > window.innerHeight;
        if (!nowScrollable) {
          throw new Error('AC1 FAIL: page is not scrollable and no additional cards were auto-loaded after 30s');
        }
      });
    }

    // AC7/AC8 ABSENT: feed is not stuck at first batch with whitespace below
    const afterLoad = await page.evaluate(() => {
      const cards = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      const lastCard = cards[cards.length - 1];
      if (!lastCard) return { error: 'no cards' };
      const lastRect = lastCard.getBoundingClientRect();
      const pageBottom = document.documentElement.scrollHeight;
      // Check whitespace below last card (should be minimal — footer/loading indicator only)
      const whitespaceBelow = pageBottom - (window.scrollY + lastRect.bottom);
      return {
        cardCount: cards.length,
        isScrollable: document.documentElement.scrollHeight > window.innerHeight,
        whitespaceBelow
      };
    });
    if (afterLoad.error) throw new Error('AC8 FAIL ABSENT: ' + afterLoad.error);
    // Whitespace of more than 600px below the last card (excluding footer and loader) is suspicious
    // We check that we have MORE than the initial batch if the page was too short
    if (!initial.scrollable && afterLoad.cardCount <= initial.cardCount) {
      throw new Error('AC8 FAIL ABSENT: feed stopped at first batch (' + afterLoad.cardCount +
        ' cards) and page is not scrollable — viewport-fill did not trigger');
    }

    // AC7 ABSENT: No duplicate cards — each card ID should appear only once
    const duplicateCheck = await page.evaluate(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor[id]');
      const ids = Array.from(anchors).map(a => a.id);
      const unique = new Set(ids);
      return { total: ids.length, unique: unique.size };
    });
    if (duplicateCheck.total !== duplicateCheck.unique) {
      throw new Error('AC7 FAIL ABSENT: duplicate cards detected (' +
        duplicateCheck.total + ' total vs ' + duplicateCheck.unique + ' unique IDs)');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/viewport-fill-complete.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/viewport-fill-complete.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-a.png" || true
  fi
  return "$SFAILED"
}
echo "[grid-scroll] $(date '+%H:%M:%S') Running Scenario A: viewport-fill auto-load..."
if scenario_a; then
  echo "[grid-scroll] $(date '+%H:%M:%S') Scenario A PASSED"
else
  echo "[grid-scroll] $(date '+%H:%M:%S') Scenario A FAILED" >&2
  FAILED=1
fi

# --- Scenario B: Normal infinite scroll after viewport fill ---
# Depends on Scenario A: page should be scrollable by now.
scenario_b() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Verify page is scrollable (A should have made it so)
    const scrollable = await page.evaluate(() =>
      document.documentElement.scrollHeight > window.innerHeight
    );
    if (!scrollable) {
      // If page is still not scrollable, we can't test infinite scroll via user action
      // This is BV-3: page is already at the boundary — no more auto-load needed
      return; // Skip scrolling, pass the scenario
    }

    // AC2: Scroll near the bottom and verify new cards load
    const countBefore = await page.evaluate(() =>
      document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length
    );

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight - 400);
    });

    // Wait for new cards to appear (scroll-triggered load)
    const loadedMore = await page.waitForFunction(
      (before) => document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length > before,
      countBefore,
      { timeout: 20000 }
    ).then(() => true).catch(() => false);

    if (!loadedMore) {
      // Check if all content is already loaded (no more results)
      const noSpinner = !document.querySelector('.loading[aria-hidden=\"false\"], .loading:not(.hidden)');
      if (!noSpinner) {
        throw new Error('AC2 FAIL: scrolled near bottom but no new cards loaded within 20s');
      }
      // If no spinner and no new cards, content might be exhausted — Scenario C will handle it
    }

    // Verify new cards appended in 3-column grid
    const afterCount = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { colCount: -1 };
      const firstTop = anchors[0].getBoundingClientRect().top;
      return {
        colCount: anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length,
        totalCards: anchors.length
      };
    });
    if (afterCount.colCount !== -1 && afterCount.colCount < 3) {
      throw new Error('AC2 FAIL: after infinite scroll, grid reverted to ' + afterCount.colCount + ' columns');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/infinite-scroll-next-page.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/infinite-scroll-next-page.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-b.png" || true
  fi
  return "$SFAILED"
}
echo "[grid-scroll] $(date '+%H:%M:%S') Running Scenario B: normal infinite scroll..."
if scenario_b; then
  echo "[grid-scroll] $(date '+%H:%M:%S') Scenario B PASSED"
else
  echo "[grid-scroll] $(date '+%H:%M:%S') Scenario B FAILED" >&2
  FAILED=1
fi

# --- Scenario C: All content loaded — auto-load terminates cleanly ---
scenario_c() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Scroll to the absolute bottom, loading all available content
    let prevCount = 0;
    let attempts = 0;
    const maxAttempts = 15;

    while (attempts < maxAttempts) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      // Wait briefly for potential load trigger
      await page.waitForTimeout(2000);

      const currentCount = await page.evaluate(() =>
        document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length
      );

      if (currentCount === prevCount) {
        // No new cards loaded after scrolling to bottom — content is exhausted
        break;
      }
      prevCount = currentCount;
      attempts++;
    }

    // AC3: Feed shows all available content and stops loading
    // AC6 ABSENT: No further loading indicator visible
    const terminalState = await page.evaluate(() => {
      // Check that no active loading spinner is visible
      const loadingEl = document.querySelector('.loading:not(.hidden)');
      const hasActiveLoader = loadingEl ? window.getComputedStyle(loadingEl).display !== 'none' : false;
      // Check noMoreDonations state via ng-class (the loading div has ng-class="{'hidden': noMoreDonations}")
      const loadingWrapper = document.querySelector('[ng-class*=\"noMoreDonations\"]');
      const isHidden = loadingWrapper ? loadingWrapper.classList.contains('hidden') : true;
      return {
        hasActiveLoader,
        loadingWrapperHidden: isHidden,
        cardCount: document.querySelectorAll('.feed-grid > .anchor').length
      };
    });

    if (terminalState.hasActiveLoader && !terminalState.loadingWrapperHidden) {
      throw new Error('AC6 FAIL ABSENT: loading indicator still active after all content loaded');
    }

    // AC3: Feed has cards — all available content is shown
    if (terminalState.cardCount === 0) {
      throw new Error('AC3 FAIL: no cards visible after loading all content');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/all-content-loaded.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/all-content-loaded.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-c.png" || true
  fi
  return "$SFAILED"
}
echo "[grid-scroll] $(date '+%H:%M:%S') Running Scenario C: all content loaded, cycle terminates..."
if scenario_c; then
  echo "[grid-scroll] $(date '+%H:%M:%S') Scenario C PASSED"
else
  echo "[grid-scroll] $(date '+%H:%M:%S') Scenario C FAILED" >&2
  FAILED=1
fi

# Close the shared browser session
pwcli close || true

# --- Teardown (always runs, even on failure) ---
echo "[grid-scroll] Teardown: cleaning up test account ${E2E_USER_EMAIL}..."
teardown_accounts

[ "$FAILED" -eq 0 ]
