'use strict';

angular.module('TuyoTools')
  .controller('SiteController', ['$scope', '$state', 'growl', 'Auth', function($scope, $state, growl, Auth){
    var SiteController = $scope.SiteController = this;

    SiteController.userData = Auth.userData;
    $scope.$watch(Auth.userData, function(newValue){
      SiteController.userData = newValue || Auth.userData;
    });

    SiteController.showError = function(message){
      growl.error(message);
    };

    SiteController.showSuccess = function(message){
      growl.success(message);
    };

    SiteController.showWarning = function(message){
      growl.warning(message);
    };

    SiteController.showInfo = function(message){
      growl.info(message);
    };

    // SiteController.logout = function(){
    //     $facebook.logout().then(function (success) {
    //         Auth.logout();
    //         $state.go('app.login');
    //     });
    // };

  }]);
