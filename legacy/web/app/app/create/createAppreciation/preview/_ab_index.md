## preview.controller.js
- **Implementation:** app/app/create/createAppreciation/preview/preview.controller.js
- **Summary:** Controller for the appreciation preview, initializing the donationLoaded flag. Registered on the creation module.
- **Tags:** appreciation, creation, controller, preview
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on creation module

---

## preview.directive.js
- **Implementation:** app/app/create/createAppreciation/preview/preview.directive.js
- **Summary:** Directive (element: "previewAppreciation") showing the appreciation preview with user images, description, Slick carousel for appreciation photos, and edit/publish/close action buttons. Applies different CSS classes for donor vs applicant appreciation styles.
- **Tags:** appreciation, creation, directive, preview, carousel, ui
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on creation module
  - app/app/scripts/services/auth.js — uses Auth for user data
