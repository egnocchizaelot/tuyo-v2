## profile.controller.js
- **Implementation:** app/app/pages/user/private/miCuenta/profile.controller.js
- **Summary:** Controller (`miCuentaController`) for the "My Account" profile editing section. Listens for the `email confirmed` event broadcast from the parent directive and updates the local userData's email confirmation status accordingly.
- **Tags:** user-profile, controller, private, account-settings
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers controller on the `user` module

---

## profile.directive.js
- **Implementation:** app/app/pages/user/private/miCuenta/profile.directive.js
- **Summary:** Directive (`miCuenta`) that implements the "My Account" profile management section. Provides inline editing for email and description fields, email confirmation resend functionality, address management (create, edit, delete) via map integration, account deletion with double-confirmation modals, and logout. Uses the API service for all CRUD operations and the Auth service to persist changes to local storage.
- **Tags:** user-profile, directive, private, account-settings, address-management
- **Dependencies:**
  - app/app/pages/user/user.module.js — registers directive on the `user` module
  - app/app/pages/user/private/miCuenta/profile.controller.js — uses `miCuentaController` as its controller
  - app/app/scripts/services/auth.js — Auth for userData, changeData, logout
  - app/app/scripts/services/api.js — API for updateUser, resendEmail, createAddress, updateAddress, deleteAddress, deleteUser
  - app/app/scripts/services/modal.service.js — modalServices for BasicModal, CancelModal confirmation dialogs
