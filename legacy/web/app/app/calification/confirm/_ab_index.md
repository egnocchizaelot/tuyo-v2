## confirm.controller.js
- **Implementation:** app/app/calification/confirm/confirm.controller.js
- **Summary:** Controller for the delivery confirmation calification flow. Defines state constants (CALIFICATE, GOOD, BAD) and rate options (BAD, GOOD, EXCELENT).
- **Tags:** calification, rating, confirm, controller
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module

---

## confirm.directive.js
- **Implementation:** app/app/calification/confirm/confirm.directive.js
- **Summary:** Directive (element: "confirmDelivery") handling the delivery confirmation rating flow. Shows the other user, presents bad/good/excellent rating buttons, submits ratings via API.rateUser, and transitions through CALIFICATE, GOOD, and BAD sub-states. Handles close events from endBad/endGood children.
- **Tags:** calification, rating, confirm, directive, api
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module
  - app/app/scripts/services/api.js — uses API.rateUser for rating submission
  - app/app/scripts/services/auth.js — uses Auth for user identification

---

## Subdirectories
- [endBad/](endBad/_ab_index.md) — endBad — component modules
- [endGood/](endGood/_ab_index.md) — endGood — component modules
