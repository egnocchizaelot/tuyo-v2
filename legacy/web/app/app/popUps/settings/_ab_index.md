## settings.controller.js
- **Implementation:** app/app/popUps/settings/settings.controller.js
- **Summary:** Empty controller for the settings publication popup. Serves as a placeholder controller required by the `settingsPublication` directive; all logic resides in the directive's link function.
- **Tags:** popups, settings, controller, angularjs
- **Dependencies:**
  - app/app/popUps/popups.module.js — registers on the `popUps` module

---

## settings.directive.js
- **Implementation:** app/app/popUps/settings/settings.directive.js
- **Summary:** Directive (`<settings-publication>`) that provides a dropdown settings menu for donation publications owned by the user. Accepts callback functions for `showForum`, `showChat`, `deleteDonation`, and `editDonation`, plus a `reserved` flag via isolate scope. Toggles a collapsible menu with options to edit, view applicant list, open chat, republish, or delete the publication. The Delete action prompts for confirmation via `modalServices.BasicModal` before executing. Auto-closes on outside clicks via `$document` click listener.
- **Tags:** popups, settings, directive, ui, modals, dialogs
- **Dependencies:**
  - app/app/popUps/popups.module.js — registers on the `popUps` module
  - app/app/popUps/settings/settings.controller.js — uses `settingsPublicationController`
  - app/app/modals/modals.service.js — `modalServices` for `BasicModal` confirmation dialog
