'use strict';

angular.module('navigationBar')
.directive('navBarYes',['API', 'Auth', 'Config', '$timeout', '$window', 'appService', '$state', '$modal', '$interval', '$localStorage', '$rootScope', 'postServices',
    function (API, Auth, Config, $timeout, $window, appService, $state, $modal, $interval, $localStorage, $rootScope, postServices) {

        const link = function (scope, element, attr) {
            scope.userData = Auth.userData;
            scope.mediaURL = Config.mediaURL;

            scope.mobile = appService.isMobile;

            scope.window = angular.element($window);
            scope.element = element;

            scope.showLogo = true;
            switch ($state.$current.self.name) {
                case 'app.donations.dashboard':
                    $('#inicio').addClass('active');
                    scope.showLogo = false;
                    break;

                case 'app.reglamento':
                    $('#rules').addClass('active');
                    break;

                case 'app.ayuda':
                    $('#help').addClass('active');
                    break;

                case 'app.proyecto':
                    $('#project').addClass('active');
                    break;

                case 'app.colaboradores':
                    $('#colaborators').addClass('active');
                    break;
            }

            $(document).ready(function () {
                $(document).click(function (e) {
                    let clickover = $(e.target);

                    if (scope.showMenu && clickover.parents('.navbar').length === 0) {
                        scope.showMenu = false;
                        $('#bs-example-navbar-collapse-12').slideUp('200', function() {});
                    }
                });
            });

            scope.onScroll = function () {
                let h = scope.window.scrollTop();
                let dir = h > scope.lastPos ? -1 : 1;

                scope.lastPos = h;

                if (dir === -1) {
                    if (h > appService.titleHeight + appService.navigationHeight - 222) {
                        if (!scope.showLogo) {
                            scope.showLogo = true;
                            scope.element.find('#logo').fadeTo(100, 1);
                        }

                        if (h > appService.titleHeight + appService.navigationHeight) {
                            scope.element.find('.navbar').addClass('shadow');
                        }
                    }
                }
                else {
                        scope.element.find('.navbar').removeClass('shadow');

                    if (scope.showLogo && h < appService.titleHeight + appService.navigationHeight) {
                        scope.showLogo = false;
                        scope.element.find('#logo').fadeTo('slow', 0);
                    }
                }
            };

            if (scope.showLogo)
                scope.element.find('#logo').css('opacity', '1');
            else {
                scope.lastPos = 0;
                scope.window.on('scroll', scope.onScroll);
                /*
                scope.window.bind('scroll', function () {
                    scope.onScroll();
                });
                */
            }

            scope.toHomePage = function () {
                return $state.href('app.donations.dashboard', {}, {reload: true});
            }

            scope.userProfile = function() {
                if (!scope.userData)
                    return "";

                return $state.href('app.user', {id: scope.userData.id});
            }

            scope.newDonation = function () {
                if (!scope.userData)
                    return;

                postServices.NewDonation();
                $rootScope.$emit('addToHistory');
            };
            
            scope.$on('$destroy', function() {
                scope.window.off('scroll', scope.onScroll);
                scope.window.off('resize');
            });

            scope.showMenu = false;
            scope.toggleHover = function(){
                scope.showMenu = !scope.showMenu;

                if (scope.showMenu)
                    $('#bs-example-navbar-collapse-12').slideDown('200', function() {})
                else
                    $('#bs-example-navbar-collapse-12').slideUp('200', function() {})
    
            };






            scope.smallWidth = false;
            scope.window.on('resize', function() {
                scope.checkForIPad();
            })

            scope.checkForIPad = function () {
                let check = scope.window.width() <= 760;
                if (!scope.smallWidth && check)
                    angular.element("#botonOfrecer").css({'float': 'none'})
                else if (scope.smallWidth && !check)
                    angular.element("#botonOfrecer").css({'float': 'left'})

                scope.smallWidth = check;
            }
            scope.checkForIPad();


            scope.$on('$destroy', function() {
                scope.window.off('scroll', scope.onScroll);
                scope.window.off('resize');
            });


        }

        return {
            restrict: 'E',
            templateUrl: "app/layouts/navigationBar/loggedIn/navBarYes.template.html",
            controller: 'navBarYesController',
            link: link
        };
    }
]);
