'use strict'

angular.module('modal')
.controller('publicForumModalController', ['$scope', 'data',
    function ($scope, data) {

        $scope.data = data.data;

        $scope.close = function (result) {
            $scope.$close(result, 200);
        }
    }
]);
