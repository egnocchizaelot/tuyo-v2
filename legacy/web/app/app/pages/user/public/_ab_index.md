## publicUser.controller.js
- **Implementation:** app/app/pages/user/public/publicUser.controller.js
- **Summary:** Controller (`userPublicController`) for the public user profile view. Exposes the current authenticated user's data and media URL, manages tab state between history and profile views, and applies a temporary click-blocking overlay during initial page load.
- **Tags:** user-profile, controller, public
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module
  - app/app/scripts/services/auth.js — Auth for userData
  - app/app/scripts/services/api.js — API for mediaURL

---

## publicUser.directive.js
- **Implementation:** app/app/pages/user/public/publicUser.directive.js
- **Summary:** Directive (`userPublic`) that implements the public user profile page. Fetches the target user's public data via `API.getPublicUser`, computes their star ranking, retrieves donation counts and history (delivered, received, appreciations), and broadcasts data to child directives. Implements scroll-based pagination for the history section. Uses isolate scope with `userId` binding.
- **Tags:** user-profile, directive, public, donations
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers directive on the `user` module
  - app/app/pages/user/public/publicUser.controller.js — uses `userPublicController` as its controller
  - app/app/scripts/services/api.js — API for getPublicUser, getUserCounts, getDeliveredDonations, getReceivedDonations, getAppreciationDonations
  - app/app/app.service.js — appService (injected for configuration)

---

## Subdirectories
- [historial/](historial/_ab_index.md) — historial — component modules
- [informacion/](informacion/_ab_index.md) — informacion — component modules
