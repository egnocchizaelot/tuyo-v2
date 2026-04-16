## dashboardapplications.js
- **Implementation:** test/spec/directives/dashboardapplications.js
- **Summary:** Jasmine unit test specification for the `dashboardApplications` directive. Loads the `feApp` module, creates a new scope, then compiles the `<dashboard-applications>` element and asserts its rendered text content matches the expected placeholder string. This is a scaffold-generated test verifying the directive compiles and renders correctly.
- **Tags:** testing, jasmine, spec, directives
- **Dependencies:**
  - app/pages/dashboard/ — the dashboard module containing the directive being tested
  - angular-mocks — provides `module()`, `inject()`, and `$compile` test helpers

---

## insurancesheader.js
- **Implementation:** test/spec/directives/insurancesheader.js
- **Summary:** Jasmine unit test specification for the `insurancesHeader` directive. Loads the `feApp` module, creates a new scope, then compiles the `<insurances-header>` element and asserts its rendered text content matches the expected placeholder string. This is a scaffold-generated test verifying the directive compiles and renders correctly.
- **Tags:** testing, jasmine, spec, directives
- **Dependencies:**
  - app/ — the application module containing the insurancesHeader directive
  - angular-mocks — provides `module()`, `inject()`, and `$compile` test helpers

---

## dashboard_desktop_feed_grid.js
- **Implementation:** test/spec/directives/dashboard_desktop_feed_grid.js
- **Summary:** Jasmine unit test suite for the dashboardDesktop directive's infinite scroll and viewport-fill behavior under the 3-column feed grid layout. Tests AC6 (infinite scroll still triggers correctly when grid compresses vertical height — auto-loading pages, scroll threshold on shorter pages, loading stops on empty API), AC10 (real-time new listings do not cause disorienting reflow — previous donations load on scroll-to-top), and scroll listener cleanup on destroy.
- **Tags:** tag-testing, tag-jasmine, tag-directives, tag-dashboard, tag-infinite-scroll, tag-feed-grid
- **Dependencies:**
  - app/app/pages/dashboard/desktop/dashboard.directive.js.ab
  - angular-mocks — provides `module()`, `inject()`, `$compile`, `$httpBackend`
