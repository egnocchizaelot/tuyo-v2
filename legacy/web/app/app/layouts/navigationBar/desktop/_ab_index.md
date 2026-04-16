## navigationBar.controller.js
- **Implementation:** app/app/layouts/navigationBar/desktop/navigationBar.controller.js
- **Summary:** Controller (`navigationBarControllerDesktop`) for the desktop navigation bar. Currently an empty controller placeholder that serves as the controller for the desktop navigation bar directive.
- **Tags:** navigation, controller, layout
- **Dependencies:**
  - app/app/layouts/navigationBar/navigationBar.module.js — registers controller on `navigationBar` module

---

## navigationBar.directive.js
- **Implementation:** app/app/layouts/navigationBar/desktop/navigationBar.directive.js
- **Summary:** Directive (`navigationBarDesktop`) that renders the top-level desktop navigation bar. Checks authentication status via `Auth.checkLogin()` in its link function to determine which sub-navbar to display (logged-in vs not-logged-in). Uses `navigationBarControllerDesktop` as its controller.
- **Tags:** navigation, directive, layout
- **Dependencies:**
  - app/app/layouts/navigationBar/navigationBar.module.js — registers directive on `navigationBar` module
  - app/app/layouts/navigationBar/desktop/navigationBar.controller.js — uses `navigationBarControllerDesktop`
  - app/app/scripts/services/auth.js — Auth for checkLogin
  - app/app/app.service.js — appService (injected)
