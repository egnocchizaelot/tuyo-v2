'use strict';

angular.module('TuyoTools')
.controller('LoginPage', ['$scope', '$state', '$facebook', '$http', 'Auth', 'API', 'Facebook', '$cookies', '$localStorage',
    function ($scope, $state, $facebook, $http, Auth, API, Facebook, $cookies, $localStorage) {

        $scope.login_fb = function () {
            Facebook.login().then(function (response) {
                //we come here only if JS sdk login was successful so lets
                //make a request to our new view. I use Restangular, one can
                //use regular http request as well.
                var reqObj = {
                    "access_token": response.authResponse.accessToken,
                    "backend": "facebook"
                };

                $cookies.remove('Authorization');
                delete $localStorage.UserData;

                Auth.login(reqObj)
                    .then(function (data) {
                        // if (data.user.is_superuser) {
                        //     $state.go('app.donations.admin_dashboard', {}, {
                        //         reload: true
                        //     });
                        // } else {
                            $state.go('app.donations.dashboard', {}, {
                                reload: true
                            });
                        // }
                    }, function (e) {
                        $scope.SiteController.showError('Datos no válidos, compruebe su nombre de usuario y/o contraseña.');
                    });
            });
        }
  }]);
