## cancelModal.controller.js
- **Implementation:** app/app/modals/cancelModal/cancelModal.controller.js
- **Summary:** Controller for the cancel confirmation modal. Receives `data` (title, text, optional yes/no button labels) via dependency injection resolve, defaults "Si"/"No" for button text, and provides a `close()` method to dismiss the modal with a boolean result. Structurally identical to `basicModalController` but used for cancellation-specific flows.
- **Tags:** modals, dialogs, controller, confirmation, cancel, ui
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
