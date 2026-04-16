## api.js
- **Implementation:** app/app/scripts/services/api.js
- **Summary:** Centralized HTTP API service for the TuyoTools application. Registers approximately 50 REST endpoints against configurable base URLs and exposes typed methods for each (GET, POST, PUT, DELETE). Implements built-in rate limiting (500 ms minimum between calls to the same endpoint) and request deduplication via pending promises. Handles token-invalid and permission-denied responses globally by clearing credentials and redirecting to the landing page. Covers domains including user profiles, donations, appreciations, forums, notifications, help/FAQ, complaints, file dispatching, Facebook sharing, and Facebook authentication.
- **Tags:** http-client, api, donations, user-profiles, communication, authentication, session, token-management
- **Dependencies:**
  - app/app/scripts/services/config.js — provides Config service with baseURL, helpURL, mediaURL, and mockBaseURL used to construct endpoint URLs
  - angular ($q, $http, $cookies, $state, $localStorage, $modalStack) — AngularJS core services for promises, HTTP, cookies, routing, local storage, and modal management

---

## auth.js
- **Implementation:** app/app/scripts/services/auth.js
- **Summary:** Authentication service managing login, registration, logout, and session state for the TuyoTools application. Supports both native Tuyo login and Facebook-based social login by delegating to the API service. Stores the auth token in cookies (`Authorization: Token <token>`) and user data in `$localStorage`. Listens for `changeUserData` and `changeUserProfilePicture` events on `$rootScope` to keep local user data in sync. Provides `checkLogin()` to verify active sessions and `changeData()` to update stored user data fields.
- **Tags:** authentication, session, token-management, user-profiles
- **Dependencies:**
  - app/app/scripts/services/api.js — API service used for tuyoLogin, login (social), tuyoRegister, and logout HTTP calls
  - angular ($rootScope, $http, $cookies, $q, $localStorage, $state) — AngularJS core services for event bus, HTTP defaults, cookies, promises, local storage, and routing

---

## authorizer.js
- **Implementation:** app/app/scripts/services/authorizer.js
- **Summary:** Legacy role-based authorization module that defines permission roles using the `angular-permission` library's `RoleStore`. Defines roles including superuser, admin, regular, read_access, write_access, create_access, sinister_access, agent, client, broker, is_creating_application, add_relationship, and agent_has_permissions. Contains significant insurance-domain remnants (Polizas, Solicitudes, Siniestros, Clientes, Empresa modules) that are not part of the current Tuyo donation platform, indicating this file was carried over from a prior insurance management application. The file's own comment at line 1 notes it is not currently in use.
- **Tags:** authorization, legacy
- **Dependencies:**
  - app/app/scripts/services/auth.js — Auth service used to read userData, user_permissions, and checkLogin state
  - app/app/scripts/services/api.js — API service used to read API.modules for route-to-module mapping
  - angular-permission (Permission, RoleStore) — third-party library for defining and checking role-based access
  - angular ($state, $rootScope) — AngularJS core services for state management and event handling

---

## config.js
- **Implementation:** app/app/scripts/services/config.js
- **Summary:** Configuration service that bridges the global deploy_config variables (BASE_URL, HELP_URL, MEDIA_URL) into an Angular-injectable `Config` service. Also defines a mock base URL (`_data/`) for local data stubs. This service is the single point where environment-specific URLs enter the Angular dependency injection system, consumed primarily by the API service to construct endpoint URLs.
- **Tags:** configuration
- **Dependencies:**
  - app/deploy_config.js — provides the global BASE_URL, HELP_URL, and MEDIA_URL variables that this service reads at initialization

---

## facebook.js
- **Implementation:** app/app/scripts/services/facebook.js
- **Summary:** Angular factory wrapping the Facebook JavaScript SDK's login and logout flows in promise-based interfaces. Uses `FB.getLoginStatus()` to check existing sessions before invoking `FB.login()` or `FB.logout()`, and resolves/rejects using `$rootScope.$apply` to ensure Angular's digest cycle picks up the third-party callbacks. Requests `email` and `user_friends` permissions during login.
- **Tags:** facebook, oauth, authentication
- **Dependencies:**
  - Facebook JS SDK (global `FB` object) — loaded asynchronously in app_config.js; provides getLoginStatus, login, and logout methods
  - angular ($q, $window, $rootScope) — AngularJS core services for promises, window access, and digest cycle integration

---

## filter_fields.js
- **Implementation:** app/app/scripts/services/filter_fields.js
- **Summary:** Simple Angular service that manages filter state for list views. Maintains an array of selected filters, a sort type (defaulting to `insurance__internal_code`), and a sort direction flag. Reads the `ordering` parameter from `$stateParams` on initialization to restore sort state from the URL, supporting both ascending and descending orders via a leading dash prefix convention.
- **Tags:** filtering, legacy
- **Dependencies:**
  - angular ($stateParams) — AngularJS UI Router state parameters used to initialize sort state from the URL
