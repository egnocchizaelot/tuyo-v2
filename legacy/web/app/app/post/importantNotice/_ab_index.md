## importantNotice.controller.js
- **Implementation:** app/app/post/importantNotice/importantNotice.controller.js
- **Summary:** Empty controller for the important notice component. Logic is in the directive.
- **Tags:** post, notices, controller
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module

---

## importantNotice.directive.js
- **Implementation:** app/app/post/importantNotice/importantNotice.directive.js
- **Summary:** Directive (element: "importantNotice") that renders admin-created important notices at the top of the feed. Template adds `feed-grid-full-width` class so notice cards span all 3 columns at full width when the 3-column grid is active on desktop (AC7). Renders HTML via \$sce.trustAsHtml, provides "stop showing" dismiss button. Mobile layout not affected.
- **Tags:** tag-post, tag-notices, tag-directive, tag-admin, tag-ui, tag-feed-grid
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/scripts/services/api.js — uses API.notShowImportantNotice to dismiss
