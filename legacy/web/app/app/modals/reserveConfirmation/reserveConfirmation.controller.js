'use strict'

angular.module('modal')
.controller('reserveConfirmationController', ['$scope', 'Config', 'data',
    function ($scope, Config, data) {

        $scope.sender = data.sender;
        $scope.mediaURL = Config.mediaURL;

        $scope.check = false;


        $scope.close = function (result) {
            $scope.$close(result, 200);
        }

         $scope.cancel = function () {
            $scope.close({ state: false });
        }

        $scope.accept = function () {
            $scope.close({ state: true, check: $scope.check });
        }
    }
]);
