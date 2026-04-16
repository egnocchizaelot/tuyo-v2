## thanks.controller.js
- **Implementation:** app/app/post/thanks/thanks.controller.js
- **Summary:** Controller for the thanks/appreciation post component. Defines user role constants (DONOR, APPLICANT) and sets the default selected view to DONOR.
- **Tags:** post, appreciation, controller
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module

---

## thanks.directive.js
- **Implementation:** app/app/post/thanks/thanks.directive.js
- **Summary:** Directive (element: "thanksPost") that renders an appreciation/thanks post. Displays both donor and applicant appreciation messages with dates, image carousels, like/unlike functionality, share links, and a toggle between donor/applicant views. Handles real-time appreciation updates, deep-link modal opening via URL params, and links to user profiles and the public forum.
- **Tags:** post, appreciation, directive, likes, sharing, realtime, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post.service.js — uses postServices for forum and share modals
  - app/app/contact/forums/forum.services.js — uses forumService (injected)
  - app/app/scripts/services/api.js — uses API for likes and media URLs
  - app/app/scripts/services/auth.js — uses Auth for current user data
