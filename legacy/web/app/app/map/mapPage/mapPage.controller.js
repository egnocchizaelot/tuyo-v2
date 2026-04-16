'use strict'

angular.module('map')
.controller('mapPageController', ['$scope', '$stateParams', 'API', '$element', '$timeout',
    function ($scope, $stateParams, API, $element, $timeout) {
        $scope.element = $element;

        $scope.lat = $stateParams.lat;
        $scope.lng = $stateParams.lng;

        $scope.accept = $stateParams.accept;
        $scope.cancel = $stateParams.cancel;

        $scope.delete = $stateParams.delete;

        $scope.isfilter = $stateParams.filterLocation;

        $scope.mapLoaded = true;
    }
]);
