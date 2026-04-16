'use strict'

angular.module('help')
.controller('areaController', ['$scope',
    function ($scope) {

        $scope.areas= {AYUDA: 2, PROBLEMA: 3}
        $scope.area = $scope.areas.AYUDA;
    }
]);
