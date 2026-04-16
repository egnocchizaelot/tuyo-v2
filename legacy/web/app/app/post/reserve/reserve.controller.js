'use strict';

angular.module('post')
.controller('reservePostController', ['$scope',
    function ($scope) {
        $scope.states = {RESERVED: 0, CANCELLED: 1, COMPLETED: 3};
    }
]);
