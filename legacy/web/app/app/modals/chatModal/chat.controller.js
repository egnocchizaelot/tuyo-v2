'use strict'

angular.module('modal')
.controller('chatApplicantController', ['$scope', 'data',
    function ($scope, data) {

        $scope.donation = data.donation;
        $scope.reservedOrNot = data.reservedOrNot;
        $scope.appreciation = data.appreciation;

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
