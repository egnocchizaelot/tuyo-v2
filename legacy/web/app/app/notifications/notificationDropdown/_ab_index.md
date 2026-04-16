## notificationDropdown.controller.js
- **Implementation:** app/app/notifications/notificationDropdown/notificationDropdown.controller.js
- **Summary:** Controller for the notification dropdown component. On mobile devices, adjusts the font size of the title element and back-arrow styling for a mobile-friendly presentation using `appService.isMobile`.
- **Tags:** notifications, controller, ui, mobile, responsive
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module
  - app/app/app.service.js — `appService` for `isMobile` detection

---

## notificationDropdown.directive.js
- **Implementation:** app/app/notifications/notificationDropdown/notificationDropdown.directive.js
- **Summary:** Directive (`<notifications-dropdown>`) that renders the scrollable notification list within a dropdown panel. Accepts `notifications`, `pages`, and `close` callback via isolate scope. Listens for `moreNotifications` broadcast events to update the list. Implements infinite-scroll pagination: on mobile via window scroll events, on desktop via mousewheel events on the `#theNotifications` container. Loads additional pages from the API when the user scrolls to the bottom. Provides a close/hide mechanism that emits `hideNotifications` on web or calls the `close` callback on mobile.
- **Tags:** notifications, directive, ui, pagination, infinite-scroll, dropdown, mobile
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module
  - app/app/notifications/notificationDropdown/notificationDropdown.controller.js — uses `notificationsDropdownController`
  - app/app/app.service.js — `appService` for `isMobile`, `notificationsPageSize`
  - app/app/scripts/services/api.js — `API` service for paginated `notifications()` calls
