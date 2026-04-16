## chat.controller.js
- **Implementation:** app/app/modals/chatModal/chat.controller.js
- **Summary:** Controller for the chat applicant modal. Receives `data` containing `donation`, `reservedOrNot` flag, and `appreciation` object via dependency injection resolve, exposes all on scope, and provides a `close()` method to dismiss the modal with a result. Used when opening a chat session with a donation applicant.
- **Tags:** modals, dialogs, controller, chat
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
