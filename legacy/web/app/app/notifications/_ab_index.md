## notifications.controller.js
- **Implementation:** app/app/notifications/notifications.controller.js
- **Summary:** Empty controller for the top-level notifications directive. Serves as a placeholder controller required by the `notifications` directive; all logic resides in the directive's link function.
- **Tags:** notifications, controller, angularjs
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module

---

## notifications.directive.js
- **Implementation:** app/app/notifications/notifications.directive.js
- **Summary:** Main notifications directive (`<notifications>`) that manages the full notification lifecycle. Loads paginated notifications from the API on initialization, polls for new notifications every 3 seconds via `socketService`, tracks unread count, and handles show/hide toggling for both mobile (via state navigation to `mobileModal`) and web (dropdown toggle). Marks notifications as read via `API.notificationsRead()` when opened, broadcasts `moreNotifications` events to child components, and cleans up intervals and event listeners on destroy.
- **Tags:** notifications, directive, realtime, socket-io, polling, pagination, ui
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module
  - app/app/notifications/notifications.controller.js — uses `notificationsController`
  - app/app/scripts/services/api.js — `API` service for `notifications()`, `notificationsRead()`
  - app/app/app.service.js — `appService` for `isMobile`, `notificationsPageSize`
  - app/app/socket.service.js — `socketService` for real-time notification polling via `newNotifications()` and `notificationCallback`

---

## notifications.module.js
- **Implementation:** app/app/notifications/notifications.module.js
- **Summary:** Declares the `notifications` AngularJS module with no external module dependencies. This module serves as the root for all notification-related components including the notification list, individual notification display, notification dropdown, and standalone notification view.
- **Tags:** notifications, module, angularjs
- **Dependencies:**
  - None

---

## Subdirectories
- [lonelyNotification/](lonelyNotification/_ab_index.md) — lonelyNotification — component modules
- [notification/](notification/_ab_index.md) — notification — component modules
- [notificationDropdown/](notificationDropdown/_ab_index.md) — notificationDropdown — component modules
