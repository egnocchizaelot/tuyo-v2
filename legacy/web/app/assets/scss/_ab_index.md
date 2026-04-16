# app/assets/scss/

## Subdirectories
(none)

---

## desktop.scss
- **Implementation:** app/assets/scss/desktop.scss
- **Summary:** Main SCSS entry point for desktop styles. Imports the feed-grid partial after blocks-desktop to enable the 3-column desktop listing feed grid layout (AC1). Aggregates all desktop-specific partials: variables, general-desktop, buttons, forms, perfil-desktop, perfil, chat, blocks-desktop, feed-grid, navbar-desktop, paginas-corporativas, registrate, modales, responsive, and landing.
- **Tags:** tag-scss, tag-styles, tag-entry-point, tag-feed-grid
- **Dependencies:**
  - app/assets/scss/_variables.scss
  - app/assets/scss/_general-desktop.scss
  - app/assets/scss/_buttons.scss
  - app/assets/scss/_forms.scss
  - app/assets/scss/_perfil-desktop.scss
  - app/assets/scss/_perfil.scss
  - app/assets/scss/_chat.scss
  - app/assets/scss/_blocks-desktop.scss
  - app/assets/scss/_feed-grid.scss
  - app/assets/scss/_navbar-desktop.scss
  - app/assets/scss/_paginas-corporativas.scss
  - app/assets/scss/_registrate.scss
  - app/assets/scss/_modales.scss
  - app/assets/scss/_responsive.scss
  - app/assets/scss/_landing.scss

---

## screen.scss

**Summary:** Alternative SCSS entry point (Compass default). Imports variables, then aggregates partials for both mobile and desktop: navbar, general, buttons, forms, perfil, chat, blocks, plus desktop overrides (general-desktop, perfil-desktop, blocks-desktop, navbar-desktop), and paginas-corporativas.

**Dependencies:**
- _variables.scss
- _navbar.scss
- _general.scss
- _buttons.scss
- _forms.scss
- _perfil.scss
- _chat.scss
- _blocks.scss
- _general-desktop.scss
- _perfil-desktop.scss
- _blocks-desktop.scss
- _navbar-desktop.scss
- _paginas-corporativas.scss

**Tags:** scss, styles, entry-point

**Implementation:** app/assets/scss/screen.scss

---

## ie.scss

**Summary:** Internet Explorer-specific stylesheet entry point. Provides IE-targeted style overrides.

**Dependencies:**
(none)

**Tags:** scss, styles

**Implementation:** app/assets/scss/ie.scss

---

## print.scss

**Summary:** Print media stylesheet entry point. Provides print-specific style rules.

**Dependencies:**
(none)

**Tags:** scss, styles

**Implementation:** app/assets/scss/print.scss

---

## _variables.scss

**Summary:** SCSS variables partial defining custom font-face declarations (Proxima Nova family: Regular, Black, SemiBold, Light) and Bootstrap/project-wide variables for colors, typography, spacing, and component sizing.

**Dependencies:**
(none)

**Tags:** scss, styles, configuration

**Implementation:** app/assets/scss/_variables.scss

---

## _general.scss

**Summary:** General base styles partial. Sets body font-family and background, defines feed background, cursor pointer on links, and general utility classes and layout helpers used across the application.

**Dependencies:**
- _variables.scss — uses $font-family-sans-serif and other variables

**Tags:** scss, styles

**Implementation:** app/assets/scss/_general.scss

---

## _general-desktop.scss

**Summary:** Desktop-specific general layout styles partial. Extends base general styles with desktop viewport overrides and wider container rules.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_general-desktop.scss

---

## _buttons.scss

**Summary:** Button styles partial. Defines custom button variants, sizes, states (hover, active, disabled), and brand-specific button styling used throughout the application.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_buttons.scss

---

## _forms.scss

**Summary:** Form element styles partial. Customizes input fields, textareas, select boxes, checkboxes, radio buttons, and form validation states with the project's design language.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_forms.scss

---

## _navbar.scss

**Summary:** Navigation bar styles partial for mobile/default viewport. Styles the main site navigation including logo, menu items, dropdowns, and responsive toggle behavior.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_navbar.scss

---

## _navbar-desktop.scss

**Summary:** Desktop-specific navigation bar styles partial. Overrides and extends the base navbar styles for wider viewports with desktop-specific layout and sizing.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_navbar-desktop.scss

---

## _perfil.scss

**Summary:** User profile page styles partial. Styles the profile layout including avatar display, user information sections, activity history, and account settings.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_perfil.scss

---

## _perfil-desktop.scss

**Summary:** Desktop-specific user profile styles partial. Extends the base profile styles with desktop viewport overrides for wider layouts and adjusted spacing.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_perfil-desktop.scss

---

## _blocks.scss

**Summary:** Content block styles partial. Defines card/block components used for donation items, post listings, and grid-based content displays.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_blocks.scss

---

## _blocks-desktop.scss

**Summary:** Desktop-specific content block styles partial. Overrides block component styles for larger screens with adjusted grid sizing and spacing.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_blocks-desktop.scss

---

## _feed-grid.scss
- **Implementation:** app/assets/scss/_feed-grid.scss
- **Summary:** SCSS partial that converts the desktop listing feed to a 3-column grid layout. Defines `.feed-grid` container (3-column grid on desktop, single column on mobile at the breakpoint) and `.feed-grid-full-width` for notice cards spanning all 3 columns. Covers AC1 (desktop 3-column grid), AC2 (mobile single column), AC4 (partial row fewer than 3), AC5 (live resize), AC7 (notice full width), AC8 (carousel containment), AC9 (long text overflow), AC11 (footer action buttons).
- **Tags:** tag-scss, tag-styles, tag-feed-grid, tag-layout, tag-dashboard, tag-responsive
- **Dependencies:**
  - app/assets/scss/_variables.scss

---

## _chat.scss

**Summary:** Chat interface styles partial. Styles the private chat and messaging UI components including message bubbles, input areas, conversation lists, and real-time chat layout.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_chat.scss

---

## _modales.scss

**Summary:** Modal dialog styles partial. Customizes Bootstrap modal overrides and application-specific modal layouts for donation confirmations, chat popups, filters, and other overlay dialogs.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles, bootstrap

**Implementation:** app/assets/scss/_modales.scss

---

## _landing.scss

**Summary:** Landing page styles partial. Styles the public-facing landing/home page including hero sections, feature highlights, call-to-action areas, and pre-login layout.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_landing.scss

---

## _responsive.scss

**Summary:** Responsive breakpoint styles partial. Contains media queries and responsive overrides to adapt the desktop layout across different screen widths and device sizes.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_responsive.scss

---

## _paginas-corporativas.scss

**Summary:** Corporate/static pages styles partial. Styles the informational pages such as project description, terms and conditions, regulations, and collaborators pages.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_paginas-corporativas.scss

---

## _registrate.scss

**Summary:** Registration page styles partial. Styles the user sign-up flow including registration form, step indicators, and onboarding layout.

**Dependencies:**
- _variables.scss

**Tags:** scss, styles

**Implementation:** app/assets/scss/_registrate.scss

---
