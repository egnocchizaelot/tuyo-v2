'use strict';

angular.module('post')
.directive('theSlider', ['$timeout',
    function ($timeout) {
        var scope = {
            images: '='
        };

        var link = function (scope, element) {
            if (!scope.images) { return; }

            scope.imageCount = scope.images.length;
            scope.currentIndex = 0;


            element.on('afterChange', function() {
                scope.changing = false;
                scope.$apply();

            });

            // element.on('swipe', function(event, slide, direction){
            // })

            element.on('click', function(event){
                if (scope.changing || !scope.slide) {
                    return;
                }

                if (scope.byIndicators) {
                    scope.byIndicators = false;
                    return;
                }


                var dist = element.outerWidth() / 2;
                var x = event.offsetX;

                if (x <= dist){
                    // scope.prevImg()
                    scope.slide.slick.prev();
                }
                else if (x >= element.outerWidth() - dist) {
                    // scope.nextImg()
                    scope.slide.slick.next();

                }
            });

            scope.sliderSlickConfig = {
                enabled: true,
                dots: false,
                infinite: true,
                adaptiveHeight: true,
                mobileFirst: true,
                arrows: false,
                lazyLoad: 'progressive',
                initialSlide: 0,
                event: {
                    init: function () {
                        scope.onSlickInit();
                    }
                }
            };

            scope.nextImg = function () {
                if (!scope.slide) {
                    return;
                }

                scope.changing = true;

                scope.slide.slick.next();

                // scope.currentIndex = scope.slide.slick.currentSlide;
                // scope.currentIndex++;
                // if (scope.currentIndex >= scope.images.length)
                //     scope.currentIndex = 0;
                // scope.slide.slick.goTo(scope.currentIndex, false)

                console.log(scope.slide.slick.currentSlide + " next");
            };

            scope.prevImg = function () {
                if (!scope.slide) {
                    return;
                }

                scope.changing = true;

                scope.slide.slick.prev();

                // scope.currentIndex = scope.slide.slick.currentSlide;
                // scope.currentIndex--;
                // if (scope.currentIndex < 0)
                //     scope.currentIndex = scope.images.length -1
                // scope.slide.slick.goTo(scope.currentIndex, false)

                console.log(scope.slide.slick.currentSlide + " previous");
            };

            scope.goToImg = function (i) {
                if (!scope.slide) {
                    return;
                }

                scope.byIndicators = true;

                scope.slide.slick.goTo(i, false);
                // scope.currentIndex = scope.slide.slick.currentSlide;

            };

            scope.showImages = function () {
                scope.resize();

                if (!scope.theSlide || !scope.slide || !scope.slide.slick) {
                    return;
                }

                scope.slide.slick.setPosition();
                // scope.theSlide.css('display', 'block');
            };

            scope.$on('showSlider', function(smth, images) {
                if (images) {
                    scope.images = images;
                }

                scope.theSlide = element.find('#slickSlide');
                scope.slide = element.find('#slickSlide')[0];
                scope.slickListDraggable = scope.slide.children[0];

                if (scope.slickListDraggable.style.height === '1px') {
                    var slickTrack = scope.slickListDraggable.children[0];
                    var slickActive = slickTrack.getElementsByClassName('slick-active')[0];
                    var img = slickActive.children[0];
                    scope.slickListDraggable.style.height = img.height;

                    scope.slickListDraggable = null;
                    scope.slideContainer = null;
                }

                $timeout(function() {
                    scope.showImages();
                }, 2000);
            });

            scope.$on('imageHasLoaded', function () {
                scope.imageCount--;
                if (scope.imageCount > 0) {
                    return;
                }

                scope.$emit('readyToShowSlider');
                if (scope.slide && scope.slide.slick) {
                    $timeout(function () {
                        scope.slickConfig = {
                            adaptiveHeight: true
                        };
                        scope.goToImg(0);
                        scope.byIndicators = false;
                    });
                    scope.resize();
                }
            });

            scope.onSlickInit = function () {
                scope.$emit('readyToShowSlider');
                $timeout(function () {
                    scope.goToImg(0);
                    scope.byIndicators = false;
                });
                scope.resize();
            };

            // $timeout(function () { scope.$emit('readyToShowSlider'); });

            scope.resize = function () {
                $timeout(function() {
                    $('#slickSlide').resize();
                    // $(window).trigger('resize');
                });
            };
        };

        return {
            restrict: 'E',
            templateUrl: 'app/post/carousel/carousel.template.html',
            controller: 'theSliderController',
            link: link,
            scope: scope
        };
    }
]);
