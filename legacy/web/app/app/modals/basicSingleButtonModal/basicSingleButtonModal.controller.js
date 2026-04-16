'use strict'

angular.module('modal')
.controller('basicSingleButtonModalController', ['$scope', 'data',
    function ($scope, data) {

        $scope.title = data.title;
        $scope.text = data.text;

        $scope.yes = data.yes || 'Aceptar';
        $scope.no = data.no || 'No';

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
