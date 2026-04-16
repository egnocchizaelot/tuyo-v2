'use strict'

angular.module('staticPagesModule')
.controller('reglamentoController', ['$scope', 'Auth', '$state', 'appService', '$timeout',
    function ($scope, Auth, $state, appService, $timeout) {

        $scope.textes = {}
        $scope.textes['#tres'] = '¿Por qué?';
        $scope.textes['#cuatro'] = 'Leer más';
        $scope.textes['#cinco'] = 'Leer más';

        $scope.adminMail = appService.adminMail

        $scope.loggedIn = Auth.checkLogin();
        $scope.landingPage = $state.href('app.landing');

        $scope.toggle = function (id) {
            $(id).slideToggle(400, function (e){
                if ($(id).is(':hidden'))
                    $(id+'Text').text($scope.textes[id]);
                else
                    $(id+'Text').text('Ocultar')
            });
        }

        $scope.login = function () {
            appService.login(true);
        }

        $scope.loggedIn = Auth.checkLogin();

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
            clickBlock.remove();
        }, 700);

    }
]);
