'use strict'

angular.module('calification')
.controller('endBadCancelController', ['$scope',
    function ($scope) {
        $scope.badCheckbox = {
            one: false,
            two: false,
            three: false,
            four: false,
            other: false

        }
    }
]);
