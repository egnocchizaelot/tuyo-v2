'use strict'

angular.module('creation').
controller('previewDonationController', ['$scope', 'appService',
    function ($scope, appService) {
        $scope.donationLoaded = false;

		if (appService.isMobile) {
            let button = angular.element("#backPreview");

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
