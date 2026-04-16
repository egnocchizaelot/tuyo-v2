## message.controller.js
- **Implementation:** app/app/contact/forums/message/message.controller.js
- **Summary:** Empty controller for the forum message component. Logic is in the directive.
- **Tags:** forum, communication, controller
- **Dependencies:**
  - app/app/contact/forums/forum.module.js — registered on forumModule

---

## message.directive.js
- **Implementation:** app/app/contact/forums/message/message.directive.js
- **Summary:** Directive (element: "forumMessage") rendering a single forum message with sender info, ranking stars, date, response toggling, like/unlike, comment enabling (green highlight), applicant removal, donor reservation actions (select user with confirmation popup via modalServices.ReserveConfirmation), and profile navigation with forum close.
- **Tags:** forum, communication, directive, likes, donations, ui
- **Dependencies:**
  - app/app/contact/forums/forum.module.js — registered on forumModule
  - app/app/scripts/services/api.js — uses API for likes and reservation actions
  - app/app/scripts/services/auth.js — uses Auth for user data
  - app/app/modals/modals.service.js — uses modalServices.ReserveConfirmation

---

## Subdirectories
- [childMessage/](childMessage/_ab_index.md) — childMessage — component modules
