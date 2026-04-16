/* global google */
'use strict';

angular.module('dashboard')
.controller('dashboardControllerDesktop', ['$scope', 'mapService', '$stateParams', 'appService', '$timeout',
    function ($scope, mapService, $stateParams, appService, $timeout) {
        $scope.filterOptions = {ALL: 1, DONATIONS: 2, AVAILABLE: 3, THANKS: 4, LIKED: 5};
        $scope.filterBy = {OFRECIMIENTOS: 'ofrecimientos', DISPONIBLES: "disponibles", RECIENTES: "recientes", AGRADECIMIENTOS: "agradecimientos", LIKES: "likes"};

        $scope.focusDonation = $stateParams.donationId;

        $scope.filters = $stateParams.filters;


        if ($scope.filters.order_by && $scope.filters.order_by === "likes") {
                $scope.filterName = 'Destacados';
                $scope.filterSelected = $scope.filterOptions.LIKED;
        }
        else {
            switch ($scope.filters.filter_by) {

                case $scope.filterBy.OFRECIMIENTOS:
                    $scope.filterName = 'Ofrecimientos';
                    $scope.filterSelected = $scope.filterOptions.DONATIONS;
                    break;

                case $scope.filterBy.DISPONIBLES:
                    $scope.filterName = 'Disponibles';
                    $scope.filterSelected = $scope.filterOptions.AVAILABLE;
                    break;

                case $scope.filterBy.RECIENTES:
                    $scope.filterName = 'Recientes';
                    $scope.filterSelected = $scope.filterOptions.RECENT;
                    break;

                case $scope.filterBy.AGRADECIMIENTOS:
                    $scope.filterName = 'Agradecimientos';
                    $scope.filterSelected = $scope.filterOptions.THANKS;
                    break;

                default:
                    $scope.filterName = "Filtrar";
                    $scope.filterSelected = $scope.filterOptions.ALL;
                    break;
            }
        }


        var mapData = $scope.filters.mapData;
        delete $scope.filters.mapData;

        if ($scope.filters === 'none') {
            $scope.filters = {};
        }

        $scope.getCurrentPosition = function() {
            navigator.geolocation.getCurrentPosition(
                // Geolocation good to go
                function(pos){
                    var coord = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({latLng: coord}, function(result, status) {
                        if (status !== google.maps.GeocoderStatus.OK || result.length === 0) {
                            return;
                        }

                        var data = mapService.getData(result);

                        $scope.country = data.country;
                        $scope.departamento = data.city;
                        $scope.barrio = data.district;

                        // $scope.locationSelected = $scope.country;
                        $scope.locationSelected = 'Uruguay';

                        $scope.geoLocationActive = true;
                    });
                },
                // There was a friking ERROR
                function (error) {
                    $scope.geoLocationActive = false;

                    $scope.country = "Uruguay";

                    $scope.departamento = "";
                    $scope.barrio = "";

                    // $scope.locationSelected = $scope.country;
                    $scope.locationSelected = 'Uruguay';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            // "User denied the request for Geolocation."
                            $scope.departamento = "minga";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            // "Location information is unavailable."
                            break;
                        case error.TIMEOUT:
                            // "The request to get user location timed out."
                            break;
                        case error.UNKNOWN_ERROR:
                            // "An unknown error occurred."
                            break;
                    }
                }
            );
        };

        if (!mapData) {
            $scope.getCurrentPosition();
        } else {
            $scope.country = mapData.country;
            $scope.departamento = mapData.city;
            $scope.barrio = mapData.district;


            $scope.locationSelected = "Zona de búsqueda";
            if (window.innerWidth <= 415) {
                $scope.locationSelected = "Zona...";
            }
        }

        $scope.filters.page_size = appService.donationsPagination;

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
            clickBlock.remove();
        }, 700);

    }
]);
