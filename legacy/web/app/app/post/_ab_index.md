## post.controller.js
- **Implementation:** app/app/post/post.controller.js
- **Summary:** Controller for the main donation post feed. Manages the list of visible and showing donations, handles pagination events (firstDonations, nextDonations, prevDonations), deduplicates donations/notices by trackId, and emits lastDonation/topDonations events to coordinate infinite scroll loading. Also manages important notices display.
- **Tags:** post, donations, controller, feed, pagination, notices
- **Dependencies:**
  - app/app/post/post.module.js — registers on the post module
  - app/app/post/post.service.js — uses postServices injected via scope
  - app/app/app/app.service.js — uses appService for donationsPagination config

---

## post.directive.js
- **Implementation:** app/app/post/post.directive.js
- **Summary:** Directive (element: "posts") that renders the donation post feed. Template adds `.feed-grid` class to ng-repeat containers, enabling product cards arranged in 3-column grid on desktop (AC1) while preserving card content (AC3), handling partial rows with fewer than 3 listings (AC4), and keeping mobile single-column unchanged (AC2). Manages real-time updates, viewport tracking, socket polling, donation deletion.
- **Tags:** tag-post, tag-donations, tag-directive, tag-realtime, tag-socket-io, tag-feed, tag-ui, tag-feed-grid
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post.controller.js — uses postController
  - app/app/socket.service.js — uses socketService for real-time donation updates
  - app/app/app.service.js — uses appService.donationUpdateTime for polling interval

---

## post.module.js
- **Implementation:** app/app/post/post.module.js
- **Summary:** Declares the "post" AngularJS module, which is the core module for displaying donation posts, notices, and appreciations in the feed. Depends on popUps, forumModule, publicForum, chat, slickCarousel, modal, ngclipboard, and angular-inview modules.
- **Tags:** post, donations, module, feed, ui
- **Dependencies:**
  - app/app/popUps/popups.module.js — depends on popUps module for report/settings popups
  - app/app/contact/forums/forum.module.js — depends on forumModule for public forum features
  - app/app/contact/publicForum/publicForum.module.js — depends on publicForum module
  - app/app/contact/privateChat/privateChat.module.js — depends on chat module for private messaging
  - app/app/modals/modals.module.js — depends on modal module for dialog overlays

---

## post.service.js
- **Implementation:** app/app/post/post.service.js
- **Summary:** Service that acts as a facade/router for post-related modal operations, delegating to either postMobileServices or postWebServices based on the appService.isMobile flag. Provides methods for showing reservation modals, public/private forum modals, appreciation modals, edit donation modals, calification modals, new donation creation, and share link toggling. Also contains utility functions for filtering donations by type, availability, recency, and sorting.
- **Tags:** post, donations, service, modals, responsive, mobile
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post_mobile.service.js — delegates to mobile service implementations
  - app/app/post/post_web.service.js — delegates to web/desktop service implementations
  - app/app/app/app.service.js — uses appService.isMobile to choose mobile vs web

---

## post_mobile.service.js
- **Implementation:** app/app/post/post_mobile.service.js
- **Summary:** Mobile-specific service for post modal operations. Instead of opening Bootstrap modals (as the web service does), it navigates to the app.mobileModal state with appropriate data/case parameters for each action: me-anoto confirmation, public forum, private chat, appreciation creation, donation editing, calification flows (delivered/cancelled), and new donation creation.
- **Tags:** post, donations, mobile, service, modals, navigation
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/modals/modals.service.js — uses modalServices.BasicModal for confirmations
  - app/app/app/app.service.js — uses appService for pickup description defaults
  - app/app/scripts/services/auth.js — uses Auth for user data and navigation

---

## post_web.service.js
- **Implementation:** app/app/post/post_web.service.js
- **Summary:** Web/desktop-specific service for post modal operations. Opens Bootstrap modals via \$modal.open for each action: me-anoto reservation, public forum, private chat, appreciation, donation editing, calification confirm/cancel, and new donation creation. Manages modal state (processingModal, forumIsOpen) to prevent duplicate modals and handles result callbacks for state transitions.
- **Tags:** post, donations, web, service, modals, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/modals/modals.service.js — uses modalServices.BasicModal for confirmations
  - app/app/modals/chatModal/chat.controller.js — opens chatApplicantController modal
  - app/app/modals/privateChat/privateChat.controller.js — opens privateChatModalController
  - app/app/modals/appreciation/appreciation.controller.js — opens appreciationModalController
  - app/app/modals/createDonation/createDonation.controller.js — opens modalCreateController
  - app/app/modals/calification/confirm/calificationConfirmModal.controller.js — opens confirm calification modal
  - app/app/modals/calification/cancel/calificationCancelModal.controller.js — opens cancel calification modal
  - app/app/modals/publicForum/publicForum.controller.js — opens publicForumModalController

---

## Subdirectories
- [carousel/](carousel/_ab_index.md) — carousel — component modules
- [donation/](donation/_ab_index.md) — donation — component modules
- [importantNotice/](importantNotice/_ab_index.md) — importantNotice — component modules
- [lonelyDonation/](lonelyDonation/_ab_index.md) — lonelyDonation — component modules
- [notice/](notice/_ab_index.md) — notice — component modules
- [reserve/](reserve/_ab_index.md) — reserve — component modules
- [thanks/](thanks/_ab_index.md) — thanks — component modules
