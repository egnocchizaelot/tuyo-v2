## carousel.controller.js
- **Implementation:** app/app/post/carousel/carousel.controller.js
- **Summary:** Empty controller for the image slider/carousel component used in donation posts. The carousel logic is entirely in the directive link function.
- **Tags:** post, carousel, controller, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module

---

## carousel.directive.js
- **Implementation:** app/app/post/carousel/carousel.directive.js
- **Summary:** Directive (element: "theSlider") that implements a Slick-based image carousel for donation posts. Manages slide navigation (next/prev/goTo), click-based navigation by detecting left/right half clicks, handles lazy image loading with adaptive height, listens for showSlider events to reinitialize, and emits readyToShowSlider when all images are loaded.
- **Tags:** post, carousel, directive, slick, images, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
  - app/app/post/carousel/carousel.controller.js — uses theSliderController

---

## carousel.image.directive.js
- **Implementation:** app/app/post/carousel/carousel.image.directive.js
- **Summary:** Simple attribute directive (onImageLoad) that emits an "imageHasLoaded" event when an image element finishes loading. Used by the carousel to track when all images are ready for display.
- **Tags:** post, carousel, directive, images, ui
- **Dependencies:**
  - app/app/post/post.module.js — registered on the post module
