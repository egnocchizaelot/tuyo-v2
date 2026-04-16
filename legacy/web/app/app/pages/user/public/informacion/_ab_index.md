## information.controller.js
- **Implementation:** app/app/pages/user/public/informacion/information.controller.js
- **Summary:** Controller (`publicInformationController`) for the public user information section. Listens for `mutualFriends` and `facebookLink` broadcast events to display Facebook mutual friends list (up to 20 names) and a link to the user's Facebook profile.
- **Tags:** user-profile, controller, public, facebook
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module

---

## information.directive.js
- **Implementation:** app/app/pages/user/public/informacion/information.directive.js
- **Summary:** Directive (`publicInformation`) that displays public user profile information including the join date (formatted as relative time via moment.js) and a link to open the user's Facebook profile in a new window. Uses isolate scope with `userData` binding.
- **Tags:** user-profile, directive, public, facebook
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers directive on the `user` module
  - app/app/pages/user/public/informacion/information.controller.js — uses `publicInformationController` as its controller
  - moment — moment.js library for date formatting
