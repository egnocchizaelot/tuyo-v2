## notice.controller.js
- **Implementation:** app/app/post/notice/notice.controller.js
- **Summary:** Empty controller for the notice post component. Logic is in the directive.
- **Tags:** post, notices, controller
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module

---

## notice.directive.js
- **Implementation:** app/app/post/notice/notice.directive.js
- **Summary:** Directive (element: "notice") that renders a notice post in the feed. Template adds `feed-grid-full-width` class so notice cards span all 3 columns at full width when the 3-column grid is active on desktop (AC7). Displays HTML via \$sce.trustAsHtml, provides like/unlike, opens public forum modal, handles real-time notice updates. Mobile layout not affected.
- **Tags:** tag-post, tag-notices, tag-directive, tag-likes, tag-realtime, tag-ui, tag-feed-grid
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/post.service.js — uses postServices.ShowPublicForumModal
  - app/app/scripts/services/api.js — uses API for add_like and remove_like
  - app/app/scripts/services/auth.js — uses Auth for user data
