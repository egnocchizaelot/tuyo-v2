## publicForum.controller.js
- **Implementation:** app/app/contact/publicForum/publicForum.controller.js
- **Summary:** Empty controller for the public forum view component.
- **Tags:** forum, communication, controller
- **Dependencies:**
  - app/app/contact/publicForum/publicForum.module.js — registered on publicForum module

---

## publicForum.directive.js
- **Implementation:** app/app/contact/publicForum/publicForum.directive.js
- **Summary:** Directive (element: "publicForum") implementing a public forum for notices and appreciations. Handles message sending and replying, message tree creation, real-time polling via socketService every 5 seconds, forum state tracking, and responsive response targeting. Supports both notice forums (API.noticeForum) and appreciation forums (API.appreciationForum).
- **Tags:** forum, communication, directive, realtime, socket-io
- **Dependencies:**
  - app/app/contact/publicForum/publicForum.module.js — registered on publicForum module
  - app/app/contact/forums/forum.services.js — uses forumService for message tree operations
  - app/app/scripts/services/api.js — uses API for forum loading and message sending
  - app/app/scripts/services/auth.js — uses Auth for user identification
  - app/app/socket.service.js — uses socketService for real-time updates

---

## publicForum.module.js
- **Implementation:** app/app/contact/publicForum/publicForum.module.js
- **Summary:** Declares the "publicForum" AngularJS module for public forum views on notices and appreciations. No external module dependencies.
- **Tags:** forum, communication, module
- **Dependencies:** _none_

---

## Subdirectories
- [publicMessage/](publicMessage/_ab_index.md) — publicMessage — component modules
