## app.js
- **Implementation:** app/app/app.js
- **Summary:** Root module definition for the TuyoTools AngularJS application. Declares the `TuyoTools` module and composes approximately 21 feature modules including third-party libraries (angular-growl, ui.router, angular-loading-bar, ngCookies, ui.select, ui.bootstrap, angularFileUpload, permission, angular-sortable-view, ngMap, ngStorage, angularMoment, angularModalService, 720kb.socialshare, ngSanitize) and custom feature modules (tuyoAux, navigationBar, footer, landing, dashboard, user, creation, createAppreciation, calification, map, loadingModule, modal, staticPagesModule, help). Also defines application-wide constants AUTH_EVENTS and USER_ROLES used for authentication event broadcasting and role checking.
- **Tags:** configuration
- **Dependencies:**
  - bower_components/ — all third-party AngularJS modules listed in the dependency array are loaded via Bower
  - app/app/ (feature modules) — tuyoAux, navigationBar, footer, landing, dashboard, user, creation, createAppreciation, calification, map, loadingModule, modal, staticPagesModule, help

---

## app.service.js
- **Implementation:** app/app/app.service.js
- **Summary:** Global application service providing browser version detection, mobile device detection, Facebook login orchestration, and Tuyo-native registration flow. On instantiation, parses the user agent to detect outdated browsers (Firefox < 52, Chrome < 56, Opera < 48, Safari < 9, Edge < 15) and alerts the user. Detects mobile devices via UA sniffing and adds a `mobile-view` CSS class to the body. Exposes `AuthLogin()` for handling post-login routing logic (banned users, incomplete registration, whitelist checks), `facebookLogin()` for Facebook OAuth flow using the global FB SDK, `login()` as the public entry point that checks `facebookIsLoaded`, and `AuthRegister()` for native registration with similar post-register handling. Also defines UI constants for pagination sizes, navigation heights, chat dimensions, image constraints, and the Socket.IO server URL.
- **Tags:** authentication, facebook, oauth, configuration, session
- **Dependencies:**
  - app/app/scripts/services/facebook.js — Facebook factory (imported but Facebook login is done via global FB object directly)
  - app/app/scripts/services/auth.js — Auth service for login(), register(), logout(), and checkLogin()
  - app/deploy_config.js — provides global SOCKET_SERVER and FACEBOOK_APP_ID variables read at initialization
  - angular ($localStorage, $state, $cookies, growl) — AngularJS services for storage, routing, cookies, and toast notifications

---

## app_config.js
- **Implementation:** app/app/app_config.js
- **Summary:** Application bootstrap configuration combining the AuthInterceptor factory, a promise-based Confirm dialog factory, growl notification settings, Facebook SDK async initialization, CSRF/auth header defaults, route guard logic, and browser history management. The AuthInterceptor catches 401 responses and redirects to the landing page. The run block asynchronously loads the Facebook JS SDK with the configured FACEBOOK_APP_ID, sets the global `facebookIsLoaded` flag on completion, calls `Auth.loadUserData()` to restore session from localStorage, configures HTML5 history state tracking for modal back-button support, and implements the `$stateChangeStart` route guard that enforces authentication (redirecting unauthenticated users to landing, redirecting authenticated users away from landing to the dashboard, and logging out users with incomplete registration).
- **Tags:** authentication, facebook, session, configuration, token-management
- **Dependencies:**
  - app/app/scripts/services/auth.js — Auth service for loadUserData(), checkLogin(), logout(), and userData
  - app/deploy_config.js — provides global FACEBOOK_APP_ID used for FB.init()
  - angular ($rootScope, $q, $location, $state, $modalStack, $window, $http, $cookies) — AngularJS core services

---

## routers.js
- **Implementation:** app/app/routers.js
- **Summary:** UI Router state definitions for the TuyoTools SPA. Configures the abstract parent state `app` and approximately 18 child states covering: landing page, static content pages (proyecto, reglamento, colaboradores, terminos y condiciones, articulos prohibidos, troubleshooting, wrong email link, confirmation success), map view, mobile modal, donations layout (abstract), individual donation view, notification view, dashboard, new donation creation, and help center. Registers the AuthInterceptor as an HTTP interceptor. Public routes explicitly set `data: { requireLogin: false }`; all other routes require authentication by default. The `$urlRouterProvider.otherwise` fallback redirects to the dashboard.
- **Tags:** configuration
- **Dependencies:**
  - app/app/app_config.js — AuthInterceptor factory registered as an HTTP interceptor in the config block
  - angular ($stateProvider, $urlRouterProvider, $httpProvider) — UI Router configuration and HTTP provider
  - app/app/scripts/services/auth.js — Auth service used in the otherwise fallback (injected but commented-out superuser check)

---

## socket.service.js
- **Implementation:** app/app/socket.service.js
- **Summary:** Socket.IO wrapper service providing real-time event handling for the TuyoTools application. Lazily loads the Socket.IO client library via `$.getScript()` on a 1-second interval until available, then connects to the configured socket server. Manages four real-time channels: donation/notice change tracking (emits `donation changed`/`notice changed`, listens for `it changed`/`notice changed`), new donations polling (emits `new donations`, listens for `new donations`), forum and chat message updates (emits `forum messages`/`chat messages`, listens for `new messages` with message data, deleted messages, thread updates, forum state, and applicant info), and notification updates (emits `new notifications`, listens for `new notifications`). Each channel includes call deduplication to prevent redundant socket emissions. Auth tokens from cookies are passed with every socket emission.
- **Tags:** realtime, donations, communication
- **Dependencies:**
  - app/app/app.service.js — appService providing socketServer URL
  - app/deploy_config.js — provides global SCRIPT_SRC and SOCKET_PATH variables for Socket.IO client loading and connection
  - angular ($cookies) — AngularJS cookie service for reading the Authorization token
  - Socket.IO client library (global `io` object) — loaded dynamically at runtime

---

## Subdirectories
- [calification/](calification/_ab_index.md) — calification — component modules
- [create/](create/_ab_index.md) — create — component modules
- [extras/](extras/_ab_index.md) — extras — component modules
- [help/](help/_ab_index.md) — help — component modules
- [loading/](loading/_ab_index.md) — loading — component modules
- [map/](map/_ab_index.md) — map — component modules
- [modals/](modals/_ab_index.md) — modals — component modules
- [notifications/](notifications/_ab_index.md) — notifications — component modules
- [popUps/](popUps/_ab_index.md) — popUps — component modules
- [post/](post/_ab_index.md) — post — component modules
- [reports/](reports/_ab_index.md) — reports — component modules
