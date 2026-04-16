## notification.controller.js
- **Implementation:** app/app/notifications/notification/notification.controller.js
- **Summary:** Empty controller for the individual notification directive. Serves as a placeholder controller required by the `notification` directive; all logic resides in the directive's link function.
- **Tags:** notifications, controller, angularjs
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module

---

## notification.directive.js
- **Implementation:** app/app/notifications/notification/notification.directive.js
- **Summary:** Directive (`<notification>`) that renders a single notification item. Accepts a `notification` object via isolate scope binding, resolves the thumbnail image URL via `API.mediaURL`, determines the display text (link label) based on the notification type using an extensive switch-case covering ~20+ notification types (e.g., DonationLikes, Applicants, SelectedApplicant, AdminNotification), and handles click navigation (`goTo`) which routes to the appropriate state (donation detail, user profile, help topic, or standalone notification page) depending on notification type and URL parameters.
- **Tags:** notifications, directive, routing, ui, navigation
- **Dependencies:**
  - app/app/notifications/notifications.module.js — registers on the `notifications` module
  - app/app/notifications/notification/notification.controller.js — uses `notificationController`
  - app/app/scripts/services/api.js — `API` service for `mediaURL`
