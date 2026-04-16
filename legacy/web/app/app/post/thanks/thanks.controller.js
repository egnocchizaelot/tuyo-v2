'use strict';

angular.module('post')
.controller('thanksPostController', ['$scope',
    function ($scope) {
        $scope.user = { DONOR: 0, APPLICANT: 1};
        $scope.selected = $scope.user.DONOR;
    }
]);
