## filter.controller.js
- **Implementation:** app/app/modals/filter/filter.controller.js
- **Summary:** Controller for the filter donations modal. Provides a minimal `close()` method to dismiss the modal with a result. The actual filter logic is handled by the filter directive and parent components.
- **Tags:** modals, dialogs, controller, filter
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module

---

## filter.directive.js
- **Implementation:** app/app/modals/filter/filter.directive.js
- **Summary:** Directive (`<filter-donations>`) that wraps the filter donations modal content. Provides an empty isolate scope and link function, delegating rendering to the filter template. Uses `filterDonationsController` for modal close behavior.
- **Tags:** modals, dialogs, directive, filter, ui
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
  - app/app/modals/filter/filter.controller.js — uses `filterDonationsController`
