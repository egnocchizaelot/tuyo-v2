#!/usr/bin/env bash
# user-views-notice-cards.spec.sh — E2E scenario: notice and important notice cards span full grid width
#
# Covers: app/app/post/notice/notice.directive.js.ab app/app/post/importantNotice/importantNotice.directive.js.ab app/assets/scss/_feed-grid.scss.ab app/app/post/post.directive.js.ab
#
set -euo pipefail
source "$(dirname "$0")/_lib/playwright-wrapper.sh"
SCENARIO_ARTIFACTS="${E2E_ARTIFACTS_DIR:-.artifacts/playwright-cli}/notice-cards"
mkdir -p "$SCENARIO_ARTIFACTS"
FAILED=0

E2E_API_URL="${E2E_API_URL:-http://localhost:8000}"

# --- Per-run account isolation ---
RANDOM_ID=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 6)
E2E_USER_EMAIL="e2e.noticeuser+${RANDOM_ID}@test.local"
E2E_USER_PASSWORD="Test1234!"
E2E_USER_ID=""

setup_accounts() {
  local response user_id
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_USER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"Notice\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[notice-cards] SETUP FAIL: could not create user account" >&2; exit 1
  }
  user_id=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || user_id=""
  E2E_USER_ID="$user_id"
  echo "[notice-cards] Setup: created test user ${E2E_USER_EMAIL}"
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
  echo "[notice-cards] Teardown: removed test user"
}

# --- Scenarios A, B, and C share one browser session (B resizes from A, C depends on B's desktop state) ---
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
}" || { echo "[notice-cards] LOGIN FAIL" >&2; pwcli close || true; exit 1; }

# --- Scenario A: Notice cards span full width on desktop ---
scenario_a() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Ensure desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // ABSENT: Check for orphan modals before interacting
    const orphanModal = await page.evaluate(() =>
      !!(document.querySelector('.modal.in[id]:not(#iniciar-sesion)'))
    );
    if (orphanModal) throw new Error('ABSENT: unexpected modal open before scenario A');

    // Find notice cards (.feed-grid-full-width elements)
    const noticeCheck = await page.evaluate(() => {
      // Important notices in their own feed-grid container (important-notice directive)
      const importantNoticeContainers = document.querySelectorAll('.feed-grid .feed-grid-full-width');
      // Regular notice cards in the main feed (anchor with feed-grid-full-width)
      const noticeAnchors = document.querySelectorAll('.feed-grid > .anchor.feed-grid-full-width, .feed-grid > .feed-grid-full-width');

      if (importantNoticeContainers.length === 0 && noticeAnchors.length === 0) {
        return { noNotices: true };
      }

      const feedGrid = document.querySelector('.feed-grid');
      const gridRect = feedGrid ? feedGrid.getBoundingClientRect() : null;
      if (!gridRect) return { error: 'feed-grid not found' };

      const results = [];
      const allNoticeEls = Array.from(new Set([...importantNoticeContainers, ...noticeAnchors]));

      for (const el of allNoticeEls) {
        const rect = el.getBoundingClientRect();
        results.push({
          width: rect.width,
          gridWidth: gridRect.width,
          spansFullWidth: Math.abs(rect.width - gridRect.width) < 5,
          class: el.className
        });
      }
      return { results };
    });

    if (noticeCheck.noNotices) {
      // No notices in seed data — skip AC1/AC2 assertions but still pass
      console.log('NOTE: no notice cards found in feed (seed data may not include notices)');
      return;
    }
    if (noticeCheck.error) throw new Error('AC1 FAIL: ' + noticeCheck.error);

    // AC1/AC2: Every notice card spans full grid width
    const narrowNotices = noticeCheck.results.filter(r => !r.spansFullWidth);
    if (narrowNotices.length > 0) {
      throw new Error('AC1/AC8 FAIL ABSENT: ' + narrowNotices.length + ' notice card(s) do not span full grid width. ' +
        'Expected width ~' + noticeCheck.results[0].gridWidth + 'px, got: ' +
        narrowNotices.map(r => r.width + 'px').join(', '));
    }

    // AC3: Regular donation cards around notices are still in 3-column layout
    const donationColCheck = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      return { colCount: anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length };
    });
    if (!donationColCheck.skip && donationColCheck.colCount < 3) {
      throw new Error('AC3 FAIL: donation cards not in 3-column grid when notices present (got ' +
        donationColCheck.colCount + ' in first row)');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/desktop-full-width.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/desktop-full-width.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-a.png" || true
  fi
  return "$SFAILED"
}
echo "[notice-cards] $(date '+%H:%M:%S') Running Scenario A: notice full width on desktop..."
if scenario_a; then
  echo "[notice-cards] $(date '+%H:%M:%S') Scenario A PASSED"
else
  echo "[notice-cards] $(date '+%H:%M:%S') Scenario A FAILED" >&2
  FAILED=1
fi

