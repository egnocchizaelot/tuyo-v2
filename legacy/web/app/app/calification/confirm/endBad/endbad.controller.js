'use strict'

angular.module('calification')
.controller('endBadConfirmController', ['$scope',
    function ($scope) {
        $scope.badCheckbox = {
            one: false,
            two: false,
            three: false,
            other: false
        }
    }
]);
