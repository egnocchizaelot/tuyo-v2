## admin_dashboard.js
- **Implementation:** app/app/scripts/controllers/pages/admin_dashboard.js
- **Summary:** Legacy controller (`AdminDashboardPage`) registered on the `TuyoTools` module for the admin dashboard view. Currently a minimal stub that immediately sets `finish_loading` to true with no actual data loading, suggesting the admin functionality is deprecated or not yet implemented.
- **Tags:** legacy, controller, dashboard, admin
- **Dependencies:**
  - app/app/app/app.js — registers controller on root `TuyoTools` module
  - app/app/scripts/services/api.js — API (injected but unused)

---

## dashboard.js
- **Implementation:** app/app/scripts/controllers/pages/dashboard.js
- **Summary:** Legacy controller (`DashboardPage`) registered on the `TuyoTools` module that loads the initial dashboard data by fetching both donations and appreciations from the API in parallel using `$q.all`. Sets the current section to 'dashboard' and exposes loaded data to the scope.
- **Tags:** legacy, controller, dashboard, donations
- **Dependencies:**
  - app/app/app/app.js — registers controller on root `TuyoTools` module
  - app/app/scripts/services/api.js — API for donations() and appreciations()
  - app/app/scripts/services/auth.js — Auth for userData

---

## donation_details.js
- **Implementation:** app/app/scripts/controllers/pages/donation_details.js
- **Summary:** Legacy controller (`DonationDetailsPage`) registered on the `TuyoTools` module for viewing individual donation details. Currently contains only commented-out API call code; the active implementation is effectively empty, suggesting this controller is deprecated or pending reimplementation.
- **Tags:** legacy, controller, donations
- **Dependencies:**
  - app/app/app/app.js — registers controller on root `TuyoTools` module
  - app/app/scripts/services/api.js — API (injected, previously used for donation_details)

---

## login.js
- **Implementation:** app/app/scripts/controllers/pages/login.js
- **Summary:** Legacy controller (`LoginPage`) registered on the `TuyoTools` module that handles Facebook login via the Facebook JavaScript SDK. Calls `Facebook.login()` to obtain an access token, clears existing auth cookies and local storage, then authenticates with the backend via `Auth.login()` and redirects to the dashboard on success.
- **Tags:** legacy, controller, authentication, facebook-login
- **Dependencies:**
  - app/app/app/app.js — registers controller on root `TuyoTools` module
  - app/app/scripts/services/auth.js — Auth for login and token management
  - app/app/scripts/services/api.js — API (injected but not directly used)
  - app/app/scripts/services/facebook.js — Facebook service for SDK login

---

## new_donation.js
- **Implementation:** app/app/scripts/controllers/pages/new_donation.js
- **Summary:** Legacy controller (`DonationsNewPage`) and directive (`fileUpload`) registered on the `TuyoTools` module for creating new donations. The controller manages a multi-step donation form with address creation via Google Maps Autocomplete/Geocoder (restricted to Uruguay), form validation (title, description, max applicants, type, at least one address and image), and address components parsing. The `fileUpload` directive handles file input change events and emits `fileSelected` events. Contains substantial commented-out FileUploader code.
- **Tags:** legacy, controller, directive, donations, address-management, file-upload
- **Dependencies:**
  - app/app/app/app.js — registers controller and directive on root `TuyoTools` module
  - app/app/scripts/services/api.js — API for createAddress
  - app/app/scripts/services/auth.js — Auth for userData
  - Google Maps JavaScript API — Geocoder and Places Autocomplete

---

## profile.js
- **Implementation:** app/app/scripts/controllers/pages/profile.js
- **Summary:** Legacy controller (`ProfileFormPage`) and directives (`pwCheck`, `checkUser`) registered on the `TuyoTools` module for user profile management. The controller handles profile data loading, profile picture upload via FileUploader, user data modification with validation (including Uruguayan CI number validation), notification settings management, and password change with confirmation matching. The `pwCheck` directive validates password confirmation fields match. The `checkUser` directive guards routes by checking authentication status on route changes. Also includes a standalone `validateCi` function for Uruguayan national ID validation.
- **Tags:** legacy, controller, directive, user-profile, validation
- **Dependencies:**
  - app/app/app/app.js — registers controller and directives on root `TuyoTools` module
  - app/app/scripts/services/api.js — API for user_profile_edit, obtain_user_profile_data, save_notification_settings, profile_picture_upload
  - app/app/scripts/services/auth.js — Auth for userData, loadUserData
  - angular-file-upload — FileUploader for profile picture uploads
