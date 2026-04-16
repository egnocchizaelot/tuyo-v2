## createAppreciation.controller.js
- **Implementation:** app/app/create/createAppreciation/createAppreciation.controller.js
- **Summary:** Controller for the appreciation creation form. Initializes the description text, appreciation images array, and styles the mobile back button.
- **Tags:** appreciation, creation, controller
- **Dependencies:**
  - app/app/create/createAppreciation/createAppreciation.module.js — registered on createAppreciation module
  - app/app/app/app.service.js — uses appService.isMobile for mobile styling

---

## createAppreciation.directive.js
- **Implementation:** app/app/create/createAppreciation/createAppreciation.directive.js
- **Summary:** Directive (element: "createAppreciation") for the appreciation creation form. Shows creator/recipient images, validates description (max 800 chars), manages image uploads with remove, toggles between editing and preview modes, publishes via API.newAppreciation with loading indicator, and broadcasts newAppreciationCreated on success.
- **Tags:** appreciation, creation, directive, api, ui
- **Dependencies:**
  - app/app/create/createAppreciation/createAppreciation.module.js — registered on createAppreciation module
  - app/app/scripts/services/api.js — uses API.newAppreciation
  - app/app/scripts/services/auth.js — uses Auth for user identification
  - app/app/modals/modals.service.js — uses modalServices for exit confirmation
  - app/app/loading/loading.service.js — uses loadingService for upload progress

---

## createAppreciation.module.js
- **Implementation:** app/app/create/createAppreciation/createAppreciation.module.js
- **Summary:** Declares the "createAppreciation" AngularJS module for appreciation/thanks creation. Depends on slickCarousel for image display.
- **Tags:** appreciation, creation, module
- **Dependencies:** _none_

---

## Subdirectories
- [preview/](preview/_ab_index.md) — preview — component modules
