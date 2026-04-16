'use strict'

angular.module('modal')
.controller('cancelModalController', ['$scope', 'data',
    function ($scope, data) {

        $scope.title = data.title;
        $scope.text = data.text;

        $scope.yes = data.yes || 'Si';
        $scope.no = data.no || 'No';

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
