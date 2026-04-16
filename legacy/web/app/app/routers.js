'use strict';

angular.module('TuyoTools')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
                return $injector.get('AuthInterceptor');
      }
    ])
    $stateProvider
        .state('app', {
            abstract: true,
            controller: 'SiteController',
            templateUrl: 'app/views/site.template.html',
            url: '/'
        })
        .state('app.landing', {
            controller: 'landingController',
            data: {
                requireLogin: false
            },
            templateUrl: 'app/pages/landing/landing.template.html',
            url: 'landing?uidb64&token&scope',
            params: {
              banned: false,
              disabled: false,
              fullName: '',
              uidb64: null,
              token: null,
              scope: null
            }
        })
        .state('app.proyecto', {
            controller: 'proyectoController',
            templateUrl: 'app/pages/staticPages/proyecto/proyecto.template.html',
            url:'elproyecto',
            data: {
                requireLogin: false
            }
        })
        .state('app.reglamento', {
            controller: 'reglamentoController',
            templateUrl: 'app/pages/staticPages/reglamento/reglamento.template.html',
            url:'reglamento',
            data: {
                requireLogin: false
            }
        })
        .state('app.colaboradores', {
            controller: 'colaboradoresController',
            templateUrl: 'app/pages/staticPages/colaboradores/colaboradores.template.html',
            url:'colaboradores',
            data: {
                requireLogin: false
            }
        })
        .state('app.terycon', {
            controller: 'terminosController',
            templateUrl: 'app/pages/staticPages/terminos_y_condiciones/terycon.template.html',
            url:'terminosycondiciones',
            data: {
                requireLogin: false
            }
        })
        .state('app.artprohibidos', {
            controller: 'artprohibidosController',
            templateUrl: 'app/pages/staticPages/art_prohibidos/artprohibidos.template.html',
            url:'artprohibidos',
            data: {
                requireLogin: false
            }
        })
        .state('app.troubleshooting', {
            controller: 'troubleshootingController',
            templateUrl: 'app/pages/staticPages/troubleshooting/troubleshooting.template.html',
            url:'troubleshooting',
            data: {
                requireLogin: false
            }
        })
        .state('app.wrongEmailLink', {
            controller: 'wrongEmailController',
            templateUrl: 'app/pages/staticPages/wrongEmailLink/wrongEmailLink.template.html',
            url:'wrongEmailLink',
            data: {
                requireLogin: false
            }
        })
        .state('app.confirmationSuccess', {
            controller: 'confirmationSuccessController',
            templateUrl: 'app/pages/staticPages/confirmationSuccess/confirmationSuccess.template.html',
            url:'confirmationSuccess',
            data: {
                requireLogin: false
            }
        })
        .state('app.map', {
            controller: 'mapPageController',
            templateUrl: 'app/map/mapPage/mapPage.template.html',
            url: 'location/:lat/:lon',
            params: {
                lat: { value: 'none', squash: false },
                lng: { value: 'none', squash: false },
                accept: {value: 'none', squash: false},
                cancel: {value: 'none', squash: false},
                delete: {value: 'none', squash: false},
                description: {value: 'none', squash: false},
                filterLocation: { value: false, squash: false }
            }
        })
        .state('app.mobileModal', {
            controller: 'mobilePageController',
            templateUrl: 'app/modals/mobilePage/mobilePage.template.html',
            url: 'mobilePage',
            params: {
                data: { value: {}, squash: false },
                close: { value: {}, squash: false },
                case: {value: -1, squash: false }
            }
        })

        .state('app.donations', {
            abstract: true,
            controller: 'DonationsLayout',
            templateUrl: 'app/views/layouts/donations.template.html',
            url: ''
        })

        .state('app.donation', {
            controller: 'lonelyDonationController',
            templateUrl: 'app/post/lonelyDonation/lonely.template.html',
            url: 'donation/:donationId',
            data: {
                requireLogin: false
            },
            params: {
                donationId: {value: 'id', squash: false},
                entityId: 0,
                modalType: 'none',
                openChat: false
            }
        })
        .state('app.notification', {
            controller: 'lonelyNotificationController',
            templateUrl: 'app/notifications/lonelyNotification/lonelyNotification.template.html',
            url: 'notification/:id',
            params: {
                id: { value: 'id', squash: false }
            }
        })
        .state('app.donations.dashboard', {
            controller: 'dashboardControllerDesktop',
            templateUrl: 'app/pages/dashboard/desktop/dashboard.template.html',
            url: 'dashboard?filter_by&location&search',
            params: {
                filters: { value: 'none', squash: false },
                donationId: {value: -1, squash: false}
            }
        })
        .state('app.new_donation', {
            templateUrl: 'app/pages/creation/creationPage.html',
            url: 'new_donation'
        })
        .state('app.help', {
            templateUrl: 'app/help/help.template.html',
            controller: 'helpController',
            url: 'help?s&t',
            params: {
                s: { value: 'faq', squash: false },
                t: { value: '-1', squash: false },
                topic: { value: 'none', squash: false }
            }
        })


        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get("$state");
            var auth = $injector.get('Auth');
            // if (auth.userData && auth.userData.is_superuser) {
            //     $state.go("app.donations.admin_dashboard");
            // } else {
                $state.go("app.donations.dashboard");
            // }
        });
  }]);
