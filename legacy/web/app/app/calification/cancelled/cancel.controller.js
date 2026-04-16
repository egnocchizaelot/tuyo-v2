'use strict'

angular.module('calification')
.controller('cancelDeliveryController', ['$scope',
    function ($scope) {
        $scope.states = { CALIFICATE: 0, GOOD: 1, BAD: 2 };
        $scope.state = $scope.states.CALIFICATE;

        $scope.rateOption = { BAD: 'B', GOOD: 'G', EXCELENT: 'E', NEUTRO: 'N' }
    }
]);
