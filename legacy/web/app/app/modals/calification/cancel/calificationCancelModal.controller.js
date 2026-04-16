'use strict'

angular.module('modal')
.controller('calificationCancelModalController', ['$scope', 'data',
    function ($scope, data) {

        $scope.donation = data.donation;
        $scope.selected = data.selected;

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }

    }
])
