'use strict'

angular.module('creation').
directive('previewDonation', ['Auth', 'appService',
    function (Auth, appService) {

        let scope = {
        }

        const link = function (scope, element, attr) {

            /* DONATION PREVIEW */
            scope.user = Auth.userData;
            scope.ranking = function () {
                let rank = Math.round(scope.user.ranking);
                return Array.apply(0, new Array(rank));
            };

            scope.buttonText = 'Publicar';

            scope.slide = element.find('#slickSlide')[0];
            scope.currentIndex = 0;

            scope.nextImg = function () {
                scope.slide.slick.next();
                scope.currentIndex = scope.slide.slick.currentSlide;
            };

            scope.prevImg = function () {
                scope.slide.slick.prev();
                scope.currentIndex = scope.slide.slick.currentSlide;
            };

            scope.goToImg = function (i) {
                scope.slide.slick.goTo(i, false)
                scope.currentIndex = scope.slide.slick.currentSlide;
            };
            /* END DONATION PREVIEW*/

            /* DATA EXCHANGE */
            scope.$on('setDonation', (smth, donation) => {

                scope.donation = donation;
                scope.donation.files = donation.files.map(f => f.img);

                let date = new Date().toISOString().split('T');
                scope.donation.created = {
                    date: date[0],
                    time: date[1]
                };

                scope.donation.creator = scope.user;
                scope.donation.state = { name: 'Published'};

                scope.donation.preview = true;

                scope.$broadcast('imagesChange');
                scope.$broadcast('donationDescriptionChanged');

                scope.donationLoaded = true;
            });
            /*  END DATA EXCHANGE  */

            scope.close = function () {
                scope.$emit('back');
            };

            scope.editDonation = function () {
                scope.$emit('editDonation');
            };

            scope.donationAction = function () {
                scope.$emit('donationAction');
            };

            /*  EDITING  */
            scope.$on('editingDonation', function (smth, donation) {
                scope.buttonText = 'Guardar';
            });
            scope.$emit('readyToGo');

        };

        return {
            restrict: 'E',
            templateUrl: 'app/create/createDonation/preview/preview.template.html',
            controller: 'previewDonationController',
            link: link,
            scope: scope
        }
    }
]);
