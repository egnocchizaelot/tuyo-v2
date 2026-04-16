## step1.controller.js
- **Implementation:** app/app/create/createDonation/step1/step1.controller.js
- **Summary:** Controller for step 1 of donation creation, initializing empty description and donationImages array.
- **Tags:** creation, donations, controller, wizard
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module

---

## step1.directive.js
- **Implementation:** app/app/create/createDonation/step1/step1.directive.js
- **Summary:** Directive (element: "stepOne") for the first step of donation creation. Handles description text input with 1000-character max, image uploads (max 4 photos) with remove capability, displays user info with ranking stars, supports editing mode by pre-filling from existing donation data, and reports readiness/validation via readyToGo callback.
- **Tags:** creation, donations, directive, wizard, images
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/scripts/services/auth.js — uses Auth for user data display
