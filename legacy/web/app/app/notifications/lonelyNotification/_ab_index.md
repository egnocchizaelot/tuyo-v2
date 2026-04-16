## lonelyNotification.controller.js
- **Implementation:** app/app/notifications/lonelyNotification/lonelyNotification.controller.js
- **Summary:** Controller for the standalone notification detail page. Fetches a single notification by ID from `$stateParams` via `API.getNotification()`, displays the extended text and image. Redirects to the dashboard if the response indicates unauthorized access ("Acceso no autorizado").
- **Tags:** notifications, controller, detail-view, authorization
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module
  - app/app/scripts/services/api.js — `API` service for `getNotification()`
