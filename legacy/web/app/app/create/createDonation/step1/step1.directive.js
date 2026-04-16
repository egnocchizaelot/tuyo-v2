'use strict'

angular.module('creation').
directive('stepOne', ['Auth', 'Config', 'appService',
    function (Auth, Config, appService) {

        let scope = {
        }

        const link = function (scope, element, attr) {
            let height = element.parent().find('#creationNavBar').outerHeight()
            element.css('padding-top', height + 'px');
            element.css('display', 'block');

            scope.loadingImgs = false;

            scope.maxLength = 1000;

            scope.donationImages = [];

            scope.isMobile = appService.isMobile;

            /* USER INFO*/
            scope.user = Auth.userData
            scope.mediaURL = Config.mediaURL;
            scope.imagePath = Config.mediaURL + scope.user.picture_url;
            scope.ranking = function () {
                let rank = Math.round(scope.user.ranking);
                return Array.apply(0, new Array(rank));
            }

            scope.removeImage = function(index) {
                if (index < 0 || index >= scope.donationImages.length)
                    return;

                scope.donationImages.splice(index, 1);
            }

            /* Time to send donation. Or at least to see the preview */
            scope.$on('sendData', () => {
                let ret = {
                    step: 1,
                    description: scope.description,
                    images: scope.donationImages
                };
                scope.$emit('dataSent', ret);
            });


            /*  EDITING  */
            scope.$on('editingDonation', function (smth, donation) {
                scope.description = donation.description;

                for (let i = 0; i < donation.files.length; i++) {
                    let path = scope.mediaURL + donation.files[i].file_url;
                    let id = donation.files[i].id
                    scope.donationImages.push({ img: path, id });
                }
            });

            scope.$emit('readyToGo', {step: 1, callback: function () {
                if (!scope.description || scope.description === '')
                    return -1;

                if (scope.donationImages && scope.donationImages.length > 4)
                    return -2;

                if (scope.description.length > scope.maxLength)
                    return scope.maxLength;

                return 0;
            }});

            scope.loading = function () {
                scope.loadingImgs = !scope.loadingImgs;
            }
        };

        return {
            restrict: 'E',
            templateUrl: 'app/create/createDonation/step1/step1.template.html',
            controller: 'stepOneController',
            link: link,
            scope: scope
        }
    }
]);
