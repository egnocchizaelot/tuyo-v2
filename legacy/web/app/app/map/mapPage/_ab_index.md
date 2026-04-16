## mapPage.controller.js
- **Implementation:** app/app/map/mapPage/mapPage.controller.js
- **Summary:** Controller for the standalone map page view. Reads location parameters (lat, lng), action callbacks (accept, cancel, delete), and filter mode flag from `$stateParams` and passes them to the scope for the map directive to consume. Sets `mapLoaded` flag to true once initialized.
- **Tags:** map, location, controller, routing
- **Dependencies:**
  - app/app/map/map.module.js — registers on the `map` module
  - app/app/scripts/services/api.js — `API` service injected but not directly used in controller
