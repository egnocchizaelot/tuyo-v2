## createDonation.controller.js
- **Implementation:** app/app/modals/createDonation/createDonation.controller.js
- **Summary:** Controller for the create/edit donation modal. Receives a `donation` object via dependency injection resolve (null is normalized to undefined for new donations), exposes it on scope for the creation form, and provides a `close()` method to dismiss the modal with a result.
- **Tags:** modals, dialogs, controller, donation, creation
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
