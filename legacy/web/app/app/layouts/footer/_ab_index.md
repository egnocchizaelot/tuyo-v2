## footer.controller.js
- **Implementation:** app/app/layouts/footer/footer.controller.js
- **Summary:** Controller (`tuyoFooterController`) for the site footer. Provides a login function that emits the `footerDecideLogIn` event upward to the parent scope, allowing the landing page controller to handle the login flow.
- **Tags:** footer, controller, layout, authentication
- **Dependencies:**
  - app/app/layouts/footer/footer.module.js — registers controller on `footer` module

---

## footer.directive.js
- **Implementation:** app/app/layouts/footer/footer.directive.js
- **Summary:** Directive (`tuyoFooter`) that renders the site-wide footer. Checks authentication status and current route (landing vs other pages) to conditionally display login links and landing page references. Emits `footerLogin` event when the login link is clicked. Uses isolate scope.
- **Tags:** footer, directive, layout, authentication
- **Dependencies:**
  - app/app/layouts/footer/footer.module.js — registers directive on `footer` module
  - app/app/layouts/footer/footer.controller.js — uses `tuyoFooterController`
  - app/app/scripts/services/auth.js — Auth for checkLogin
  - app/app/app.service.js — appService (injected)

---

## footer.module.js
- **Implementation:** app/app/layouts/footer/footer.module.js
- **Summary:** Declares the `footer` AngularJS module with no dependencies. Serves as the container for the site-wide footer component.
- **Tags:** footer, module, layout
- **Dependencies:**
  - None
