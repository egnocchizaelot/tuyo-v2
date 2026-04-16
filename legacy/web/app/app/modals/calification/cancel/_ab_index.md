## calificationCancelModal.controller.js
- **Implementation:** app/app/modals/calification/cancel/calificationCancelModal.controller.js
- **Summary:** Controller for the calification (rating) cancellation modal. Receives `data` containing `donation` and `selected` (the selected applicant) via dependency injection resolve, exposes both on scope, and provides a `close()` method to dismiss the modal with a result.
- **Tags:** modals, dialogs, controller, calification, rating
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
