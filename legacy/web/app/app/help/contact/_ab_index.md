## contact.controller.js
- **Implementation:** app/app/help/contact/contact.controller.js
- **Summary:** Controller for the contact help form. Initializes an empty `attachments` array for file uploads in the contact message form.
- **Tags:** help, contact, controller, angularjs
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module

---

## contact.directive.js
- **Implementation:** app/app/help/contact/contact.directive.js
- **Summary:** Directive (`<contact-help>`) that provides a contact/message form for users to send messages to administrators. Validates that a subject option and non-empty message (max 1000 characters) are provided before sending. Submits the message with optional image attachment via `API.messages()`. Displays success/error feedback via `growl` notifications and provides navigation links to the rules page, project page, and help FAQ.
- **Tags:** help, contact, directive, form, validation, messaging, ui
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module
  - app/app/help/contact/contact.controller.js — uses `contactHelpController`
  - app/app/scripts/services/api.js — `API` service for `messages()`
  - growl — notification toasts for user feedback
