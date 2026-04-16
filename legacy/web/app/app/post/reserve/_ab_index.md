## reserve.controller.js
- **Implementation:** app/app/post/reserve/reserve.controller.js
- **Summary:** Controller for the reserve post component that defines reservation state constants (RESERVED, CANCELLED, COMPLETED) used by the reserve directive.
- **Tags:** post, donations, reserve, controller
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module

---

## reserve.directive.js
- **Implementation:** app/app/post/reserve/reserve.directive.js
- **Summary:** Directive (element: "reservePost") that renders the reserved donation card shown in the user profile. Displays reservation state (reserved/cancelled/completed), the other user involved, and provides actions: cancel reservation with API unselect, deliver donation with API state change, open private chat, calification triggers, and real-time state updates. Delegates calification flow to postServices.ShowCalificationModal.
- **Tags:** post, donations, reserve, directive, calification, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post.service.js — uses postServices for modals and calification
  - app/app/post/donation/donation.service.js — uses donationServices for reservedOrNot callback
  - app/app/scripts/services/api.js — uses API for donationApplicantsAcctions and changeDonationState
  - app/app/scripts/services/auth.js — uses Auth for user identification
  - app/app/modals/modals.service.js — uses modalServices for confirmation dialogs
