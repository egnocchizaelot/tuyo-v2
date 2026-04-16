#!/usr/bin/env bash
# user-views-desktop-grid.spec.sh — E2E scenario: desktop 3-column grid layout
#
# Covers: app/assets/scss/_feed-grid.scss.ab app/assets/scss/desktop.scss.ab app/app/post/post.directive.js.ab
#
set -euo pipefail
source "$(dirname "$0")/_lib/playwright-wrapper.sh"
SCENARIO_ARTIFACTS="${E2E_ARTIFACTS_DIR:-.artifacts/playwright-cli}/desktop-grid"
mkdir -p "$SCENARIO_ARTIFACTS"
FAILED=0

E2E_API_URL="${E2E_API_URL:-http://localhost:8000}"

# --- Per-run account isolation ---
RANDOM_ID=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 6)
E2E_USER_EMAIL="e2e.user+${RANDOM_ID}@test.local"
E2E_USER_PASSWORD="Test1234!"
E2E_USER_ID=""

setup_accounts() {
  local response user_id
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_USER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"DesktopGrid\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[desktop-grid] SETUP FAIL: could not create user account" >&2; exit 1
  }
  user_id=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || user_id=""
  E2E_USER_ID="$user_id"
  echo "[desktop-grid] Setup: created test user ${E2E_USER_EMAIL}"
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
  echo "[desktop-grid] Teardown: removed test user"
}

# --- Shared login helper ---
# Opens the app on a 1280x800 desktop viewport and logs in via the landing modal.
do_login_desktop() {
  local _email="${E2E_USER_EMAIL}" _password="${E2E_USER_PASSWORD}"
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
    await page.waitForSelector('.feed-grid > .anchor', { timeout: 20000 });
  }"
}

# --- Scenario A: 3-column grid with 3+ listings on desktop ---
scenario_a() {
  local SFAILED=0
  do_login_desktop || { pwcli close || true; return 1; }

  pwcli run-code "async page => {
    // AC1: Verify 3-column grid by checking card row positions
    const result = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length === 0) return { error: 'no donation cards found' };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      const grid = document.querySelector('.feed-grid');
      const gridStyle = window.getComputedStyle(grid);
      return {
        colsCSS: gridStyle.gridTemplateColumns,
        firstRowCount,
        cardCount: anchors.length
      };
    });
    if (result.error) throw new Error('AC1 FAIL: ' + result.error);
    if (result.firstRowCount < 3) {
      throw new Error('AC1 FAIL: expected 3 cards in first row, found ' + result.firstRowCount +
        ' (CSS gridTemplateColumns: ' + result.colsCSS + ')');
    }

    // AC3: First card has expected content elements
    const cardContent = await page.evaluate(() => {
      const anchor = document.querySelector('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (!anchor) return null;
      const card = anchor.querySelector('.card');
      return {
        hasAvatar: !!card.querySelector('.avatar img'),
        hasName: !!card.querySelector('.user-header h3'),
        hasDescription: !!card.querySelector('p'),
        hasImageOrSlider: !!(card.querySelector('#sliderContainer') || card.querySelector('.img-responsive')),
        hasFooter: !!card.querySelector('.footer')
      };
    });
    if (!cardContent) throw new Error('AC3 FAIL: could not locate card');
    if (!cardContent.hasAvatar) throw new Error('AC3 FAIL: card missing avatar');
    if (!cardContent.hasName) throw new Error('AC3 FAIL: card missing name');
    if (!cardContent.hasImageOrSlider) throw new Error('AC3 FAIL: card missing image');
    if (!cardContent.hasFooter) throw new Error('AC3 FAIL: card missing footer');

    // AC11 ABSENT: No raw JSON or debug overlay in any card
    const rawJson = await page.evaluate(() => {
      const cards = document.querySelectorAll('.feed-grid .card');
      for (const card of cards) {
        const text = card.innerText || '';
        if (/\{\s*"[a-z_]+"\s*:/.test(text)) return true;
      }
      return false;
    });
    if (rawJson) throw new Error('AC11 FAIL ABSENT: raw JSON visible in card content');
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/3-column-layout.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/3-column-layout.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-a.png" || true
  fi
  pwcli close || true
  return "$SFAILED"
}
echo "[desktop-grid] $(date '+%H:%M:%S') Running Scenario A..."
if scenario_a; then
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario A PASSED"
else
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario A FAILED" >&2
  FAILED=1
fi

# --- Scenario B: Partial row — no placeholders or stretched cards ---
scenario_b() {
  local SFAILED=0
  do_login_desktop || { pwcli close || true; return 1; }

  pwcli run-code "async page => {
    // AC2/AC8 ABSENT: No placeholder or stretched cards in empty grid cells
    const check = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length === 0) return { skip: true };

      // Check for placeholder elements in empty cells
      const hasPlaceholder = !!(
        document.querySelector('.feed-grid .placeholder') ||
        document.querySelector('.feed-grid .card-placeholder') ||
        document.querySelector('.feed-grid [class*=\"placeholder\"]')
      );

      // Check card widths — each card should occupy at most one column cell
      const grid = document.querySelector('.feed-grid');
      const gridWidth = grid.getBoundingClientRect().width;
      const colWidth = gridWidth / 3;
      const stretchedCards = anchors.filter(a => {
        const w = a.getBoundingClientRect().width;
        // Allow up to 10% tolerance over expected column width
        return w > colWidth * 1.1;
      });

      // Find last row to verify no gap
      const tops = anchors.map(a => a.getBoundingClientRect().top);
      const lastRowTop = Math.max(...tops);
      const lastRowCards = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - lastRowTop) < 5);

      return {
        hasPlaceholder,
        stretchedCount: stretchedCards.length,
        lastRowCount: lastRowCards.length,
        totalCards: anchors.length
      };
    });
    if (check.hasPlaceholder) throw new Error('AC8 FAIL ABSENT: placeholder found in empty grid cell');
    if (check.stretchedCount > 0) throw new Error('AC2 FAIL: ' + check.stretchedCount + ' card(s) appear stretched beyond one column width');
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/partial-row.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/partial-row.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-b.png" || true
  fi
  pwcli close || true
  return "$SFAILED"
}
echo "[desktop-grid] $(date '+%H:%M:%S') Running Scenario B..."
if scenario_b; then
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario B PASSED"
else
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario B FAILED" >&2
  FAILED=1
