## dashboard.controller.js
- **Implementation:** app/app/pages/dashboard/desktop/dashboard.controller.js
- **Summary:** Controller for the desktop dashboard view that initializes donation feed filters (all, donations, available, thanks, liked) from URL state parameters, determines the user's geolocation via the browser Geolocation API and Google Maps Geocoder to set location context, configures pagination settings, and scrolls to top on load. Handles both geolocated and map-data-based location display.
- **Tags:** dashboard, controller, donations, geolocation, filters
- **Dependencies:**
  - app/app/pages/dashboard/dashboard.module.js — registers controller on the `dashboard` module
  - app/app/scripts/services/map.service.js — mapService for parsing geocoder results into structured location data
  - app/app/app.service.js — appService for donationsPagination setting

---

## dashboard.directive.js
- **Implementation:** app/app/pages/dashboard/desktop/dashboard.directive.js
- **Summary:** Directive (`dashboardDesktop`) that implements the desktop listing feed UI with infinite scroll. Modified for 3-column grid: viewport-fill check ensures infinite scroll still triggers correctly when grid compresses vertical height (AC6), wider container allows 3 columns to fill available screen width (AC1), real-time new listings do not cause disorienting reflow (AC10). Includes filter modal, location filtering, text search, Socket.IO polling.
- **Tags:** tag-dashboard, tag-directive, tag-donations, tag-infinite-scroll, tag-real-time, tag-filters, tag-layout, tag-feed-grid
- **Dependencies:**
  - app/app/pages/dashboard/dashboard.module.js — registers directive on the `dashboard` module
  - app/app/pages/dashboard/desktop/dashboard.controller.js — uses `dashboardControllerDesktop` as its controller
  - app/app/scripts/services/api.js — API service for getNextDonations, getPrevDonations, getDonationContext, notices
  - app/app/app.service.js — appService for isMobile, titleHeight, navigationHeight, donationsPagination
  - app/app/socket.service.js — socketService for real-time new donation notifications
  - app/app/scripts/services/auth.js — Auth for userData (user profile link)
  - app/app/scripts/services/post.service.js — postServices for NewDonation modal
