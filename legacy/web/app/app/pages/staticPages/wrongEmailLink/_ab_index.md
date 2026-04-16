## wrongEmailLink.controller.js
- **Implementation:** app/app/pages/staticPages/wrongEmailLink/wrongEmailLink.controller.js
- **Summary:** Controller (`wrongEmailController`) for the "Wrong Email Link" static page. Applies a temporary click-blocking overlay and exposes the authenticated user's ID (if available) for display in the template.
- **Tags:** static-pages, controller
- **Dependencies:**
  - app/app/pages/staticPages/staticPages.module.js — registers controller on `staticPagesModule`
  - app/app/scripts/services/auth.js — Auth for userData.id
