## help.controller.js
- **Implementation:** app/app/help/help.controller.js
- **Summary:** Root controller for the help page. Reads the current help section state (`s`) and topic from `$stateParams`, listens for `openTopic` events to navigate to specific help topics via `$state.go`, and exposes a `login()` method that delegates to `appService.login()` for unauthenticated users.
- **Tags:** help, faq, controller, routing, authentication
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module
  - app/app/app.service.js — `appService` for `login()` method

---

## help.module.js
- **Implementation:** app/app/help/help.module.js
- **Summary:** Declares the `help` AngularJS module with a dependency on the `creation` module. This module serves as the root for the help/FAQ system, including FAQ areas, contact forms, site help topics, and individual topic detail views.
- **Tags:** help, faq, module, angularjs
- **Dependencies:**
  - app/app/creation/ — depends on the `creation` module

---

## Subdirectories
- [area/](area/_ab_index.md) — area — component modules
- [contact/](contact/_ab_index.md) — contact — component modules
- [siteHelp/](siteHelp/_ab_index.md) — siteHelp — component modules
- [tema/](tema/_ab_index.md) — tema — component modules
