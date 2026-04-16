'use strict';

angular.module('post')
.controller('lonelyDonationController', ['$scope', '$stateParams', 'API', '$element', '$timeout', 'Auth', 'socketService', '$interval', 'appService', '$location',
    function ($scope, $stateParams, API, $element, $timeout, Auth, socketService, $interval, appService, $location) {

        $scope.loggedIn = !!Auth.userData;
        $scope.element = $element;
        $scope.mediaURL = API.mediaURL;

        $scope.changeShowing = function () {
            $scope.showingAppreciation = !$scope.showingAppreciation;
            $timeout(function() { $scope.$broadcast('showSlider'); });
        };

        // region  --  REAL TIME UPDATE --
        var promise;
        $scope.startUpdate = function () {
            promise = $interval(function() {
                var id = $scope.donation.id;
                var lastUpdate = $scope.donation.date_modified;

                socketService.donationChanged(id, lastUpdate,
                    function(data) {

                        var elId = '#donation_' + $scope.donation.id;
                        var el = angular.element(elId).scope().$$childHead;

                        // region CHANCHADA
                        //TODO: Sacar esto cuando sepamos bien por qué pasa y cómo solucionarlo
                        var c = 50;
                        while (!el.donation && el.$$childHead && c > 0) {
                            el = el.$$childHead;
                            c--;
                        }

                        if (c <= 0 || !el.donation){
                            console.log('Salió el error de nuevo');
                            return;
                        }
                        // endregion

                        if (!el.donation.appreciation) {
                            if (el.donationChanged) {
                                el.donationChanged(data);
                            }
                        }
                        else {
                            if (el.appreciationChanged) {
                                el.appreciationChanged(data);
                            }
                        }

                    }
                );

            }, appService.donationUpdateTime);
        };

        $scope.$on('$destroy', function() {
            if ($scope.loggedIn && promise) {
                $interval.cancel(promise);
            }
        });
        // endregion

        if ($scope.loggedIn) {
            API.donation_details($stateParams.donationId).then(
                function (donation) {

                    $scope.donationLoaded = true;

                    if (typeof donation === 'string') {
                        $scope.notFound = true;
                        return;
                    }

                    $scope.donation = donation;
                    $scope.startUpdate();

                    if ($location.$$search.open_chat || $stateParams.openChat) {
                        $timeout(function () { $scope.$broadcast('openChatOnPage'); });
                    }

                },
                function (){
                    $scope.notFound = true;
                    $scope.donationLoaded = true;
                }

            );
        }
        else {

            $scope.$on('readyToShowSlider', function() {
                $scope.$broadcast('showSlider', $scope.sliderImages);
                $timeout(function() { $(window).trigger('resize'); });
            });

            $timeout(function() { $(window).trigger('resize'); });

            API.public_donation($stateParams.donationId).then(
                    function(donation) {

                        $scope.donationLoaded = true;

                        if (typeof donation === 'string') {
                            $scope.notFound = true;
                            return;
                        }

                        $scope.donation = donation;

                        $scope.sliderImages = [];
                        if (donation.files && donation.files.length > 0) {
                            var images = donation.files.slice();
                            for (var k = 0; k < images.length; k++) {
                                var img = images[k];
                                $scope.sliderImages.push($scope.mediaURL + img.file_url);
                            }
                        }

                        $timeout(function() {
                            $scope.$broadcast('showSlider', $scope.sliderImages);

                            $timeout(function() {
                                $(window).trigger('resize');
                                $('#slider').resize();
                            });
                        });

                        $timeout(function() {
                            $(window).trigger('resize');
                            $('#slider').resize();
                        }, 1500);
                    },
                    function () {
                        $scope.notFound = true;
                        $scope.donationLoaded = true;
                    }
            );

            $timeout( function() { $(window).trigger('resize'); } );
        }

    }
]);
