'use strict'

angular.module('modal')
.controller('filterDonationsController', ['$scope',
    function ($scope) {

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
