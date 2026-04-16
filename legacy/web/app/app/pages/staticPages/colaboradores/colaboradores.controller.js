'use strict'

angular.module('staticPagesModule')
.controller('colaboradoresController', ['$scope', 'Auth', '$state', 'appService', '$timeout',
    function ($scope, Auth, $state, appService, $timeout) {

        $scope.login = function () {
            appService.login(true);
        }

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
            clickBlock.remove();
        }, 700);

    }
]);
