## cancel.controller.js
- **Implementation:** app/app/calification/cancelled/cancel.controller.js
- **Summary:** Controller for the cancellation calification flow. Defines state constants (CALIFICATE, GOOD, BAD) and rate options (BAD, GOOD, EXCELENT, NEUTRO) for the cancelled reservation rating process.
- **Tags:** calification, rating, cancelled, controller
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module

---

## cancel.directive.js
- **Implementation:** app/app/calification/cancelled/cancel.directive.js
- **Summary:** Directive (element: "cancelDelivery") handling the cancelled reservation rating flow. Shows the other user involved, presents neutral/bad rating options, submits ratings via API.rateUser, and transitions between CALIFICATE, GOOD (neutral rated), and BAD (report form) sub-states. Handles close events from child endBad/endGood components.
- **Tags:** calification, rating, cancelled, directive, api
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module
  - app/app/scripts/services/api.js — uses API.rateUser for rating submission
  - app/app/scripts/services/auth.js — uses Auth for user identification

---

## Subdirectories
- [endBad/](endBad/_ab_index.md) — endBad — component modules
- [endGood/](endGood/_ab_index.md) — endGood — component modules
