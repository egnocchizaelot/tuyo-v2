## endbad.controller.js
- **Implementation:** app/app/calification/confirm/endBad/endbad.controller.js
- **Summary:** Controller for the bad-rating report form in delivery confirmation flow. Initializes checkbox state for predefined report reasons.
- **Tags:** calification, rating, confirm, controller, reports
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module

---

## endbad.directive.js
- **Implementation:** app/app/calification/confirm/endBad/endbad.directive.js
- **Summary:** Directive (element: "endBadConfirm") presenting a checkbox-based report form for bad delivery ratings with context-specific options (donor: "distrust" vs applicant: "item in bad condition") and free-text input.
- **Tags:** calification, rating, confirm, directive, reports
- **Dependencies:**
  - app/app/calification/calification.module.js — registered on calification module
  - app/app/scripts/services/auth.js — uses Auth to determine donor/applicant role
