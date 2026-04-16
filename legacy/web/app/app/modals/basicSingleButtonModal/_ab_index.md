## basicSingleButtonModal.controller.js
- **Implementation:** app/app/modals/basicSingleButtonModal/basicSingleButtonModal.controller.js
- **Summary:** Controller for the single-button acknowledgment modal. Receives `data` (title, text, optional button labels) via dependency injection resolve, defaults "Aceptar" for the accept button, and provides a `close()` method to dismiss the modal with a result.
- **Tags:** modals, dialogs, controller, acknowledgment, ui
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
