'use strict'

angular.module('user')
.controller('miCuentaController', ['$scope',
    function ($scope) {
        $scope.$on('email confirmed', () => {
            $scope.userData.email_confirmed = true;
        });
    }
]);
