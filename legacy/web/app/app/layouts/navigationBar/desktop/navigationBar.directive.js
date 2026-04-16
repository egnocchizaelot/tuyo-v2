'use strict';

angular.module('navigationBar')
.directive('navigationBarDesktop',['Auth', 'Config', '$timeout', '$window', 'appService', '$state', '$modal',
    function (Auth, Config, $timeout, $window, appService, $state, $modal) {

        const link = function (scope, element, attr) {
            scope.loggedIn = Auth.checkLogin();
        }

        return {
            restrict: 'E',
            templateUrl: "app/layouts/navigationBar/desktop/navigationBar.template.html",
            controller: 'navigationBarControllerDesktop',
            link: link
        };
    }
]);
