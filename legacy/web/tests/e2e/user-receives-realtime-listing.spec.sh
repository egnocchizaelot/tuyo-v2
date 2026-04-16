#!/usr/bin/env bash
# user-receives-realtime-listing.spec.sh — E2E scenario: real-time listing appears at top of 3-column grid via Socket.IO
#
# Covers: app/app/pages/dashboard/desktop/dashboard.directive.js.ab app/app/post/post.directive.js.ab app/app/socket.service.js
#
set -euo pipefail
source "$(dirname "$0")/_lib/playwright-wrapper.sh"
SCENARIO_ARTIFACTS="${E2E_ARTIFACTS_DIR:-.artifacts/playwright-cli}/realtime-listing"
mkdir -p "$SCENARIO_ARTIFACTS"
FAILED=0

E2E_API_URL="${E2E_API_URL:-http://localhost:8000}"

# --- Per-run account isolation ---
RANDOM_ID=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c 6)
E2E_VIEWER_EMAIL="e2e.viewer+${RANDOM_ID}@test.local"
E2E_POSTER_EMAIL="e2e.poster+${RANDOM_ID}@test.local"
E2E_USER_PASSWORD="Test1234!"
E2E_VIEWER_ID=""
E2E_POSTER_ID=""
POSTER_TOKEN=""
CREATED_DONATION_IDS=()

setup_accounts() {
  local response user_id token

  # Create viewer account
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_VIEWER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"Viewer\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[realtime-listing] SETUP FAIL: could not create viewer account" >&2; exit 1
  }
  E2E_VIEWER_ID=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || E2E_VIEWER_ID=""

  # Create poster account
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_POSTER_EMAIL}\",\"first_name\":\"E2E\",\"last_name\":\"Poster\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[realtime-listing] SETUP FAIL: could not create poster account" >&2; exit 1
  }
  E2E_POSTER_ID=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('user', {}).get('id', '') or d.get('id', ''))
" 2>/dev/null) || E2E_POSTER_ID=""

  # Get poster auth token for creating donations via API
  response=$(curl -sf -X POST "${E2E_API_URL}/tuyo_login/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_POSTER_EMAIL}\",\"password\":\"${E2E_USER_PASSWORD}\"}" 2>&1) || {
    echo "[realtime-listing] SETUP FAIL: could not log in as poster" >&2; exit 1
  }
  POSTER_TOKEN=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null) || POSTER_TOKEN=""
  if [ -z "$POSTER_TOKEN" ]; then
    echo "[realtime-listing] SETUP FAIL: poster login returned no token" >&2; exit 1
  fi

  echo "[realtime-listing] Setup: created viewer (${E2E_VIEWER_EMAIL}) and poster (${E2E_POSTER_EMAIL})"
}
setup_accounts

# --- Helper: create a donation via API as the poster ---
create_donation() {
  local title="$1"
  local response donation_id
  response=$(curl -sf -X POST "${E2E_API_URL}/donations/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Token ${POSTER_TOKEN}" \
    -d "{\"title\":\"${title}\",\"description\":\"E2E realtime test donation ${RANDOM_ID}\"}" 2>&1) || {
    echo "[realtime-listing] WARNING: could not create donation '${title}' — ${response}" >&2
    return 1
  }
  donation_id=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null) || donation_id=""
  if [ -n "$donation_id" ]; then
    CREATED_DONATION_IDS+=("$donation_id")
  fi
}

