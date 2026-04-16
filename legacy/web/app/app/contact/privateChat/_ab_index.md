## privateChat.controller.js
- **Implementation:** app/app/contact/privateChat/privateChat.controller.js
- **Summary:** Controller for the private chat component. Manages header animation (shrinking image header on scroll/click) and scroll event handlers for the chat container.
- **Tags:** chat, communication, controller, ui
- **Dependencies:**
  - app/app/contact/privateChat/privateChat.module.js — registered on chat module
  - app/app/app/app.service.js — uses appService for mobile detection

---

## privateChat.directive.js
- **Implementation:** app/app/contact/privateChat/privateChat.directive.js
- **Summary:** Core directive (element: "privateChat") implementing the private chat between donor and applicant. Handles message sending with validation (max 800 chars), message grouping into blocks by sender, real-time polling via socketService every 2 seconds, cancel reservation and deliver donation actions with API calls, forum state change detection, auto-scroll to latest message, and text area auto-expansion. Contains the BlockThemOut helper function for grouping messages by sender.
- **Tags:** chat, communication, directive, realtime, socket-io, donations
- **Dependencies:**
  - app/app/contact/privateChat/privateChat.module.js — registered on chat module
  - app/app/scripts/services/api.js — uses API for messages, forum, and donation state
  - app/app/scripts/services/auth.js — uses Auth for user identification
  - app/app/socket.service.js — uses socketService for real-time chat polling
  - app/app/modals/modals.service.js — uses modalServices for confirmation dialogs
  - app/app/app/app.service.js — uses appService for mobile/modal height

---

## privateChat.module.js
- **Implementation:** app/app/contact/privateChat/privateChat.module.js
- **Summary:** Declares the "chat" AngularJS module for private one-on-one messaging between donation creator and reserved applicant. No external module dependencies.
- **Tags:** chat, communication, module
- **Dependencies:** _none_

---

## Subdirectories
- [block/](block/_ab_index.md) — block — component modules
