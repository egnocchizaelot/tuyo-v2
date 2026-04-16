## donation.controller.js
- **Implementation:** app/app/post/donation/donation.controller.js
- **Summary:** Empty controller for the donation post component. All donation display logic resides in the donationPost directive link function.
- **Tags:** post, donations, controller
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module

---

## donation.directive.js
- **Implementation:** app/app/post/donation/donation.directive.js
- **Summary:** Core directive (element: "donationPost") responsible for rendering a single donation card in the feed. Handles: user identification (creator/applicant), date formatting, description truncation with show-more, like/unlike with optimistic updates via API, image carousel integration, donation state changes (Published/Reserved/Completed/OpenChat), real-time donation updates, share links (Facebook, Twitter, clipboard), modal openings for forum/chat/appreciation/edit/calification, and deep-link handling for modals via URL parameters.
- **Tags:** post, donations, directive, likes, sharing, realtime, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post.service.js — uses postServices for modal operations
  - app/app/post/donation/donation.controller.js — uses donationPostController
  - app/app/scripts/services/api.js — uses API for likes, deletion, Facebook sharing
  - app/app/scripts/services/auth.js — uses Auth for current user data
  - app/app/app/app.service.js — uses appService for mobile detection, dev mode

---

## donation.service.js
- **Implementation:** app/app/post/donation/donation.service.js
- **Summary:** Service providing donation-specific operations: opening private chat, showing appreciation modals, and managing donation state transitions (Published, Reserved, Completed, OpenChat). Used as a helper by the reserve directive for state management and calification callbacks.
- **Tags:** post, donations, service, state-management
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post.service.js — delegates modal operations to postServices
  - app/app/scripts/services/auth.js — uses Auth for user identification
