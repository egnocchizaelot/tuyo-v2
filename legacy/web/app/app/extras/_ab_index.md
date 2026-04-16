## onEnter.directive.js
- **Implementation:** app/app/extras/onEnter.directive.js
- **Summary:** Directive (`ng-enter`) that executes an AngularJS expression when the Enter key (keyCode 13) is pressed on the host element. Binds to both `keydown` and `keypress` events, evaluates the expression provided in the `ng-enter` attribute via `scope.$eval`, and prevents the default form submission behavior. Commonly used on input fields to trigger search or submit actions on Enter.
- **Tags:** utility, directive, keyboard, events, ui
- **Dependencies:**
  - app/app/extras/tuyoAux.module.js — registers on the `tuyoAux` module

---

## tuyoAux.module.js
- **Implementation:** app/app/extras/tuyoAux.module.js
- **Summary:** Declares the `tuyoAux` AngularJS module with no external dependencies. This module provides auxiliary utility directives used across the application, such as keyboard event handling.
- **Tags:** utility, module, angularjs, extras
- **Dependencies:**
  - None
