'use strict';

angular.module('TuyoTools')
  .service('Auth', ['$rootScope', '$http', '$cookies', '$q', '$localStorage', 'API', '$state',
  function ($rootScope, $http, $cookies, $q, $localStorage, API, $state) {
    var AuthService = this;

    AuthService.userData = null;

    AuthService.current_section = null; //Para saber en que seccion estoy para abrir el header correspondiente al modulo.

    AuthService.loadUserData = function(){
      try{
        //AuthService.userData = JSON.parse($cookies.get('UserData'));
        AuthService.userData = JSON.parse($localStorage["UserData"]);
      }catch(e){}
    };

    $rootScope.$on('changeUserData', function (event, data) {
      $localStorage["UserData"] = JSON.stringify(data);
      AuthService.loadUserData();
    });

    $rootScope.$on('changeUserProfilePicture', function (event, data) {
      var userData = JSON.parse($localStorage["UserData"]);
      userData['person']['picture_url'] = data;
      $localStorage["UserData"] = JSON.stringify(userData);
    });

    AuthService.login = function(data){
      var deferred = $q.defer();
  
      AuthService.deleteLocalStorage();
  
      delete $http.defaults.headers.common['Cookie'];
  
      var loginPromise = data.backend === "tuyo" ? API.tuyoLogin(data.data) : API.login(data);
  
      loginPromise.then(function(data){
          if (data && !data.user)
              return;
  
          AuthService.userData = data.user;
          $cookies.put('Authorization','Token ' + data.token);
          $localStorage.$default({
              UserData: JSON.stringify(data.user)
          });
          $http.defaults.headers.common.Authorization = $cookies.get('Authorization');
          $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');
          deferred.resolve(data);
      }, function(){
          deferred.reject();
      });
      return deferred.promise;
    };
  
    AuthService.register = function(data){
        var deferred = $q.defer();
    
        API.tuyoRegister(data).then(function(response){
            if (response && response.token && response.user) {
                AuthService.userData = response.user;
                $cookies.put('Authorization','Token ' + response.token);
                $localStorage.$default({
                    UserData: JSON.stringify(response.user)
                });
                $http.defaults.headers.common.Authorization = $cookies.get('Authorization');
                $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');
                deferred.resolve(response);
            } else {
                deferred.reject('Invalid response from server');
            }
        }, function(error){
            deferred.reject(error);
        });
    
        return deferred.promise;
    };

    AuthService.logout = function(toLanding, landingParams){
      AuthService.userData = null;
      if(AuthService.checkLogin()){
        API.logout().then(
            function(data){
                $cookies.remove('Authorization');
                //$cookies.remove('UserData');
                AuthService.deleteLocalStorage();
                if (toLanding)
                    $state.go('app.landing', landingParams, {reload: true});
            },

            function(data){
                if(data == 'Invalid token'){
                  $cookies.remove('Authorization');
                  AuthService.deleteLocalStorage();
                  if(toLanding)
                      $state.go('app.landing', {}, {reload: true});
                }
            }
        );
      }
    };

    AuthService.deleteLocalStorage = function () {
      delete $localStorage["UserData"];
    }

    AuthService.checkLogin = function(){
        let auth = $cookies.get('Authorization') ? true : false;
        let regComp = this.userData && this.userData.reg_comp;

        return $cookies.get('Authorization') ? true : false;
    };

    AuthService.changeData = function(data) {
        var userData = JSON.parse($localStorage["UserData"]);

        for (let d in data)
            userData[d] = data[d];

        $localStorage["UserData"] = JSON.stringify(userData);
        AuthService.userData = userData;
    };


  }]);
