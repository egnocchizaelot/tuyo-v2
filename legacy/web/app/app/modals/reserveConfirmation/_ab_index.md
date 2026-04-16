## reserveConfirmation.controller.js
- **Implementation:** app/app/modals/reserveConfirmation/reserveConfirmation.controller.js
- **Summary:** Controller for the reserve confirmation modal. Receives `data` containing `sender` info via dependency injection resolve, retrieves the media URL from `Config` service for displaying sender images, and manages a `check` flag (checkbox state). Provides `accept()` (returns state=true with check value), `cancel()` (returns state=false), and generic `close()` methods for modal dismissal.
- **Tags:** modals, dialogs, controller, confirmation, reservation
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
  - app/deploy_config.js — `Config` service for `mediaURL`
