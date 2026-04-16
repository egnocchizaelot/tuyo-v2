## siteHelp.controller.js
- **Implementation:** app/app/help/siteHelp/siteHelp.controller.js
- **Summary:** Controller for the site-wide help/FAQ component. Retrieves the authenticated user's full name from `Auth.userData` for display in the help section.
- **Tags:** help, faq, controller, authentication
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module
  - app/app/scripts/services/auth.js — `Auth` service for `userData.full_name`

---

## siteHelp.directive.js
- **Implementation:** app/app/help/siteHelp/siteHelp.directive.js
- **Summary:** Directive (`<stie-help>`, note: typo in directive name) that displays the main site help FAQ page. Loads paginated help topics for area ID 1 (site help) via `API.areaTopics()`, implements page navigation with prev/next arrows, caches loaded pages to avoid redundant API calls, and provides navigation to individual topic views and help area sections. Scrolls to top of page on navigation.
- **Tags:** help, faq, directive, pagination, topics, ui
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module
  - app/app/help/siteHelp/siteHelp.controller.js — uses `siteHelpController`
  - app/app/scripts/services/api.js — `API` service for `areaTopics()`
  - app/app/app.service.js — `appService` for `helpTopicsPageSize`