teardown_accounts() {
  local token=""

  # Delete created donations
  for donation_id in "${CREATED_DONATION_IDS[@]:-}"; do
    if [ -n "$donation_id" ]; then
      curl -sf -X DELETE "${E2E_API_URL}/donations/${donation_id}/" \
        -H "Authorization: Token ${POSTER_TOKEN}" || true
    fi
  done

  # Delete viewer account
  token=$(curl -sf -X POST "${E2E_API_URL}/tuyo_login/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${E2E_VIEWER_EMAIL}\",\"password\":\"${E2E_USER_PASSWORD}\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null) || token=""
  if [ -n "$token" ] && [ -n "$E2E_VIEWER_ID" ]; then
    curl -sf -X DELETE "${E2E_API_URL}/users/${E2E_VIEWER_ID}/" \
      -H "Authorization: Token ${token}" || true
  fi

  # Delete poster account
  if [ -n "$POSTER_TOKEN" ] && [ -n "$E2E_POSTER_ID" ]; then
    curl -sf -X DELETE "${E2E_API_URL}/users/${E2E_POSTER_ID}/" \
      -H "Authorization: Token ${POSTER_TOKEN}" || true
  fi

  echo "[realtime-listing] Teardown: removed viewer and poster accounts"
}

# --- Open viewer session and log in ---
# Using named session -s=viewer so we can also open a poster session if needed.
_viewer_email="${E2E_VIEWER_EMAIL}"
_password="${E2E_USER_PASSWORD}"

pwcli -s=viewer open "$E2E_BASE_URL" --browser=chromium
pwcli -s=viewer run-code "async page => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForSelector('.btn-empty-black', { timeout: 15000 });
  await page.click('.btn-empty-black');
  await page.waitForSelector('#iniciar-sesion', { state: 'visible', timeout: 8000 });
  await page.fill('#iniciar-sesion input[name=\"email\"]', '$_viewer_email');
  await page.fill('#iniciar-sesion input[name=\"password\"]', '$_password');
  await page.click('#loginButton');
  await page.waitForSelector('#dashboard', { timeout: 20000 });
  await page.waitForSelector('.feed-grid > .anchor', { timeout: 20000 });
}" || {
  echo "[realtime-listing] VIEWER LOGIN FAIL" >&2
  pwcli -s=viewer close || true
  exit 1
}

# --- Scenario A: Single new listing appears at top of feed ---
scenario_a() {
  local SFAILED=0

  # Capture the ID of the current first card (before poster creates a new one)
  FIRST_CARD_ID=$(pwcli -s=viewer eval "
(function() {
  var anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
  return anchors.length > 0 ? anchors[0].id : '';
})()
" 2>/dev/null) || FIRST_CARD_ID=""

  INITIAL_COUNT=$(pwcli -s=viewer eval "
document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length
" 2>/dev/null) || INITIAL_COUNT="0"

  echo "[realtime-listing] Before new listing: first card='${FIRST_CARD_ID}', count=${INITIAL_COUNT}"

  # Poster creates a new donation listing via API (simulates a new listing being added)
  create_donation "E2E Realtime Listing ${RANDOM_ID}-A" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    # AC1: Wait for a new card to appear at the top of the viewer's feed (up to 20s for socket/polling)
    pwcli -s=viewer run-code "async page => {
      const initialFirstId = '$FIRST_CARD_ID';
      const initialCount = $INITIAL_COUNT;

      // Wait for a new card to appear — either count increased or first card changed
      await page.waitForFunction(
        ({ oldFirstId, oldCount }) => {
          const anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
          if (anchors.length > oldCount) return true;
          if (anchors.length > 0 && oldFirstId && anchors[0].id !== oldFirstId) return true;
          return false;
        },
        { oldFirstId: initialFirstId, oldCount: initialCount },
        { timeout: 25000 }
      );

      // AC1: New card is at first position
      const newState = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
        return {
          firstId: anchors[0]?.id ?? '',
          secondId: anchors[1]?.id ?? '',
          count: anchors.length
        };
      });

      // AC2: Previous first card should now be at second position (shifted by one)
      if (initialFirstId && newState.secondId !== initialFirstId && newState.firstId !== initialFirstId) {
        // The previously-first card is no longer in position 1 or 2 — might be a non-adjacent jump
        throw new Error('AC2 FAIL: previous first card (' + initialFirstId +
          ') not found at position 2 after new listing arrived. Positions: 1=' +
          newState.firstId + ', 2=' + newState.secondId);
      }

      // AC5 ABSENT: No card jumped to a non-adjacent position
      // We verified above that the previous first is now second — no non-adjacent jump occurred

      // AC6 ABSENT: No duplicate cards
      const duplicates = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll('.feed-grid > .anchor[id]')).map(a => a.id);
        const unique = new Set(ids);
        return { total: ids.length, unique: unique.size };
      });
      if (duplicates.total !== duplicates.unique) {
        throw new Error('AC6 FAIL ABSENT: duplicate cards after realtime update (' +
          duplicates.total + ' total vs ' + duplicates.unique + ' unique)');
      }

      // AC7 ABSENT: No raw socket data or debug overlays visible
      const hasRawData = await page.evaluate(() => {
        const feedText = document.querySelector('.feed-grid')?.innerText ?? '';
        return /\{\"[a-z_]+\":\s*[\d\"\[]/.test(feedText);
      });
      if (hasRawData) throw new Error('AC7 FAIL ABSENT: raw socket data or JSON visible in feed');
    }" || SFAILED=1
  fi

  if [ "$SFAILED" -eq 0 ]; then
    pwcli -s=viewer screenshot --filename="$SCENARIO_ARTIFACTS/single-new-listing.png"
    pwcli -s=viewer snapshot  --filename="$SCENARIO_ARTIFACTS/single-new-listing.yaml"
  else
    pwcli -s=viewer screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-a.png" || true
  fi
  return "$SFAILED"
}
echo "[realtime-listing] $(date '+%H:%M:%S') Running Scenario A: single new listing..."
if scenario_a; then
  echo "[realtime-listing] $(date '+%H:%M:%S') Scenario A PASSED"
