## modals.module.js
- **Implementation:** app/app/modals/modals.module.js
- **Summary:** Declares the `modal` AngularJS module with no external dependencies and configures the `$modalProvider` to disable animations globally by default. This module serves as the root for all modal dialog components including basic modals, confirmation modals, chat modals, donation creation, filtering, loading overlays, and mobile page modals.
- **Tags:** modals, module, angularjs, ui, dialogs
- **Dependencies:**
  - None

---

## modals.service.js
- **Implementation:** app/app/modals/modals.service.js
- **Summary:** Service (`modalServices`) providing centralized methods to open common modal dialogs via `$modal`. Includes `BasicModal` (yes/no confirmation with customizable title, text, and button labels), `CancelModal` (similar yes/no pattern for cancel confirmations), `BasicSingleButtonModal` (single-button acknowledgment dialog), and `ReserveConfirmation` (reserve confirmation dialog showing sender details). Each method opens a modal with a static backdrop, emits `addToHistory` on `$rootScope`, and invokes an optional callback with the modal result. Also listens for `$routeChangeStart` to dismiss any open modal on navigation.
- **Tags:** modals, service, dialogs, ui, confirmation
- **Dependencies:**
  - app/app/modals/modals.module.js — registers on the `modal` module
  - app/app/modals/basicModal/basicModal.controller.js — used by `BasicModal`
  - app/app/modals/cancelModal/cancelModal.controller.js — used by `CancelModal`
  - app/app/modals/basicSingleButtonModal/basicSingleButtonModal.controller.js — used by `BasicSingleButtonModal`
  - app/app/modals/reserveConfirmation/reserveConfirmation.controller.js — used by `ReserveConfirmation`

---

## Subdirectories
- [appreciation/](appreciation/_ab_index.md) — appreciation — component modules
- [basicModal/](basicModal/_ab_index.md) — basicModal — component modules
- [basicSingleButtonModal/](basicSingleButtonModal/_ab_index.md) — basicSingleButtonModal — component modules
- [cancelModal/](cancelModal/_ab_index.md) — cancelModal — component modules
- [chatModal/](chatModal/_ab_index.md) — chatModal — component modules
- [createDonation/](createDonation/_ab_index.md) — createDonation — component modules
- [filter/](filter/_ab_index.md) — filter — component modules
- [loading/](loading/_ab_index.md) — loading — component modules
- [meAnoto/](meAnoto/_ab_index.md) — meAnoto — component modules
- [mobilePage/](mobilePage/_ab_index.md) — mobilePage — component modules
- [privateChat/](privateChat/_ab_index.md) — privateChat — component modules
- [publicForum/](publicForum/_ab_index.md) — publicForum — component modules
- [reserveConfirmation/](reserveConfirmation/_ab_index.md) — reserveConfirmation — component modules
