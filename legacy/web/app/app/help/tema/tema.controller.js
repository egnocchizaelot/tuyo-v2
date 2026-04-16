'use strict'

angular.module('help')
.controller('temaController', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

        $scope.tema = $stateParams.topic;
        $scope.temaId = $stateParams.t;
    }
]);
