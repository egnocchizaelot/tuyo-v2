'use strict'

angular.module('modal')
.controller('loadingModalController', ['$scope', 'data',
    function ($scope, data) {

        $scope.data = data;

        $scope.close = function (result) {
            $scope.$close(result, 200)
        }
    }
]);
