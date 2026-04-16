'use strict'

angular.module('creation').
directive('previewAppreciation', ['Auth', 'Config', 'appService', '$timeout',
    function (Auth, Config, appService, $timeout) {

        let scope = {
            pathR: '=',
            pathL: '=',
            images: '=',
            description: '=',
            fullName: '=',
            mine: '='
        }

        const link = function (scope, element, attr) {
            scope.mediaURL = Config.mediaURL;
            scope.now = new Date();
            scope.element = element;
            scope.laHeight = 320;
            element.find('#carousel').css('height', scope.laHeight + 'px');


            let c = scope.mine ? 'agradecimiento-oferente' : 'agradecimiento-solicitante';
            element.find('.tab-pane').addClass(c);


            $timeout(function() {
                let h = scope.element.find('#appreciationDescription').outerHeight();
                scope.laHeight = 320 - h;
                element.find('#carousel').css('height', scope.laHeight + 'px');
                scope.doIt = true;

                // $(window).trigger('resize');
            });

            // region  --  SLICK CAROUSEL  --
            scope.slide = element.find('#slickSlide')[0];
            scope.currentIndex = 0;

            scope.nextImg = function () {
                scope.slide.slick.next();
                scope.currentIndex = scope.slide.slick.currentSlide;
            }

            scope.prevImg = function () {
                scope.slide.slick.prev();
                scope.currentIndex = scope.slide.slick.currentSlide;
            }

            scope.goToImg = function (i) {
                scope.slide.slick.goTo(i, false)
                scope.currentIndex = scope.slide.slick.currentSlide;
            }

            // endregion

            scope.editAppreciation = function () {
                scope.$emit('editAppreciation');
            }

            scope.publishAppreciation = function () {
                scope.$emit('publishAppreciation');
            }

            scope.Close = function () {
                scope.$emit('back');
            }

        }

        return {
            restrict: 'E',
            templateUrl: 'app/create/createAppreciation/preview/preview.template.html',
            controller: 'previewAppreciationController',
            link: link,
            scope: scope
        }
    }
]);
