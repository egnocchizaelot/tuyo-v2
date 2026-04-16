'use strict'

angular.module('creation').
controller('stepTwoController', ['$scope',
    function ($scope) {
        $scope.pickupTime = '';
        $scope.checkbox = { only: false };
    }
]);
