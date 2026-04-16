'use strict';
var facebookIsLoaded = false
angular.module('TuyoTools')
  .factory('AuthInterceptor',['$rootScope', '$q', '$location',
  function ($rootScope, $q, $location, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        if(response.status === 401){
          $location.path('/landing');
        }
        return $q.reject(response);
      }
    };
  }])
  .factory("Confirm", function ($window, $q, $timeout) {
      // Define promise-based confirm() method.
      function confirm(message) {
          var defer = $q.defer();
          $timeout(function () {
              if ($window.confirm(message)) {
                  defer.resolve(true);
              }
              else {
                  defer.reject(false);
              }
          }, 0, false);
          return defer.promise;
      }
      return confirm;
  })
  .config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
    growlProvider.globalDisableCountDown(true);
  }])
  // .config(function($facebookProvider){
  //
  //   $facebookProvider.setAppId(FACEBOOK_APP_ID);
  //
  //   $facebookProvider.setCustomInit({
  //       version: 'v2.8'
  //   });
  //
  //   $facebookProvider.setPermissions('email');
  // })
  .run(['$rootScope', '$state', 'Auth', '$modalStack', '$window', '$location',
    function($rootScope, $state, Auth, $modalStack, $window, $location){

        var fbParams = {
            appId: FACEBOOK_APP_ID,
            cookie: true,
            status: true,
            autoLogAppEvents : true,
            xfbml            : true,
            version: 'v3.1'
        }

        $window.fbAsyncInit = function() {
          FB.init(fbParams);
          facebookIsLoaded = true;
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            js = d.createElement(s); js.id = id; js.async = true;
            js.src = "https://connect.facebook.net/es_LA/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');


    (function(){
        // If we've already installed the SDK, we're done
        if (document.getElementById('facebook-jssdk')) {return;}

        // Get the first script element, which we'll use to find the parent node
        var firstScriptElement = document.getElementsByTagName('script')[0];

        // Create a new script element and set its id
        var facebookJS = document.createElement('script');
        facebookJS.id = 'facebook-jssdk';

        // Set the new script's source to the source of the Facebook JS SDK
        // facebookJS.src = '//connect.facebook.net/en_US/sdk.js';
        facebookJS.src = '//connect.facebook.net/es_LA/sdk.js';

        // Insert the Facebook JS SDK into the DOM
        firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }());

    Auth.loadUserData();

    if (window.history && window.history.pushState) {
      window.historyState = { index: 0 };
      $rootScope.stackPosition = 0;
      window.history.pushState(window.historyState, document.title, location.href);
      $rootScope.stackPosition++;
      window.onpopstate = function(event) {
        var top = $modalStack.getTop();
        if (top) {
          event.preventDefault();
          $modalStack.dismiss(top.key);
          window.history.scrollRestoration = 'manual';
        }
      };
    }

    $rootScope.$on('addToHistory', function () {
      $rootScope.stackPosition++;
      $window.historyState++;
      $window.history.pushState(window.historyState, document.title, location.href);
    });

    $rootScope.$on('$locationChangeSuccess', function() {
      $rootScope.actualLocation = $location.path();
    });

    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
      if($rootScope.actualLocation === newLocation) {
        var back,
            popHistoryState = $window.history.state;
        back = !!(popHistoryState && popHistoryState.index <= $rootScope.stackPosition);
        if (back) {
          $rootScope.stackPosition--;
          $window.historyState--;
        } else {
          $rootScope.stackPosition++;
          $window.historyState++;
          $window.history.pushState(window.historyState, document.title, location.href);
        }
      } else {

      }
    });


    $rootScope.$on('$stateChangeStart', function (event, next) {
        var requireLogin = true;
        if(next.data && next.data.requireLogin===false){
            requireLogin = false;
        }

        if(requireLogin && !Auth.checkLogin()){
            event.preventDefault();
            $state.go('app.landing');
            return;
        } else {

            if (Auth.userData && Auth.checkLogin()) {
                if (Auth.userData.reg_comp) {
                    if (next.name === 'app.landing') {
                        event.preventDefault();
                        $state.go('app.donations.dashboard');
                        return;
                    }
                }
                else {
                    Auth.logout();

                    if (next.name === 'app.terycon') {
                        event.preventDefault();
                        $state.go('app.terycon');
                        return;
                    }

                    event.preventDefault();
                    $state.go('app.landing');
                }
            }
        }
    });
  }])
  .run(['$http', '$cookies', function($http, $cookies){
    $http.defaults.xsrfCookieName = 'csrftoken';
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.withCredentials = true;
    $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');
    $http.defaults.headers.common.Authorization = $cookies.get('Authorization');
  }]);
