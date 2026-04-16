## deploy_config.js
- **Implementation:** app/deploy_config.js
- **Summary:** Environment-specific URL configuration file loaded before the Angular application bootstraps. Defines an ENVTS enum with four environments (DEVELOPMENT_LOCAL, DEVELOPMENT_OUT, TEST, PRODUCCION) and a single EVIRONMENT switch variable that controls which environment is active. A switch statement sets the global variables BASE_URL, HELP_URL, MEDIA_URL, SOCKET_SERVER, SOCKET_PATH, SCRIPT_SRC, FACEBOOK_APP_ID, and FACEBOOK_LOG_IN_URL based on the selected environment. DEVELOPMENT_LOCAL targets localhost:8000; DEVELOPMENT_OUT targets devapi.tuyo.uy; TEST targets testapi.tuyo.uy; PRODUCCION targets api.tuyo.uy. Media URLs point to DigitalOcean Spaces CDN. This file is the sole place where deployment targets are configured for the entire frontend.
- **Tags:** configuration
- **Dependencies:** _none_

---

## index.html
- **Implementation:** app/index.html
- **Summary:** Main entry point HTML file for the TuyoTools AngularJS SPA. Sets Open Graph meta tags for Facebook sharing (tuyo.uy branding), Google Analytics tracking (GA_TRACKING_ID), and Google Site Verification. Loads vendor CSS from Bower components (angular-growl, loading-bar, ui-select, animate.css, slick-carousel, angular-tooltips) plus local Bootstrap, Font Awesome, and compiled desktop.css. The body bootstraps the `TuyoTools` Angular module via `ng-app` and contains a single `ui-view` directive for UI Router. Loads ~30 Bower JS libraries, then ~150 application script files organized by feature module (app core, pages, layouts, notifications, post, forums, chat, popups, dashboard, modals, user, creations, map, calification, loading, reports, help). Also includes the Google Maps API and YouTube iframe API externally. The `deploy_config.js` script is loaded in the head for environment configuration.
- **Tags:** entry-point, configuration, bower, bootstrap
- **Dependencies:**
  - bower_components/ — all Bower-managed CSS and JS vendor libraries
  - app/app/app.js — root Angular module definition
  - app/app/routers.js — UI Router state definitions
  - app/app/app.service.js — global application service
  - app/deploy_config.js — environment configuration
  - app/assets/css/ — compiled stylesheets (bootstrap, font-awesome, desktop)

---

## Subdirectories
- [app/](app/_ab_index.md) — app — component modules
- [styles/](styles/_ab_index.md) — SCSS source files and legacy Compass-compiled CSS outputs (Bootstrap, Font Awesome, screen.css, desktop.css)
- [assets/](assets/_ab_index.md) — Static assets directory; contains Compass-compiled CSS (screen.css, desktop.css, Bootstrap, Font Awesome, angular-tooltips, and experimental variants)
- [_data/](_data/_ab_index.md) — Mock JSON data fixtures for development (login response)
