'use strict'

angular.module('staticPagesModule')
.controller('proyectoController', ['$scope', '$location', '$anchorScroll', 'Auth', '$state', 'appService', '$window', '$timeout',
    function ($scope, $location, $anchorScroll, Auth, $state, appService, $window, $timeout) {

        $scope.loggedIn = Auth.checkLogin();
        $scope.landingPage = $state.href('app.landing');

        $scope.adminMail = appService.adminMail
        $scope.usuariosT = appService.usuariosTotales
        $scope.usuariosK = appService.usuariosK
        $scope.articulosT = appService.articulosTotales
        $scope.articulosK = appService.articulosK


        $scope.window = angular.element($window);
        // $scope.fixed = false;
        // $scope.yellowHeight = $('.hero-yellow').height()
        // console.log($scope.yellowHeight);

        $scope.toggle = function (id) {
            $(id).slideToggle(400, function (e){
                if ($(id).is(':hidden'))
                    $(id+'Text').text('Continuar leyendo');
                else
                    $(id+'Text').text('Ocultar')
            });
        }

        $scope.goTo = function (id) {
            let anchor = $('#' + id);
            $('html,body').animate({ scrollTop: anchor.offset().top - 50}, 800, 'easeInOutQuint');
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
