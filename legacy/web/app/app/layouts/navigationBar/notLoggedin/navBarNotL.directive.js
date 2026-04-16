'use strict'

angular.module('navigationBar')
.directive('navBarNo', ['$state', 'appService', '$timeout',
    function($state, appService, $timeout) {

        const link = function (scope, element, attr) {
            scope.rulesPath = $state.href('app.reglamento');
            scope.projectPath = $state.href('app.proyecto');
            scope.homePage = $state.href('app.donations.dashboard', {}, {reload: true});

            scope.adminMail = appService.adminMail;

            scope.landingPage = $state.href('app.landing');
            scope.onLanding = $state.current.name === 'app.landing';

            scope.login = function () {
                scope.$emit('navBarLogin');
            };

            scope.navigateAndOpenModal = function(modalType) {
                if (!scope.onLanding) {
                    // If not on the landing page, navigate there first
                    $state.go('app.landing').then(function() {
                        // Use $timeout to ensure the navigation is complete before opening the modal
                        $timeout(function() {
                            openModal(modalType);
                        });
                    });
                } else {
                    // If already on the landing page, just open the modal
                    openModal(modalType);
                }
            };

            function openModal(modalType) {
                if (modalType === 'register') {
                    $('#registrarse-tuyo0').modal('show');
                } else if (modalType === 'login') {
                    $('#iniciar-sesion').modal('show');
                }
            }

            $(document).ready(function () {
                $(document).click(function (e) {
                    let clickover = $(e.target);
                    let opened = element.find(".navbar-collapse").hasClass("in");

                    if (opened && clickover.parents('.navbar').length === 0) {
                        element.find("button.navbar-toggle").click();
                    }
                });
            });

            scope.showMenu = false;
            scope.toggleHover = function(){
                scope.showMenu = !scope.showMenu;

                if (scope.showMenu)
                    $('#bs-example-navbar-collapse-12').slideDown('200', function() {})
                else
                    $('#bs-example-navbar-collapse-12').slideUp('200', function() {})
            };
        }

        return {
            restrict: 'E',
            templateUrl: "app/layouts/navigationBar/notLoggedin/navBarNotL.template.html",
            controller: 'navBarNoController',
            link: link
        }
    }
]);