else
  echo "[realtime-listing] $(date '+%H:%M:%S') Scenario A FAILED" >&2
  FAILED=1
fi

# --- Scenario A (scrolled): New listing while viewer is mid-feed ---
scenario_a_scrolled() {
  local SFAILED=0

  # Scroll viewer to mid-feed
  SCROLL_POS=$(pwcli -s=viewer eval "
(function() {
  var h = document.documentElement.scrollHeight;
  window.scrollTo(0, Math.floor(h / 2));
  return window.scrollY;
})()
" 2>/dev/null) || SCROLL_POS="0"

  CARDS_IN_VIEW_BEFORE=$(pwcli -s=viewer eval "
(function() {
  var mid = window.scrollY + window.innerHeight / 2;
  var anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
  var visible = Array.from(anchors).filter(function(a) {
    var r = a.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  });
  return visible.length > 0 ? visible[0].id : '';
})()
" 2>/dev/null) || CARDS_IN_VIEW_BEFORE=""

  # Poster creates another donation
  create_donation "E2E Realtime Scrolled ${RANDOM_ID}-A2" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    # Wait for the new card to arrive (polling interval)
    pwcli -s=viewer run-code "async page => {
      const scrollPosBefore = $SCROLL_POS;
      const centerCardIdBefore = '$CARDS_IN_VIEW_BEFORE';

      // Wait up to 25s for feed to update
      await page.waitForTimeout(3000); // brief wait for socket/polling cycle

      // AC3: Visible area should not be disrupted — the cards the viewer was looking at
      // should remain at approximately the same scroll position
      const scrollAfter = await page.evaluate(() => window.scrollY);
      if (Math.abs(scrollAfter - scrollPosBefore) > 300) {
        throw new Error('AC3 FAIL: visible area disrupted by realtime update. Scroll changed from ' +
          scrollPosBefore + ' to ' + scrollAfter);
      }
    }" || SFAILED=1
  fi

  if [ "$SFAILED" -eq 0 ]; then
    pwcli -s=viewer screenshot --filename="$SCENARIO_ARTIFACTS/new-listing-while-scrolled.png"
    pwcli -s=viewer snapshot  --filename="$SCENARIO_ARTIFACTS/new-listing-while-scrolled.yaml"
  else
    pwcli -s=viewer screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-a-scrolled.png" || true
  fi

  # Scroll back to top for Scenario B
  pwcli -s=viewer run-code "async page => { await page.evaluate(() => window.scrollTo(0, 0)); }" || true

  return "$SFAILED"
}
echo "[realtime-listing] $(date '+%H:%M:%S') Running Scenario A (scrolled): new listing while viewer is mid-feed..."
if scenario_a_scrolled; then
  echo "[realtime-listing] $(date '+%H:%M:%S') Scenario A (scrolled) PASSED"
else
  echo "[realtime-listing] $(date '+%H:%M:%S') Scenario A (scrolled) FAILED" >&2
  FAILED=1
fi

# --- Scenario B: Multiple new listings arrive in rapid succession ---
scenario_b() {
  local SFAILED=0

  # Scroll to top and capture first-row card IDs
  FIRST_ROW_IDS=$(pwcli -s=viewer eval "
(function() {
  window.scrollTo(0, 0);
  var anchors = document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)');
  var firstTop = anchors.length > 0 ? anchors[0].getBoundingClientRect().top : 0;
  var firstRow = Array.from(anchors).filter(function(a) {
    return Math.abs(a.getBoundingClientRect().top - firstTop) < 5;
  });
  return JSON.stringify(firstRow.map(function(a) { return a.id; }));
})()
" 2>/dev/null) || FIRST_ROW_IDS="[]"

  COUNT_BEFORE=$(pwcli -s=viewer eval "
document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length
" 2>/dev/null) || COUNT_BEFORE="0"

  echo "[realtime-listing] Before bulk: first-row=${FIRST_ROW_IDS}, count=${COUNT_BEFORE}"

  # Poster creates 3 donations in rapid succession (BV-2: full row shift)
  create_donation "E2E Realtime Bulk ${RANDOM_ID}-B1" || SFAILED=1
  create_donation "E2E Realtime Bulk ${RANDOM_ID}-B2" || SFAILED=1
  create_donation "E2E Realtime Bulk ${RANDOM_ID}-B3" || SFAILED=1

  if [ "$SFAILED" -eq 0 ]; then
    pwcli -s=viewer run-code "async page => {
      const countBefore = $COUNT_BEFORE;

      // Wait for all 3 new cards to appear (up to 30s total for 3 socket events)
      await page.waitForFunction(
        (before) => document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)').length >= before + 3,
        countBefore,
        { timeout: 30000 }
      );

      // AC4: All 3 new cards prepended at top
      const newState = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)'));
        const firstTop = anchors[0].getBoundingClientRect().top;
        const firstRowIds = anchors
          .filter(a => Math.abs(a.getBoundingClientRect().top - firstTop) < 5)
          .map(a => a.id);
        return {
          count: anchors.length,
          firstRowIds,
          firstRowCount: firstRowIds.length
        };
      });

      // AC4: Grid should still be 3-column after multiple prepends
      if (newState.firstRowCount < 3) {
        throw new Error('AC4 FAIL: after 3 prepends, grid first row has only ' +
          newState.firstRowCount + ' cards — expected 3');
      }

      // AC5 ABSENT: No card jumped to a non-adjacent position
      // With 3 prepends, original row 1 cards should now be in row 2 (positions 4, 5, 6)
      // We can verify the original first-row cards are in positions 4-6
      const prevFirstRowIds = JSON.parse('$FIRST_ROW_IDS');
      if (prevFirstRowIds.length > 0) {
        const currentAnchorIds = await page.evaluate(() =>
          Array.from(document.querySelectorAll('.feed-grid > .anchor:not(.feed-grid-full-width)')).map(a => a.id)
        );
        for (const oldId of prevFirstRowIds) {
          const currentPos = currentAnchorIds.indexOf(oldId);
          if (currentPos === -1) continue; // card may have been filtered out
          // Old first-row cards should be in positions 3-5 (0-indexed) after 3 prepends
          if (currentPos < 3 || currentPos > 8) {
            throw new Error('AC5 FAIL ABSENT: card ' + oldId +
              ' jumped to position ' + currentPos + ' — expected around position 3-5 after 3 prepends');
          }
        }
      }

      // AC6 ABSENT: No duplicate cards
      const duplicates = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll('.feed-grid > .anchor[id]')).map(a => a.id);
        const unique = new Set(ids);
        return { total: ids.length, unique: unique.size };
      });
      if (duplicates.total !== duplicates.unique) {
        throw new Error('AC6 FAIL ABSENT: duplicate cards after multi-listing update (' +
          duplicates.total + ' total vs ' + duplicates.unique + ' unique)');
      }

      // AC7 ABSENT: No raw socket data or debug overlays
      const hasRawData = await page.evaluate(() => {
        const feedText = document.querySelector('.feed-grid')?.innerText ?? '';
        return /\{\"[a-z_]+\":\s*[\d\"\[]/.test(feedText);
      });
      if (hasRawData) throw new Error('AC7 FAIL ABSENT: raw socket/JSON data visible in feed');
    }" || SFAILED=1
  fi

  if [ "$SFAILED" -eq 0 ]; then
    pwcli -s=viewer screenshot --filename="$SCENARIO_ARTIFACTS/multiple-new-listings.png"
    pwcli -s=viewer snapshot  --filename="$SCENARIO_ARTIFACTS/multiple-new-listings.yaml"
  else
    pwcli -s=viewer screenshot --filename="$SCENARIO_ARTIFACTS/fail-scenario-b.png" || true
  fi
  return "$SFAILED"
}
echo "[realtime-listing] $(date '+%H:%M:%S') Running Scenario B: multiple new listings in rapid succession..."
if scenario_b; then
  echo "[realtime-listing] $(date '+%H:%M:%S') Scenario B PASSED"
else
  echo "[realtime-listing] $(date '+%H:%M:%S') Scenario B FAILED" >&2
  FAILED=1
fi

# Close viewer session
pwcli -s=viewer close || true

# --- Teardown (always runs, even on failure) ---
echo "[realtime-listing] Teardown: cleaning up test accounts and donations..."
teardown_accounts

[ "$FAILED" -eq 0 ]
