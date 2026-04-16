## appreciation.controller.js
- **Implementation:** app/app/modals/appreciation/appreciation.controller.js
- **Summary:** Controller for the appreciation modal dialog. Receives a `donation` object via dependency injection resolve, exposes it on scope, and provides a `close()` method that calls `$scope.$close()` to dismiss the modal with a result.
- **Tags:** modals, dialogs, controller, appreciation
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
