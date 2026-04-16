## landing.controller.js
- **Implementation:** app/app/pages/landing/landing.controller.js
- **Summary:** Controller for the landing page that orchestrates the entire authentication flow including Facebook OAuth login, native Tuyo email/password registration and login, password reset, email confirmation, and post-registration onboarding (address creation, profile picture upload). Manages multiple Bootstrap modals for each step of the registration wizard, validates user input (email, name, password), handles banned/disabled user states, and provides navigation to the dashboard after successful authentication.
- **Tags:** landing, authentication, controller, facebook-login, registration, password-reset, email-confirmation
- **Dependencies:**
  - app/app/pages/landing/landing.module.js — registers controller on the `landing` module
  - app/app/scripts/services/auth.js — Auth service for login, logout, registration, and token management
  - app/app/scripts/services/api.js — API service for createAddress, updateUser, resendEmail, checkEmail, forgotPassword, resetPassword, confirmEmail, sendFacebookCode, upload_profile_picture
  - app/app/app.service.js — appService for AuthLogin, AuthRegister, login, adminMail, user stats, and Facebook SDK integration
  - app/app/scripts/services/modal.service.js — modalServices (referenced but not directly used in this controller)
  - app/app/scripts/services/post.service.js — postServices for NewDonation modal trigger

---

## landing.module.js
- **Implementation:** app/app/pages/landing/landing.module.js
- **Summary:** Declares the `landing` AngularJS module with no dependencies. This module serves as the container for the landing page feature, which provides the public-facing entry point with login and registration functionality.
- **Tags:** landing, module, authentication
- **Dependencies:**
  - None
