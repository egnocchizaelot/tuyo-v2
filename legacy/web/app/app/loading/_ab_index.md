## loading.controller.js
- **Implementation:** app/app/loading/loading.controller.js
- **Summary:** Empty controller for the loading directive. Serves as a placeholder controller required by the `loading` directive; all logic resides in the directive's link function.
- **Tags:** loading, controller, angularjs
- **Dependencies:**
  - app/app/loading/loading.module.js — registers on the `loadingModule` module

---

## loading.directive.js
- **Implementation:** app/app/loading/loading.directive.js
- **Summary:** Directive (`<loading>`) that displays an animated loading indicator. Accepts a `data` binding and a `back` attribute to select the background style — `'grey'` uses a feed-specific loading GIF while the default uses a standard loading GIF. Renders the appropriate loading image based on the context.
- **Tags:** loading, directive, ui, animation
- **Dependencies:**
  - app/app/loading/loading.module.js — registers on the `loadingModule` module
  - app/app/loading/loading.controller.js — uses `loadingController`

---

## loading.module.js
- **Implementation:** app/app/loading/loading.module.js
- **Summary:** Declares the `loadingModule` AngularJS module with no external dependencies. Provides loading indicator components including a directive for inline loading spinners and a service for modal loading overlays.
- **Tags:** loading, module, angularjs, ui
- **Dependencies:**
  - None

---

## loading.service.js
- **Implementation:** app/app/loading/loading.service.js
- **Summary:** Service (`loadingService`) that provides a modal-based loading overlay. The `Show(text)` method opens a `$modal` dialog with the loading template and `loadingModalController`, using a static backdrop to prevent dismissal. The `Close()` method dismisses the modal. Used to display blocking loading indicators during long-running operations.
- **Tags:** loading, service, modals, ui
- **Dependencies:**
  - app/app/loading/loading.module.js — registers on the `loadingModule` module
  - app/app/modals/loading/loading.controller.js — uses `loadingModalController` for the modal instance
  - app/app/modals/loading/loading.template.html — modal template
