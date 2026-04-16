## forum.controller.js
- **Implementation:** app/app/contact/forums/forum.controller.js
- **Summary:** Empty controller for the forum component. All logic is in the forum directive.
- **Tags:** forum, communication, controller
- **Dependencies:**
  - app/app/contact/forums/forum.module.js — registered on forumModule

---

## forum.directive.js
- **Implementation:** app/app/contact/forums/forum.directive.js
- **Summary:** Core directive (element: "forum") implementing the public donation forum. Handles applicant registration (MeAnoto) and removal, message threading with parent-child relationships, real-time message polling via socketService every 5 seconds, message ordering (by reputation/likes/friends/FIFO), donor reservation management, forum state tracking (open/closed), text area auto-expansion, and response targeting.
- **Tags:** forum, communication, directive, realtime, socket-io, donations
- **Dependencies:**
  - app/app/contact/forums/forum.module.js — registered on forumModule
  - app/app/contact/forums/forum.services.js — uses forumService for message tree operations
  - app/app/scripts/services/api.js — uses API for forum operations and message sending
  - app/app/scripts/services/auth.js — uses Auth for user identification
  - app/app/socket.service.js — uses socketService for real-time forum updates
  - app/app/app/app.service.js — uses appService for mobile detection
  - app/app/post/post.service.js — uses postServices for closing forum modals

---

## forum.module.js
- **Implementation:** app/app/contact/forums/forum.module.js
- **Summary:** Declares the "forumModule" AngularJS module for public donation forums where applicants post interest and donors manage reservations. No external module dependencies.
- **Tags:** forum, communication, module
- **Dependencies:** _none_

---

## forum.services.js
- **Implementation:** app/app/contact/forums/forum.services.js
- **Summary:** Service providing forum message tree operations: CreateMessageTree builds a hierarchical tree from flat messages, OrderMessageTree sorts by reputation/likes/friends/FIFO, SendSelectedToTop moves the reserved user message to the top, and FindActives marks active unique senders. Contains helper functions for tree traversal and various ordering strategies.
- **Tags:** forum, communication, service, data-structure
- **Dependencies:**
  - app/app/contact/forums/forum.module.js — registered on forumModule

---

## Subdirectories
- [message/](message/_ab_index.md) — message — component modules
