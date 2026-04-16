'use strict'

angular.module('popUps')
.controller('reportPublicationController', ['$scope',
    function ($scope) {
        $scope.reportCheckbox = {
            noApropiado: false,
            noOfrecimiento: false,
            publicidad: false,
            otra: false
        }
    }
]);
