## mobilePage.controller.js
- **Implementation:** app/app/modals/mobilePage/mobilePage.controller.js
- **Summary:** Controller for the mobile full-page modal view. Defines case constants for different modal types (CREATE_DONATION=1, CREATE_APPRECIATION=2, FORUM=3, CHAT=4, CALIFICATION=5, APPRECIATION_FORUM=6, NOTIFICATIONS=7). Reads `close` callback, `data`, and `case` from `$stateParams` to determine which content to render. Redirects to the dashboard if the case is -1 (invalid/unset).
- **Tags:** modals, mobile, controller, routing, ui
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module

---

## mobilePage.directive.js
- **Implementation:** app/app/modals/mobilePage/mobilePage.directive.js
- **Summary:** Empty directive file for the mobile page modal. The file exists but contains no code (0 bytes). The mobile page functionality is handled entirely by the `mobilePage.controller.js` and its associated template.
- **Tags:** modals, mobile, directive, placeholder
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
