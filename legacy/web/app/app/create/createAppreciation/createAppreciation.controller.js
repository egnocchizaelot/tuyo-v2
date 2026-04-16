'use strict'

angular.module('createAppreciation').
controller('createAppreciationController', ['$scope', 'appService',
    function ($scope, appService) {
        $scope.description = '';
        $scope.appreciationImages = [];

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
