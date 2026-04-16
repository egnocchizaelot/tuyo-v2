## endbad.controller.js
- **Implementation:** app/app/calification/cancelled/endBad/endbad.controller.js
- **Summary:** Controller for the bad-rating report form in cancellation flow. Initializes checkbox state for predefined report reasons.
- **Tags:** calification, rating, cancelled, controller, reports
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module

---

## endbad.directive.js
- **Implementation:** app/app/calification/cancelled/endBad/endbad.directive.js
- **Summary:** Directive (element: "endBadCancel") presenting a checkbox-based report form for bad cancellation ratings. Offers context-specific options (donor vs applicant perspective), validates free-text input (max 800 chars), and emits close event with concatenated report text.
- **Tags:** calification, rating, cancelled, directive, reports
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module
  - app/app/scripts/services/auth.js — uses Auth to determine donor/applicant role
