## user.controller.js
- **Implementation:** app/app/pages/user/private/user.controller.js
- **Summary:** Controller for the private user profile view that exposes the authenticated user's data and media URL, manages tab state (activity, history, profile) via `$scope.state` and `$scope.active`, and handles profile picture upload by converting base64 images to File objects and POSTing them to the `upload_profile_picture` API endpoint using the Fetch API with authorization headers.
- **Tags:** user-profile, controller, private, profile-picture
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module
  - app/app/scripts/services/auth.js — Auth for userData and changeData
  - app/app/scripts/services/api.js — API for mediaURL and baseURL (profile picture upload endpoint)

---

## user.directive.js
- **Implementation:** app/app/pages/user/private/user.directive.js
- **Summary:** Directive (`userPrivate`) that serves as the container for the private user profile page. Fetches user ranking, email confirmation status, donation counts, and all activity/history data (reserved, offered, wanted, delivered, received, appreciation donations) from the API on initialization. Manages tab switching between activity, history, and profile sections, and implements scroll-based pagination loading by broadcasting scroll events to child directives.
- **Tags:** user-profile, directive, private, donations, layout
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers directive on the `user` module
  - app/app/pages/user/private/user.controller.js — uses `userPrivateController` as its controller
  - app/app/scripts/services/api.js — API for getUserRanking, getUserEmailConfirm, getUserCounts, reservedDonations, myDonations, wantedDonations, getDeliveredDonations, getReceivedDonations, getAppreciationDonations
  - app/app/scripts/services/auth.js — Auth for userData and changeData
  - app/app/app.service.js — appService (referenced in dependency injection)

---

## Subdirectories
- [actividad/](actividad/_ab_index.md) — actividad — component modules
- [historial/](historial/_ab_index.md) — historial — component modules
- [miCuenta/](miCuenta/_ab_index.md) — miCuenta — component modules
