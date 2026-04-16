## proyecto.controller.js
- **Implementation:** app/app/pages/staticPages/proyecto/proyecto.controller.js
- **Summary:** Controller (`proyectoController`) for the "About the Project" static page. Displays platform statistics (total users, total articles), provides collapsible content sections with slide toggle animations, smooth-scrolling anchor navigation, and a login shortcut. Checks authentication status to conditionally show login links.
- **Tags:** static-pages, controller, project-info
- **Dependencies:**
  - app/app/pages/staticPages/staticPages.module.js — registers controller on `staticPagesModule`
  - app/app/scripts/services/auth.js — Auth for checkLogin
  - app/app/app.service.js — appService for adminMail, user/article statistics, login function
