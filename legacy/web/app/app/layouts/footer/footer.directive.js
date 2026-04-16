'use strict';

angular.module('footer')
.directive('tuyoFooter',['$state', 'appService', 'Auth',
    function ($state, appService, Auth) {

        const scope = {}

        const link = function (scope, element, attr) {


            scope.loggedIn = Auth.checkLogin();
            scope.landing = $state.current.name === 'app.landing';

            scope.onLanding = $state.current.name === 'app.landing';
            scope.landingPage = $state.href('app.landing');

            if (scope.landing)
                scope.landingPage = $state.href('app.landing');


            scope.login = function () {
                scope.$emit('footerLogin');
            };

        }

        return {
            restrict: 'E',
            templateUrl: "app/layouts/footer/footer.template.html",
            controller: 'tuyoFooterController',
            link: link,
            scope: scope
        };
    }
]);
