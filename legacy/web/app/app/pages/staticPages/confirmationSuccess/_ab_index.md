## confirmationSuccess.controller.js
- **Implementation:** app/app/pages/staticPages/confirmationSuccess/confirmationSuccess.controller.js
- **Summary:** Controller (`confirmationSuccessController`) for the "Email Confirmation Success" static page. Applies a temporary click-blocking overlay and exposes the authenticated user's ID (if available) for display in the template.
- **Tags:** static-pages, controller
- **Dependencies:**
  - app/app/pages/staticPages/staticPages.module.js — registers controller on `staticPagesModule`
  - app/app/scripts/services/auth.js — Auth for userData.id