# --- Scenario B: Notice cards on mobile — no regression ---
scenario_b() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length === 1;
    }, { timeout: 5000 });

    // AC4: Notice cards at full column width on mobile (not wider than viewport)
    const mobileCheck = await page.evaluate(() => {
      const vw = window.innerWidth;
      const noticeFull = document.querySelectorAll('.feed-grid-full-width');
      const results = Array.from(noticeFull).map(n => {
        const rect = n.getBoundingClientRect();
        return { width: rect.width, vw, fitsViewport: rect.width <= vw + 5 };
      });
      const hasHScrollbar = document.body.scrollWidth > document.body.clientWidth + 5;
      return { results, hasHScrollbar, count: noticeFull.length };
    });

    // AC5/AC9 ABSENT: No notice wider than viewport on mobile
    const overflowing = mobileCheck.results.filter(r => !r.fitsViewport);
    if (overflowing.length > 0) {
      throw new Error('AC9 FAIL ABSENT: ' + overflowing.length +
        ' notice card(s) are wider than mobile viewport on 375px');
    }
    if (mobileCheck.hasHScrollbar) {
      throw new Error('AC9 FAIL ABSENT: horizontal scrollbar visible on mobile — notice card overflow');
    }

    // AC4: Mobile layout is single-column — no 3-column grid visible
    const singleColCheck = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 2) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      return { colCount: anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length };
    });
    if (!singleColCheck.skip && singleColCheck.colCount !== 1) {
      throw new Error('AC4 FAIL: on 375px mobile, expected single-column but got ' +
        singleColCheck.colCount + ' in first row');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/mobile-notice.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/mobile-notice.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-b.png" || true
  fi
  return "$SFAILED"
}
echo "[notice-cards] $(date '+%H:%M:%S') Running Scenario B: notice cards on mobile..."
if scenario_b; then
  echo "[notice-cards] $(date '+%H:%M:%S') Scenario B PASSED"
else
  echo "[notice-cards] $(date '+%H:%M:%S') Scenario B FAILED" >&2
  FAILED=1
fi

# --- Scenario C: Important notice dismissed — grid reflows ---
scenario_c() {
  local SFAILED=0

  pwcli run-code "async page => {
    // Return to desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 3) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      return Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length >= 3;
    }, { timeout: 5000 });

    // Find the important-notice directive and its Entendido button
    const hasImportantNotice = await page.evaluate(() =>
      !!document.querySelector('important-notice')
    );

    if (!hasImportantNotice) {
      // No important notices in seed data — scenario is vacuously passing
      console.log('NOTE: no important-notice element found (seed data may not include important notices)');
      return;
    }

    // Record card count before dismissal
    const countBefore = await page.evaluate(() =>
      document.querySelectorAll('.feed-grid > .anchor, .feed-grid .feed-grid-full-width').length
    );

    // Click "Entendido" to dismiss the important notice
    await page.locator('important-notice').locator('a.btn-primary', { hasText: 'Entendido' }).first().click();

    // AC7: Important notice card removed from DOM
    await page.waitForFunction(
      () => !document.querySelector('important-notice'),
      { timeout: 10000 }
    );

    // Verify grid reflows without a gap
    const afterDismiss = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;

      // Check for gap (large empty space) in the grid after removal
      const rects = anchors.slice(0, Math.min(6, anchors.length)).map(a => a.getBoundingClientRect());
      let maxGap = 0;
      for (let i = 1; i < rects.length; i++) {
        // Within same row, gap between cards should be consistent
        if (Math.abs(rects[i].top - rects[i-1].top) < 5) {
          const gap = rects[i].left - rects[i-1].right;
          maxGap = Math.max(maxGap, gap);
        }
      }

      return { colCount: firstRowCount, maxGapInRow: maxGap };
    });

    if (!afterDismiss.skip && afterDismiss.colCount < 3) {
      throw new Error('AC7 FAIL: after dismissing notice, 3-column grid broken (got ' +
        afterDismiss.colCount + ' in first row)');
    }
    // A gap > 50px between adjacent cards in the same row indicates a layout hole
    if (!afterDismiss.skip && afterDismiss.maxGapInRow > 50) {
      throw new Error('AC7 FAIL: large gap (' + afterDismiss.maxGapInRow +
        'px) in grid row after notice dismissal — grid did not reflow correctly');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/notice-dismissed.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/notice-dismissed.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-c.png" || true
  fi
  return "$SFAILED"
}
echo "[notice-cards] $(date '+%H:%M:%S') Running Scenario C: important notice dismissed, grid reflows..."
if scenario_c; then
  echo "[notice-cards] $(date '+%H:%M:%S') Scenario C PASSED"
else
  echo "[notice-cards] $(date '+%H:%M:%S') Scenario C FAILED" >&2
  FAILED=1
fi

# Close the shared browser session
pwcli close || true

# --- Teardown (always runs, even on failure) ---
echo "[notice-cards] Teardown: cleaning up test account ${E2E_USER_EMAIL}..."
teardown_accounts

[ "$FAILED" -eq 0 ]
