## report.controller.js
- **Implementation:** app/app/popUps/reportPublication/report.controller.js
- **Summary:** Controller for the report publication popup. Initializes a `reportCheckbox` object with four boolean flags (noApropiado, noOfrecimiento, publicidad, otra) representing the report reason options available to the user when reporting a publication.
- **Tags:** popups, reports, complaints, controller, angularjs
- **Dependencies:**
  - app/app/popUps/popups.module.js — registers on the `popUps` module

---

## report.directive.js
- **Implementation:** app/app/popUps/reportPublication/report.directive.js
- **Summary:** Directive (`<report-publication>`) that provides a dropdown menu for reporting donations or appreciations. Accepts `entityId` and `type` (D for donation, A for appreciation) via isolate scope. Toggles visibility of a collapsible report menu on click, listens for document clicks to auto-close when clicking outside, and on the `hide` event opens a confirmation modal (`reportModal.template.html`) displaying the result text after a report is submitted.
- **Tags:** popups, reports, complaints, directive, ui, modals
- **Dependencies:**
  - app/app/popUps/popups.module.js — registers on the `popUps` module
  - app/app/popUps/reportPublication/report.controller.js — uses `reportPublicationController`
