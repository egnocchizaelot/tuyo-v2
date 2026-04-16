## navBarYes.controller.js
- **Implementation:** app/app/layouts/navigationBar/loggedIn/navBarYes.controller.js
- **Summary:** Controller (`navBarYesController`) for the logged-in navigation bar variant. Currently contains only commented-out code for handling new donation notifications. Serves as the controller for the `navBarYes` directive.
- **Tags:** navigation, controller, layout
- **Dependencies:**
  - app/app/layouts/navigationBar/navigationBar.module.js — registers controller on `navigationBar` module

---

## navBarYes.directive.js
- **Implementation:** app/app/layouts/navigationBar/loggedIn/navBarYes.directive.js
- **Summary:** Directive (`navBarYes`) that implements the navigation bar for authenticated users. Features include: active state highlighting for current route, scroll-based logo show/hide and shadow effects, user profile link, "new donation" button integration via postServices, responsive mobile menu toggle with slide animations, iPad/small-width layout adjustments, and click-outside-to-close menu behavior.
- **Tags:** navigation, directive, layout, authenticated
- **Dependencies:**
  - app/app/layouts/navigationBar/navigationBar.module.js — registers directive on `navigationBar` module
  - app/app/layouts/navigationBar/loggedIn/navBarYes.controller.js — uses `navBarYesController`
  - app/app/scripts/services/auth.js — Auth for userData
  - app/app/scripts/services/api.js — Config/API for mediaURL
  - app/app/app.service.js — appService for isMobile, titleHeight, navigationHeight
  - app/app/scripts/services/post.service.js — postServices for NewDonation
