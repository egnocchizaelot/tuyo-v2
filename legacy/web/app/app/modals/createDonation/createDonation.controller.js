'use strict'

angular.module('modal')
.controller('modalCreateController', ['$scope', 'donation',
    function ($scope, donation) {
        if (donation === null)
            donation = undefined
            
        $scope.donation = donation;

        $scope.close = function (result) {
            $scope.$close(result, 200)
        }
    }
]);
