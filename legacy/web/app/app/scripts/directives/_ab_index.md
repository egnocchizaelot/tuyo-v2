## dashboard_donations.js
- **Implementation:** app/app/scripts/directives/dashboard_donations.js
- **Summary:** Legacy directive (`dashboardDonations`) registered on the `TuyoTools` module that renders a dashboard donations list. Uses isolate scope with two-way bindings for `donations` and `userData`. Currently has an empty link function, relying entirely on its template for rendering.
- **Tags:** legacy, directive, dashboard, donations
- **Dependencies:**
  - app/app/app/app.js — registers directive on root `TuyoTools` module
  - app/app/scripts/services/api.js — API (injected but unused in link)

---

## donations_header.js
- **Implementation:** app/app/scripts/directives/donations_header.js
- **Summary:** Legacy directive (`donationsHeader`) registered on the `TuyoTools` module that implements the header/navigation for the donations section. Manages section switching (dashboard, donate, profile, donation details) with side menu toggling, exposes user data and media URLs, handles mobile profile menu and mobile navigation with click-outside-to-close behavior, listens for `changeSection` and `DONATION_DETAILS` rootScope events, and provides filter reset functionality via `FilterFields` service.
- **Tags:** legacy, directive, donations, navigation, layout
- **Dependencies:**
  - app/app/app/app.js — registers directive on root `TuyoTools` module
  - app/app/scripts/services/auth.js — Auth for userData
  - app/app/scripts/services/api.js — API for emailURL, baseURL, mediaURL
  - app/app/scripts/services/filterFields.js — FilterFields for selectedFilters management

---

## donations_list_item.js
- **Implementation:** app/app/scripts/directives/donations_list_item.js
- **Summary:** Legacy directive (`donationsListItem`) registered on the `TuyoTools` module that renders individual donation cards in the feed. Uses isolate scope with a `donation` binding. Provides signup-on-donation functionality (two-step modal flow with forum message), like/unlike toggle via API, and donation detail modal views. Note: contains a duplicated `donation_modal_view` function definition.
- **Tags:** legacy, directive, donations
- **Dependencies:**
  - app/app/app/app.js — registers directive on root `TuyoTools` module
  - app/app/scripts/services/api.js — API for donationApplicantsAcctions, add_like, remove_like, mediaURL
  - angular-growl — growl for error notifications

---

## filters.js
- **Implementation:** app/app/scripts/directives/filters.js
- **Summary:** Legacy directive (`filters`) registered on the `TuyoTools` module that implements a dynamic filter UI for the donations list. Loads available filter definitions from the API via `get_filters()`, supports select and subselect filter types, manages selected filters with add/remove/clear operations, persists filter state via `FilterFields` service, and triggers state navigation to update the donations view with applied filters. Uses isolate scope with bindings for template URLs, filter options, and change callbacks.
- **Tags:** legacy, directive, donations, filters
- **Dependencies:**
  - app/app/app/app.js — registers directive on root `TuyoTools` module
  - app/app/scripts/services/api.js — API for get_filters
  - app/app/scripts/services/auth.js — Auth (injected)
  - app/app/scripts/services/filterFields.js — FilterFields for persisting selectedFilters

---

## validation.js
- **Implementation:** app/app/scripts/directives/validation.js
- **Summary:** Legacy directives (`validCi`, `validRut`, `dropzone`) registered on the `TuyoTools` module for form validation and file handling. `validCi` validates Uruguayan national ID (cedula) numbers using a checksum algorithm. `validRut` validates Uruguayan RUT (tax ID) numbers with a multiplicator-based verification digit check. `dropzone` handles drag-and-drop file uploads by reading dropped files and calling `scope.addfile()`. Also exports standalone `validateCi` and `validateRut` helper functions.
- **Tags:** legacy, directive, validation, file-upload
- **Dependencies:**
  - app/app/app/app.js — registers directives on root `TuyoTools` module
