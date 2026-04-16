'use strict';

angular.module('TuyoTools')
  .controller('DashboardPage', ['$scope', '$stateParams', '$q' ,'API', 'Auth', function ($scope, $stateParams, $q, API, Auth) {
    $scope.finish_loading = false;
    $scope.$emit('changeSection', ['dashboard']);
    $scope.acctual_section = 'dashboard';
    $scope.donations = [];
    $scope.appreciations = [];
    $scope.userData = Auth.userData;
      
    var one = API.donations().then(function(data){
      $scope.donations = data.results;
    }, function(){
      $scope.SiteController.showError('Error al cargar los datos.');
    });
    var two = API.appreciations().then(function(data){
      $scope.appreciations = data.results;
    }, function(){
      $scope.SiteController.showError('Error al cargar los datos.');
    });

    $q.all([one,two])
    .then(function(){
      $scope.finish_loading = true;
    });
  }]);
