# app/styles/

## Subdirectories
(none)

---

## main.scss

**Summary:** Primary SCSS entry point for the legacy/alternate style pipeline. Imports constants, Bootstrap 3 via bootstrap-sass-official, then defines application-wide styles for layout, typography, navigation, and general UI components. Used alongside the Compass-based `app/assets/scss/` pipeline.

**Dependencies:**
- constants.scss — project color and sizing variables
- bower_components/bootstrap-sass-official/ — Bootstrap 3 SCSS source

**Tags:** scss, styles, bootstrap, entry-point

**Implementation:** app/styles/main.scss

---

## constants.scss

**Summary:** SCSS variables file defining project-wide color palette ($primary-color green, $oposite-color orange, blues, greys), brand colors, font size, and sidebar width. Serves as the variable source for all files in the `app/styles/` directory.

**Dependencies:**
(none)

**Tags:** scss, styles, configuration

**Implementation:** app/styles/constants.scss

---

## animate.scss

**Summary:** Minimal animation stylesheet. Applies a fadeInUp CSS animation to elements with `ng-animate` attribute and `.ng-enter` transitions, providing entry animations for Angular's ngAnimate module.

**Dependencies:**
(none)

**Tags:** scss, styles

**Implementation:** app/styles/animate.scss

---

## header.scss

**Summary:** Header component styles. Customizes scrollbar appearance for the header element and defines header layout, positioning, and styling. Imports constants for variable access.

**Dependencies:**
- constants.scss

**Tags:** scss, styles

**Implementation:** app/styles/header.scss

---

## forms.scss

**Summary:** Form element styles. Customizes text inputs, passwords, emails, date fields, and textareas with project-specific border, color, and placeholder styling. Built on Bootstrap's `.form-control` class. Imports constants for variable access.

**Dependencies:**
- constants.scss

**Tags:** scss, styles

**Implementation:** app/styles/forms.scss

---

## list.scss

**Summary:** List/grid item styles. Defines the `.list-wrapper` and `.list-item` layout for displaying donation and content items in an inline-block grid with card-style info containers. Imports constants for variable access.

**Dependencies:**
- constants.scss

**Tags:** scss, styles

**Implementation:** app/styles/list.scss

---

## login.scss

**Summary:** Login page styles. Defines the full-viewport login page layout with primary color background, centered form layout, and branded heading styles. Imports constants for variable access.

**Dependencies:**
- constants.scss

**Tags:** scss, styles

**Implementation:** app/styles/login.scss

---

## pages.scss

**Summary:** General page-level styles. Defines layout rules for various application pages including action headers, content areas, and the Google Maps autocomplete z-index fix. Imports constants for variable access.

**Dependencies:**
- constants.scss

**Tags:** scss, styles

**Implementation:** app/styles/pages.scss

---

## app/styles/bootstrap.min.css.ab
- **Implementation:** app/styles/bootstrap.min.css
- **Summary:** Bootstrap 3.3.7 CSS framework minified production copy — 5 lines, provides the complete Bootstrap grid, components, and responsive utilities.
- **Dependencies:** _none_

---

## app/styles/bootstrap.css.ab
- **Implementation:** app/styles/bootstrap.css
- **Summary:** Bootstrap 3.3.7 CSS framework unminified reference copy — 6757 lines, for development inspection.
- **Dependencies:** _none_

---

## app/styles/bootstrap-theme.min.css.ab
- **Implementation:** app/styles/bootstrap-theme.min.css
- **Summary:** Bootstrap 3.3.7 optional theme CSS minified — gradient and shadow enhancements on Bootstrap components.
- **Dependencies:** _none_

---

## app/styles/bootstrap-theme.css.ab
- **Implementation:** app/styles/bootstrap-theme.css
- **Summary:** Bootstrap 3.3.7 optional theme CSS unminified — 587 lines, development reference.
- **Dependencies:** _none_

---

## app/styles/font-awesome.min.css.ab
- **Implementation:** app/styles/font-awesome.min.css
- **Summary:** Font Awesome 4.6.3 icon font CSS minified — provides all `.fa-*` icon classes and FontAwesome @font-face declarations.
- **Dependencies:** _none_

---

## app/styles/screen.css.ab
- **Implementation:** app/styles/screen.css
- **Summary:** Minified single-line compiled mobile/responsive application stylesheet in the legacy app/styles/ directory — compressed form of app/assets/css/screen.css.
- **Dependencies:** _none_

---

## app/styles/screen-backup.css.ab
- **Implementation:** app/styles/screen-backup.css
- **Summary:** Backup copy of a previous minified screen.css — preserved as a rollback reference, not loaded by the application.
- **Dependencies:** _none_

---

## app/styles/desktop.css.ab
- **Implementation:** app/styles/desktop.css
- **Summary:** Minified single-line compiled desktop stylesheet in the legacy app/styles/ directory — compressed form of app/assets/css/desktop.css.
- **Dependencies:** _none_

---

## app/styles/print.css.ab
- **Implementation:** app/styles/print.css
- **Summary:** Empty Compass print media stylesheet placeholder — no print styles defined.
- **Dependencies:** _none_

---

## app/styles/ie.css.ab
- **Implementation:** app/styles/ie.css
- **Summary:** Empty Compass IE-specific override stylesheet placeholder — no IE overrides defined.
- **Dependencies:** _none_

---

## ajax-loader.gif

**Summary:** Animated GIF loading spinner used as a visual indicator during AJAX requests or async operations.

**Dependencies:**
(none)

**Tags:** styles

**Implementation:** app/styles/ajax-loader.gif

---