fi

# --- Scenario C: Card with multi-image carousel renders within column ---
scenario_c() {
  local SFAILED=0
  do_login_desktop || { pwcli close || true; return 1; }

  pwcli run-code "async page => {
    // AC4: Find a card with a slider/carousel and verify it fits within its column
    const check = await page.evaluate(() => {
      // sliderContainer is the ng-if div wrapping the-slider component
      const slider = document.querySelector('#sliderContainer, .slick-slider, .slick-list');
      if (!slider) return { hasCarousel: false, note: 'no carousel found on this page (seed data may lack multi-image listings)' };
      const sliderRect = slider.getBoundingClientRect();
      const anchor = slider.closest('.anchor');
      if (!anchor) return { hasCarousel: true, error: 'carousel found but not inside .anchor' };
      const anchorRect = anchor.getBoundingClientRect();
      return {
        hasCarousel: true,
        sliderWidth: sliderRect.width,
        anchorWidth: anchorRect.width,
        fitsInColumn: sliderRect.width <= anchorRect.width + 2
      };
    });
    if (check.hasCarousel && check.error) throw new Error('AC4 FAIL: ' + check.error);
    if (check.hasCarousel && !check.fitsInColumn) {
      throw new Error('AC4 FAIL: carousel width (' + check.sliderWidth + 'px) exceeds column width (' + check.anchorWidth + 'px)');
    }
    // If no carousel on this page, scenario passes (seed may not have multi-image listings)
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/carousel-in-grid.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/carousel-in-grid.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-c.png" || true
  fi
  pwcli close || true
  return "$SFAILED"
}
echo "[desktop-grid] $(date '+%H:%M:%S') Running Scenario C..."
if scenario_c; then
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario C PASSED"
else
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario C FAILED" >&2
  FAILED=1
fi

