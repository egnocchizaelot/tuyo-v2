'use strict';

angular.module('TuyoTools')
  .controller('ProfileFormPage', [
    '$scope',
    '$filter',
    '$state',
    '$stateParams',
    '$cookies',
    '$document',
    '$timeout',
    '$modal',
    '$http',
    'API',
    'FileUploader',
    'Auth',
    function (
      $scope,
      $filter,
      $state,
      $stateParams,
      $cookies,
      $document,
      $timeout,
      $modal,
      $http,
      API,
      FileUploader,
      Auth
    ) {
      $scope.$emit('changeSection', ['perfil']);

      $scope.userFormData;
      $scope.APIURL = API.mediaURL;
      $scope.modify_user_data = false;
      $scope.finished_loading = false;

      $scope.clear = function () {
          angular.element("input[type='file']").val(null);
      };

      if(!Auth.userData.is_superuser){
        obtain_user_profile_data();
      }
      else{
        $scope.finished_loading = true;
      }

      //Uploader para foto de perfil
      $scope.profileUploader = new FileUploader({
        url: API.baseURL+'profile_picture_upload/0/',
        headers: {
          'Authorization': $cookies.get('Authorization')
        },
        formData: [],
        removeAfterUpload: true,
        queueLimit: 1
      });
      $scope.profileUploader.onSuccessItem = function(item, response, status, headers){
        $scope.SiteController.showSuccess('Foto de perfil modificada');
        $scope.modify_user.person.picture_url = response.picture_url;
        Auth.userData.person.picture_url = response.picture_url;
        $scope.user_data.systemUser.person.picture_url = response.picture_url;
        $scope.$emit('changeUserProfilePicture', response.picture_url);
      };
      $scope.profileUploader.onErrorItem = function(item, response, status, headers){
        $scope.SiteController.showError('Error al modificar foto de perfil');
        angular.element("input[type='file']").val(null);
      };
      //Fin uploader foto de perfil

      $scope.submitUserProfileChanges = function(modify_user){
        if(validateUser(modify_user)){
          API.user_profile_edit(modify_user)
          .then(function(data){
            if(data.length){
              $scope.SiteController.showError(data);
            }else{
              $scope.$emit('changeUserData', data);
              $scope.SiteController.showSuccess('Usuario modificado');
              $timeout(function() {
                $state.reload();
              }, 1000);
            }
          }, function(){
            $scope.SiteController.showError('Error al modificar perfil, vuelva a intentarlo más tarde.');
          });
        }else{
          $scope.SiteController.showError('Hay campos invalidos en los datos del Usuario, compruébelos por favor.');
        }
      };

      function validateUser(user){
        var isValid = false;
        if(user.person.first_name && user.person.last_name && user.person.cellphone && user.person.ci && user.person.birth_date){
          if(validateCi(user.person.ci)){
            if(user.systemUser.email){
              if(pw1.value!=''){
                var firstPassword = pw1.value;
                if(firstPassword == pw2.value){
                  isValid=true;
                  $scope.modify_user.systemUser.password = firstPassword;
                }
              }
              else{
                $scope.modify_user.systemUser.password = undefined;
                isValid=true;
              }
            }
          }
        }
        return isValid;
      }

      $scope.saveNotificationSettings = function(notifications, userId){
        API.save_notification_settings(notifications, userId)
          .then(function(data){
            if(data == "OK"){
              $scope.SiteController.showSuccess('Cambios de notificaciones guardados');
              obtain_user_profile_data();
            }
            else{
              $scope.SiteController.showError(data);
            }
          }, function(){
            $scope.SiteController.showError('Error al guardar cambios, vuelva a intentarlo más tarde.');
          });
      };

      $scope.saveNotificationSettingsRefined = function(notifications){
        API.save_notification_settings_refined(notifications)
          .then(function(data){
            if(data == "OK"){
              $scope.SiteController.showSuccess('Cambios de notificaciones individuales guardados');
              obtain_user_profile_data();
            }
            else{
              $scope.SiteController.showError(data);
            }
          }, function(){
            $scope.SiteController.showError('Error al guardar cambios, vuelva a intentarlo más tarde.');
          });
      };

      

      $scope.modifyUser = function(user){
        if($scope.modify_user_data){
          Auth.loadUserData();
        }
        $scope.modify_user_data = !$scope.modify_user_data;
        $scope.modify_user = {
            'id' : user.id,
            'username' : user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'picture_url': user.picture_url
        };
      };      

      function obtain_user_profile_data(){
        API.obtain_user_profile_data()
          .then(function(data){
            $scope.userData = {
              'user': data.user,
              'donations': data.donations,
              'appreciations': data.appreciations,
              //'rates': data.systemUser,
              //'notification_settings' : userData.notification_settings,
              'notifications' : data.notifications,
            };
            angular.forEach($scope.userData.notifications, function(value){
              if (value.read === false){
                $scope.SiteController.showInfo(value.text);
                value.read = true;
              }
            });
            $scope.finished_loading = true;
          }, function(){
            $scope.SiteController.showError('Error al obtener datos del usuario');
          });
      };

    }
  ])

  .directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }])

  .directive('checkUser', ['$state','$rootScope', '$location', 'Auth',
  function ($r, $location, Auth) {
    return {
      link: function (scope, elem, attrs, ctrl) {
        $r.$on('$routeChangeStart', function(e, curr, prev){
          if (!Auth.userData) {
            $state.reload();
            // reload the login route
          }
          /*
          * IMPORTANT:
          * It's not difficult to fool the previous control,
          * so it's really IMPORTANT to repeat server side
          * the same control before sending back reserved data.
          */
        });
      }
    }
  }]);

  function validateCi(ci){
    var isValid = false;
    var arrCoefs = [2,9,8,7,6,3,4,1];
    var suma = 0;
    var difCoef = parseInt(arrCoefs.length - ci.length);
    for (var i = ci.length - 1; i > -1; i--) {
      //Obtengo el digito correspondiente de la ci recibida
      var dig = ci.substring(i, i+1);
      //Lo tenía como caracter, lo transformo a int para poder operar
      var digInt = parseInt(dig);
      //Obtengo el coeficiente correspondiente al ésta posición del digito
      var coef = arrCoefs[i+difCoef];
      //Multiplico dígito por coeficiente y lo acumulo a la suma total
      suma = suma + digInt * coef;
    }
    if ( (suma % 10) == 0 ) {
      isValid = true;
    }
    return isValid;
  }