'use strict'

angular.module('creation').
controller('stepOneController', ['$scope', 'appService',
    function ($scope, appService) {
        $scope.description = '';
        $scope.donationImages = [];

    }
]);
