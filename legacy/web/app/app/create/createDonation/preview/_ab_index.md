## preview.controller.js
- **Implementation:** app/app/create/createDonation/preview/preview.controller.js
- **Summary:** Controller for the donation creation preview step. Initializes the loaded state flag and styles a mobile back button.
- **Tags:** creation, donations, controller, preview
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/app/app.service.js — uses appService.isMobile

---

## preview.directive.js
- **Implementation:** app/app/create/createDonation/preview/preview.directive.js
- **Summary:** Directive (element: "previewDonation") showing a preview of the donation before publishing. Assembles a preview donation object from collected wizard data, renders it using the donationPost component, and provides edit/publish/save action buttons. Sets button text to "Guardar" in edit mode.
- **Tags:** creation, donations, directive, preview, ui
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/scripts/services/auth.js — uses Auth for creator data in preview
