## auth_aux.js
- **Implementation:** app/app/scripts/controllers/auth_aux.js
- **Summary:** Legacy directive (`permissions`) registered on the `TuyoTools` module that shows or hides DOM elements based on user permissions/roles. Uses `Authorization` and `PermissionMap` services to evaluate `only` and `except` attribute bindings, adding/removing the `ng-hide` class based on authorization results.
- **Tags:** legacy, directive, authentication, authorization
- **Dependencies:**
  - app/app/app/app.js — registers directive on root `TuyoTools` module
  - app/app/scripts/services/authorization.js — Authorization service for authorize()
  - app/app/scripts/services/permissionMap.js — PermissionMap for permission configuration

---

## site.js
- **Implementation:** app/app/scripts/controllers/site.js
- **Summary:** Legacy root-level controller (`SiteController`) registered on the `TuyoTools` module. Watches Auth.userData for changes and exposes notification helper methods (showError, showSuccess, showWarning, showInfo) via the growl service. Acts as the global error/notification handler that child controllers reference via `$scope.SiteController`.
- **Tags:** legacy, controller, notifications
- **Dependencies:**
  - app/app/app/app.js — registers controller on root `TuyoTools` module
  - app/app/scripts/services/auth.js — Auth for userData
  - angular-growl — growl service for toast notifications

---

## Subdirectories
- [layouts/](layouts/_ab_index.md) — layouts — component modules
- [pages/](pages/_ab_index.md) — pages — component modules
