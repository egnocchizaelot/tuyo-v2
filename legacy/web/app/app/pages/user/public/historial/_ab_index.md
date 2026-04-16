## publicHistorial.controller.js
- **Implementation:** app/app/pages/user/public/historial/publicHistorial.controller.js
- **Summary:** Controller (`userPublicHistoryController`) for the public user history section. Manages three panels (delivered, given, thanks) with their donation lists, pagination state, and count indicators. Listens for broadcast events from the parent directive to populate user ID, donation counts, and donation data.
- **Tags:** user-profile, controller, public, donations, history
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module
  - app/app/app.service.js — appService (injected for configuration)

---

## publicHistorial.directive.js
- **Implementation:** app/app/pages/user/public/historial/publicHistorial.directive.js
- **Summary:** Directive (`userPublicHistory`) that implements the public user donation history view with three switchable panels (delivered, given, appreciations). Tracks visible items and uses Socket.IO via `socketService.donationChanged` to poll for real-time updates at configurable intervals. Implements paginated scroll loading for each panel, fetching additional pages from the API on demand.
- **Tags:** user-profile, directive, public, donations, history, real-time, infinite-scroll
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers directive on the `user` module
  - app/app/pages/user/public/historial/publicHistorial.controller.js — uses `userPublicHistoryController` as its controller
  - app/app/scripts/services/api.js — API for getDeliveredDonations, getReceivedDonations, getAppreciationDonations
  - app/app/socket.service.js — socketService for donationChanged polling and removeCallback cleanup
  - app/app/app.service.js — appService for donationUpdateTime interval
