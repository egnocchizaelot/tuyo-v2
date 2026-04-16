---
id: feed-01-3col-grid-layout
title: 3-Column Product Grid Layout for Desktop Listing Feed
---

# Spec: 3-Column Product Grid Layout for Desktop Listing Feed

## Purpose

The Tuyo desktop listing feed currently displays product cards in a single narrow centered column, wasting approximately half the available horizontal screen space. Users must scroll excessively to browse listings, and the layout feels sparse and inefficient for a product catalog.

This spec converts the desktop listing feed to a 3-column grid layout. Each card retains its current content — user info, star rating, urgency, location, description, product image (same size as today), status badge, and social actions. The change is desktop-only; mobile remains a single-column layout.

## Screen: Listing Feed — Desktop Grid

AT the desktop listing feed
I SEE product cards arranged in a 3-column grid that fills the available screen width

WHEN the feed loads with 3 or more listings
→ cards fill rows left to right, 3 per row
→ each card displays the same content as today: user avatar, name, date, star rating, urgency, location, description, full-size product image, status badge, and social action buttons

WHEN the feed loads with fewer than 3 listings
→ cards are placed in the grid at normal card width
→ remaining grid cells are empty (no stretching, no placeholder)

WHEN the viewport is at or below the mobile breakpoint
→ the feed displays in a single column (current mobile behavior, unchanged)

WHEN the viewport is above the mobile breakpoint (desktop)
→ the feed displays in a 3-column grid

WHEN the user resizes the browser window across the breakpoint
→ the layout switches between 1-column and 3-column without requiring a page reload

## Constraints

- Product image size must remain the same as the current implementation.
- Card content and card design must not change — no truncation, no removed fields, no new fields.
- Mobile layout must not be affected.
- Filtering, sorting, and pagination behavior must not change.

## Acceptance Criteria

### AC1 — Desktop shows 3-column grid
GIVEN a desktop viewport above the mobile breakpoint
WHEN the listing feed loads with 3 or more cards
THEN the cards are displayed in a 3-column grid filling the available screen width

### AC2 — Mobile remains single column
GIVEN a mobile viewport at or below the mobile breakpoint
WHEN the listing feed loads
THEN the cards are displayed in a single column
AND the layout is identical to the current mobile behavior

### AC3 — Card content is preserved
GIVEN the 3-column grid is active
WHEN a listing card is displayed
THEN it shows user avatar, name, date, star rating, urgency, location, description, full-size product image, status badge, and social action buttons — identical to today's content

### AC4 — Partial row with fewer than 3 listings
GIVEN the feed contains only 1 or 2 listings
WHEN the desktop grid renders
THEN the cards display at normal card width
AND remaining grid cells are visually empty with no placeholder or stretched card

### AC5 — Live window resize transitions cleanly
GIVEN the user is viewing the feed on desktop in 3-column mode
WHEN the user resizes the browser window below the mobile breakpoint and back
THEN the layout switches between 1-column and 3-column without a page reload
AND scroll position is not lost

### AC6 — Infinite scroll still triggers correctly
GIVEN the 3-column grid reduces the document height (same number of cards in fewer rows)
WHEN the user scrolls toward the bottom of the feed
THEN the next page of listings loads automatically
AND the feed never silently stops loading because the scroll threshold was already passed on initial render

### AC7 — Notice cards span full width
GIVEN a system notice or announcement card appears in the feed
WHEN the 3-column grid is active
THEN the notice card spans all 3 columns at full width
AND its layout and readability are preserved

### AC8 — Image carousels render correctly in grid
GIVEN a listing card contains a multi-image carousel
WHEN displayed in the 3-column grid
THEN the carousel renders correctly at the column width
AND navigation indicators remain within the card boundaries

### AC9 — Long text does not break card width
GIVEN a listing card has a very long unbroken string in the description (e.g., a URL)
WHEN displayed in the 3-column grid
THEN the text is constrained within the card boundaries
AND the card does not expand beyond its grid cell

### AC10 — Real-time new listings do not cause disorienting reflow
GIVEN the user is viewing the feed in 3-column mode
WHEN a new listing is added in real time
THEN the new card appears at the top of the feed
AND existing visible cards do not jump or reorder in a disorienting way

### AC11 — Card footer actions remain usable
GIVEN a listing card with status badge and action buttons in the footer
WHEN displayed in the 3-column grid
THEN all action buttons (share, like, options) remain fully visible and clickable
AND no interactive element is hidden or overlapping another

## Notes

> **Out of scope.** Mobile layout changes — mobile remains single-column and is not affected by this spec.

> **Out of scope.** Card content or design modifications — cards retain all current fields and styling.

> **Out of scope.** Filtering, sorting, or pagination changes — feed behavior beyond layout is unchanged.
