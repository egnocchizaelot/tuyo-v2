## tema.controller.js
- **Implementation:** app/app/help/tema/tema.controller.js
- **Summary:** Controller for the individual help topic detail view. Reads the topic object and topic ID from `$stateParams` to pass to the tema directive for rendering.
- **Tags:** help, faq, controller, topic-detail
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module

---

## tema.directive.js
- **Implementation:** app/app/help/tema/tema.directive.js
- **Summary:** Directive (`<tema>`) that renders a single help topic detail page. Fetches the topic by ID via `API.getTopic()`, then parses and displays the topic's video (converting YouTube watch URLs to embed format via `$sce.trustAsResourceUrl`), text content, numbered steps (parsed by splitting on numbered markers), and Q&A sections (parsed from custom `<t>` and `</t>` delimiters). Provides navigation to related topics and help area sections. Scrolls to top on load.
- **Tags:** help, faq, directive, topic-detail, video, content-parsing, ui
- **Dependencies:**
  - app/app/help/help.module.js — registers on the `help` module
  - app/app/help/tema/tema.controller.js — uses `temaController`
  - app/app/scripts/services/api.js — `API` service for `getTopic()`
