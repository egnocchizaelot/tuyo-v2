'use strict'

angular.module('modal')
.controller('appreciationModalController', ['$scope', 'donation',
    function ($scope, donation) {

        $scope.donation = donation;

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
