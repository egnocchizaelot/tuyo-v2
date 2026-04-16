## navBarNotL.controller.js
- **Implementation:** app/app/layouts/navigationBar/notLoggedin/navBarNotL.controller.js
- **Summary:** Controller (`navBarNoController`) for the not-logged-in navigation bar variant. Currently an empty controller placeholder that serves as the controller for the `navBarNo` directive.
- **Tags:** navigation, controller, layout
- **Dependencies:**
  - app/app/layouts/navigationBar/navigationBar.module.js — registers controller on `navigationBar` module

---

## navBarNotL.directive.js
- **Implementation:** app/app/layouts/navigationBar/notLoggedin/navBarNotL.directive.js
- **Summary:** Directive (`navBarNo`) that implements the navigation bar for unauthenticated users. Provides links to rules, project info, and landing pages, a login button that emits `navBarLogin` event, and navigation helpers that redirect to the landing page before opening registration or login modals. Includes responsive mobile menu toggle with slide animations and click-outside-to-close behavior.
- **Tags:** navigation, directive, layout, unauthenticated
- **Dependencies:**
  - app/app/layouts/navigationBar/navigationBar.module.js — registers directive on `navigationBar` module
  - app/app/layouts/navigationBar/notLoggedin/navBarNotL.controller.js — uses `navBarNoController`
  - app/app/app.service.js — appService for adminMail
