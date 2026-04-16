## map.controller.js
- **Implementation:** app/app/map/map.controller.js
- **Summary:** Controller for the map directive. Defines text ID constants (`ZONA`, `DESCRIPCION`, `LUGAR`, `BUSCANDO`) used to toggle which informational text is displayed on the map interface. Contains commented-out mobile height adjustment logic.
- **Tags:** map, controller, angularjs, ui
- **Dependencies:**
  - app/app/map/map.module.js — registers on the `map` module

---

## map.directive.js
- **Implementation:** app/app/map/map.directive.js
- **Summary:** Core map directive (`<address-map>`) providing a full Google Maps location picker. Accepts lat/lng coordinates, accept/cancel/delete callbacks, filter mode flag, and dimensions via isolate scope. Initializes a Google Map centered on provided coordinates or falls back to Montevideo with browser geolocation. Uses a draggable center marker with overlay circle for zone visualization. Implements reverse geocoding via `google.maps.Geocoder` to resolve location names (country, city, district) using `mapService.getData()`. Supports text editing for custom location descriptions, mobile-responsive map sizing, and provides Accept/Cancel/Delete actions. Includes a `giveMeTheAddress` event listener for external components to request current map data. Also defines global helper functions `getDistanceFromLatLonInKm()` and `deg2rad()` for distance calculations.
- **Tags:** map, location, google-maps, directive, geocoding, ui, mobile
- **Dependencies:**
  - app/app/map/map.module.js — registers on the `map` module
  - app/app/map/map.controller.js — uses `mapController`
  - app/app/map/map.services.js — `mapService` for geocoder result parsing
  - app/app/modals/modals.service.js — `modalServices` for `BasicModal`, `BasicSingleButtonModal`
  - growl — notification toasts for validation feedback
  - Google Maps JavaScript API — external dependency for `google.maps.*`

---

## map.module.js
- **Implementation:** app/app/map/map.module.js
- **Summary:** Declares the `map` AngularJS module with no external module dependencies. This module provides Google Maps integration for location selection, geocoding, and address management used in donation creation and filtering.
- **Tags:** map, location, google-maps, module, angularjs
- **Dependencies:**
  - None

---

## map.services.js
- **Implementation:** app/app/map/map.services.js
- **Summary:** Service (`mapService`) that parses Google Maps Geocoder results to extract structured location data. The `getData()` method delegates to the `getBigData()` helper function, which iterates through geocoder results to find entries with a `neighborhood` type and extracts the district (neighborhood), city (locality), and country. Also contains an unused `getData()` helper function for extracting a single address component by type.
- **Tags:** map, location, google-maps, service, geocoding
- **Dependencies:**
  - app/app/map/map.module.js — registers on the `map` module
  - app/app/scripts/services/api.js — `API` service injected but not used

---

## Subdirectories
- [mapPage/](mapPage/_ab_index.md) — mapPage — component modules
