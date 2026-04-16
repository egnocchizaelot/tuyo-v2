## step2.controller.js
- **Implementation:** app/app/create/createDonation/step2/step2.controller.js
- **Summary:** Controller for step 2 of donation creation, initializing pickup time text and mandatory checkbox state.
- **Tags:** creation, donations, controller, wizard
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module

---

## step2.directive.js
- **Implementation:** app/app/create/createDonation/step2/step2.directive.js
- **Summary:** Directive (element: "stepTwo") for the second step of donation creation. Collects pickup time description (max 300 chars) and a mandatory-only checkbox, supports editing mode, and validates via readyToGo callback.
- **Tags:** creation, donations, directive, wizard
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
