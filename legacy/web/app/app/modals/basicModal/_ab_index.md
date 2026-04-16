## basicModal.controller.js
- **Implementation:** app/app/modals/basicModal/basicModal.controller.js
- **Summary:** Controller for the basic yes/no confirmation modal. Receives `data` (title, text, optional yes/no button labels) via dependency injection resolve, defaults "Si"/"No" for button text, and provides a `close()` method to dismiss the modal with a boolean result.
- **Tags:** modals, dialogs, controller, confirmation, ui
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
