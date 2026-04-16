## step3.controller.js
- **Implementation:** app/app/create/createDonation/step3/step3.controller.js
- **Summary:** Controller for step 3 of donation creation, initializing map dimension defaults.
- **Tags:** creation, donations, controller, wizard, map
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module

---

## step3.directive.js
- **Implementation:** app/app/create/createDonation/step3/step3.directive.js
- **Summary:** Directive (element: "stepThree") for the third step of donation creation. Displays user addresses as selectable pickup locations, allows adding new addresses via the map component (with API.createAddress), manages active/inactive location toggles, handles editing mode by pre-selecting existing donation addresses, and validates that at least one location is selected.
- **Tags:** creation, donations, directive, wizard, map, location
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/scripts/services/api.js — uses API.createAddress for new locations
  - app/app/scripts/services/auth.js — uses Auth for user address data
