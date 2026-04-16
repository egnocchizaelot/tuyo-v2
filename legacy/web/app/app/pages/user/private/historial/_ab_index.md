## historial.controller.js
- **Implementation:** app/app/pages/user/private/historial/historial.controller.js
- **Summary:** Controller (`userHistoryController`) for the private user history tab. Manages three panels (delivered, received/given, thanks/appreciations) with their respective donation lists, pagination state, and count indicators. Listens for broadcast events from the parent directive to populate donation data and counts.
- **Tags:** user-profile, controller, private, donations, history
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module
  - app/app/app.service.js — appService (injected but primarily used for configuration)

---

## historial.directive.js
- **Implementation:** app/app/pages/user/private/historial/historial.directive.js
- **Summary:** Directive (`userHistory`) that implements the private user donation history view with three switchable panels (delivered, given, appreciations). Tracks visible donation items and uses Socket.IO via `socketService.donationChanged` to poll for real-time updates on visible donations at configurable intervals. Implements paginated scroll loading for each panel, fetching additional pages from the API when the user scrolls to the bottom.
- **Tags:** user-profile, directive, private, donations, history, real-time, infinite-scroll
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers directive on the `user` module
  - app/app/pages/user/private/historial/historial.controller.js — uses `userHistoryController` as its controller
  - app/app/scripts/services/api.js — API for getDeliveredDonations, getReceivedDonations, getAppreciationDonations
  - app/app/socket.service.js — socketService for donationChanged polling and removeCallback cleanup
  - app/app/app.service.js — appService for donationUpdateTime interval
  - app/app/scripts/services/auth.js — Auth for userData.id