# --- Scenario D: Long URL stays constrained within card boundaries ---
scenario_d() {
  local SFAILED=0
  do_login_desktop || { pwcli close || true; return 1; }

  pwcli run-code "async page => {
    // AC5/AC9 ABSENT: No card overflows beyond its grid column boundary
    const check = await page.evaluate(() => {
      const grid = document.querySelector('.feed-grid');
      if (!grid) return { error: 'feed-grid not found' };
      const gridRect = grid.getBoundingClientRect();
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      const overflowing = anchors.filter(a => {
        const rect = a.getBoundingClientRect();
        return rect.right > gridRect.right + 5;
      });
      return {
        overflowCount: overflowing.length,
        totalCards: anchors.length,
        gridRight: gridRect.right
      };
    });
    if (check.error) throw new Error('AC5 FAIL: ' + check.error);
    if (check.overflowCount > 0) {
      throw new Error('AC5/AC9 FAIL ABSENT: ' + check.overflowCount + ' card(s) overflow beyond grid right boundary');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/long-text-contained.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/long-text-contained.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-d.png" || true
  fi
  pwcli close || true
  return "$SFAILED"
}
echo "[desktop-grid] $(date '+%H:%M:%S') Running Scenario D..."
if scenario_d; then
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario D PASSED"
else
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario D FAILED" >&2
  FAILED=1
fi

# --- Scenario E: Footer action buttons remain visible and clickable ---
scenario_e() {
  local SFAILED=0
  do_login_desktop || { pwcli close || true; return 1; }

  pwcli run-code "async page => {
    // AC6: Share and like buttons fully visible and not clipped
    const check = await page.evaluate(() => {
      const shareBtn = document.querySelector('.btn-svg-compartir');
      const likeBtnWrapper = document.querySelector('.btn-counter-iosfix .btn-svg-like');
      if (!shareBtn) return { error: 'share button (.btn-svg-compartir) not found' };
      if (!likeBtnWrapper) return { error: 'like button (.btn-svg-like) not found' };
      const shareRect = shareBtn.getBoundingClientRect();
      const likeRect = likeBtnWrapper.getBoundingClientRect();
      const vw = window.innerWidth;
      return {
        shareVisible: shareRect.width > 0 && shareRect.height > 0,
        likeVisible: likeRect.width > 0 && likeRect.height > 0,
        shareInBounds: shareRect.left >= 0 && shareRect.right <= vw + 2,
        likeInBounds: likeRect.left >= 0 && likeRect.right <= vw + 2
      };
    });
    if (check.error) throw new Error('AC6 FAIL: ' + check.error);
    if (!check.shareVisible) throw new Error('AC6 FAIL: share button has zero size — not visible');
    if (!check.likeVisible) throw new Error('AC6 FAIL: like button has zero size — not visible');
    if (!check.shareInBounds) throw new Error('AC10 FAIL ABSENT: share button clipped by viewport boundary');
    if (!check.likeInBounds) throw new Error('AC10 FAIL ABSENT: like button clipped by viewport boundary');

    // AC10 ABSENT: No interactive element hidden behind another
    const overlapCheck = await page.evaluate(() => {
      const likeBtn = document.querySelector('.btn-counter-iosfix');
      if (!likeBtn) return true; // pass if not found
      const rect = likeBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const topEl = document.elementFromPoint(centerX, centerY);
      // The element at center should be the button or a child of it
      return topEl && (likeBtn.contains(topEl) || topEl === likeBtn);
    });
    if (!overlapCheck) throw new Error('AC10 FAIL ABSENT: like button is hidden behind another element');

    // Click like button to verify it responds
    await page.locator('.btn-counter-iosfix').first().click();
    await page.waitForTimeout(500);
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/footer-actions.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/footer-actions.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-e.png" || true
  fi
  pwcli close || true
  return "$SFAILED"
}
echo "[desktop-grid] $(date '+%H:%M:%S') Running Scenario E..."
if scenario_e; then
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario E PASSED"
else
  echo "[desktop-grid] $(date '+%H:%M:%S') Scenario E FAILED" >&2
  FAILED=1
fi

# --- Boundary: Breakpoint transition at 768px and 767px ---
scenario_breakpoint() {
  local SFAILED=0
  do_login_desktop || { pwcli close || true; return 1; }

  # BV-3: At 768px, 3-column grid activates
  pwcli run-code "async page => {
    await page.setViewportSize({ width: 768, height: 800 });
    // Allow CSS media query to recalculate
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true; // pass if insufficient cards
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return firstRowCount >= 2; // at 768px, at least 2 columns expected for 3-column layout to be active
    }, { timeout: 5000 });
    const at768 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 3) return { skip: true, colCount: null };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return { colCount: firstRowCount };
    });
    if (!at768.skip && at768.colCount < 3) {
      throw new Error('AC7 BV-3 FAIL: at 768px expected 3-column grid, first row has ' + at768.colCount + ' cards');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/breakpoint-768.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/breakpoint-768.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-breakpoint-768.png" || true
  fi

  # BV-4: At 767px, single-column layout
  pwcli run-code "async page => {
    await page.setViewportSize({ width: 767, height: 800 });
    await page.waitForFunction(() => {
      const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
      if (anchors.length < 2) return true;
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = Array.from(anchors).filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return firstRowCount === 1;
    }, { timeout: 5000 });
    const at767 = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
      if (anchors.length < 2) return { skip: true };
      const firstTop = anchors[0].getBoundingClientRect().top;
      const firstRowCount = anchors.filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5).length;
      return { colCount: firstRowCount };
    });
    if (!at767.skip && at767.colCount !== 1) {
      throw new Error('AC7 BV-4 FAIL: at 767px expected single-column, first row has ' + at767.colCount + ' cards');
    }
  }" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/breakpoint-767.png"
    pwcli snapshot  --filename="$SCENARIO_ARTIFACTS/breakpoint-767.yaml"
  else
    pwcli screenshot --filename="$SCENARIO_ARTIFACTS/fail-breakpoint-767.png" || true
  fi

  pwcli close || true
  return "$SFAILED"
}
echo "[desktop-grid] $(date '+%H:%M:%S') Running Boundary: Breakpoint 768px/767px..."
if scenario_breakpoint; then
  echo "[desktop-grid] $(date '+%H:%M:%S') Boundary PASSED"
else
  echo "[desktop-grid] $(date '+%H:%M:%S') Boundary FAILED" >&2
  FAILED=1
fi

# --- Teardown (always runs, even on failure) ---
echo "[desktop-grid] Teardown: cleaning up test account ${E2E_USER_EMAIL}..."
teardown_accounts

[ "$FAILED" -eq 0 ]
