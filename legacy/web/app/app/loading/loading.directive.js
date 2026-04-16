'use strict'

angular.module('loadingModule')
.directive('loading', [
    function () {
        const scope = {
            data: '=',
            back: '@'
        }

        const link = function (scope, element, attr) {

            switch (scope.back) {
                case 'grey':
                    scope.source = 'assets/images/loading/feed.gif';
                    break;
                default:
                    scope.source = 'assets/images/loading/default.gif';
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/loading/loading.template.html',
            controller: 'loadingController',
            link: link,
            scope: scope
        }
    }
]);
