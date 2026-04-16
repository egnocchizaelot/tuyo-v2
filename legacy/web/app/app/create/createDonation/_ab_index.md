## creation.controller.js
- **Implementation:** app/app/create/createDonation/creation.controller.js
- **Summary:** Controller for the multi-step donation creation wizard. Tracks the current step (1-4), collects step-completion callbacks from child directives via readyToGo events, and initializes editing mode when an existing donation is provided.
- **Tags:** creation, donations, controller, wizard
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/app/app.service.js — uses appService.isMobile for mobile styling

---

## creation.directive.js
- **Implementation:** app/app/create/createDonation/creation.directive.js
- **Summary:** Main directive (element: "createDonation") orchestrating the 4-step donation creation wizard. Manages step navigation with validation (description required, max characters, pickup text length, address selection), aggregates data from child step directives via dataSent events, and handles both new donation publishing (API.newDonation) and existing donation updates (API.updateDonation) with loading states.
- **Tags:** creation, donations, directive, wizard, api, ui
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/create/createDonation/creation.controller.js — uses createDonationController
  - app/app/scripts/services/api.js — uses API.newDonation and API.updateDonation
  - app/app/modals/modals.service.js — uses modalServices for exit confirmation
  - app/app/loading/loading.service.js — uses loadingService for upload progress

---

## creation.module.js
- **Implementation:** app/app/create/createDonation/creation.module.js
- **Summary:** Declares the "creation" AngularJS module for the donation creation wizard. Depends on the post module.
- **Tags:** creation, donations, module
- **Dependencies:**
  - app/app/post/post.module.js — depends on post module

---

## Subdirectories
- [preview/](preview/_ab_index.md) — preview — component modules
- [step1/](step1/_ab_index.md) — step1 — component modules
- [step2/](step2/_ab_index.md) — step2 — component modules
- [step3/](step3/_ab_index.md) — step3 — component modules
