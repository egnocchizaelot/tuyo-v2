## user.module.js
- **Implementation:** app/app/pages/user/user.module.js
- **Summary:** Declares the `user` AngularJS module with a dependency on `post`, and configures the `app.user` UI Router state that maps the URL `profile/:id` to the `userProfileController` and `userProfile.template.html`. Accepts `id` and `state` parameters for routing to specific user profiles and profile tabs.
- **Tags:** user-profile, module, routing
- **Dependencies:**
  - app/app/pages/post/post.module.js — post module dependency for donation post components
  - app/app/pages/user/userProfile.controller.js — userProfileController referenced in state config
  - app/app/pages/user/userProfile.template.html — template for the user profile state

---

## userProfile.controller.js
- **Implementation:** app/app/pages/user/userProfile.controller.js
- **Summary:** Controller that determines whether to show the private or public user profile view by comparing the route parameter `id` against the currently authenticated user's ID. Sets `$scope.private` to true when viewing one's own profile (or when id is 'user'), enabling the template to render the appropriate sub-directive.
- **Tags:** user-profile, controller, routing
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module
  - app/app/scripts/services/auth.js — Auth service for userData.id to determine profile ownership

---

## Subdirectories
- [private/](private/_ab_index.md) — private — component modules
- [public/](public/_ab_index.md) — public — component modules
