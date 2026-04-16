## privateChat.controller.js
- **Implementation:** app/app/modals/privateChat/privateChat.controller.js
- **Summary:** Controller for the private chat modal. Receives `data` containing `donation` and `reservedOrNot` flag via dependency injection resolve, exposes both on scope for the chat template, and provides a `close()` method to dismiss the modal with a result.
- **Tags:** modals, dialogs, controller, chat, private
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
