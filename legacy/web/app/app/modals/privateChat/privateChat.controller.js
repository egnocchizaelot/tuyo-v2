'use strict'

angular.module('modal')
.controller('privateChatModalController', ['$scope', 'data',
    function ($scope, data) {

        $scope.donation = data.donation;
        $scope.reservedOrNot = data.reservedOrNot;

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
