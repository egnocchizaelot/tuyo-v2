## loading.controller.js
- **Implementation:** app/app/modals/loading/loading.controller.js
- **Summary:** Controller for the loading modal overlay. Receives `data` (containing display text) via dependency injection resolve, exposes it on scope for the loading template to display, and provides a `close()` method to dismiss the modal programmatically.
- **Tags:** modals, loading, controller, ui
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
