'use strict'

angular.module('creation').
controller('createDonationController', ['$scope', 'appService', '$window',
    function ($scope, appService, $window) {
        $scope.step = 1

        $scope.initialized = 4;
        $scope.$on('readyToGo', function (s, done) {
            $scope.initialized--;

            if (done) {
                if (done.step === 1)
                    $scope.oneDone = done.callback;

                else if (done.step === 2)
                    $scope.twoDone = done.callback;

                else if (done.step === 3)
                    $scope.threeDone = done.callback;

            }

            if ($scope.initialized === 0)
                if ($scope.donation)
                    $scope.$broadcast('editingDonation', $scope.donation);
        });

        if (appService.isMobile) {
            let button = angular.element("#backButton");

            button.css({
                'color': '#fff',
                'font-size': '2rem',
                'position': 'absolute',
                'left': '0',
                'top': '0',
                'line-height': '2.7rem',
                'padding': '0 1rem'
            });
        }
    }
]);
