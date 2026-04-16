## block.controller.js
- **Implementation:** app/app/contact/privateChat/block/block.controller.js
- **Summary:** Empty controller for the chat message block component.
- **Tags:** chat, communication, controller
- **Dependencies:**
  - app/app/contact/privateChat/privateChat.module.js — registered on chat module

---

## block.directive.js
- **Implementation:** app/app/contact/privateChat/block/block.directive.js
- **Summary:** Directive (element: "block") rendering a group of consecutive messages from the same sender in the private chat. Formats timestamps using moment.js calendar format, separates first/middle/last messages for styling, and applies "usuario" or "destinatario" CSS class based on sender identity.
- **Tags:** chat, communication, directive, ui
- **Dependencies:**
  - app/app/contact/privateChat/privateChat.module.js — registered on chat module
