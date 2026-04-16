## area.controller.js
- **Implementation:** app/app/help/area/area.controller.js
- **Summary:** Controller for the help area component. Defines area type constants (AYUDA=2 for help topics, PROBLEMA=3 for problem reports) and sets the default area to AYUDA.
- **Tags:** help, faq, controller, angularjs
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module

---

## area.directive.js
- **Implementation:** app/app/help/area/area.directive.js
- **Summary:** Directive (`<area-help>`) that displays a paginated list of help topics for a given area (help or problem). Accepts a `what` attribute to determine which area to load. Fetches topics from `API.areaTopics()` with pagination support, manages page navigation with prev/next arrow states, enables navigation to individual topics via `$state.go`, and scrolls to top on page changes.
- **Tags:** help, faq, directive, pagination, topics, ui
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module
  - app/app/help/area/area.controller.js — uses `areaController`
  - app/app/scripts/services/api.js — `API` service for `areaTopics()`
  - app/app/app.service.js — `appService` for `helpTopicsPageSize`
