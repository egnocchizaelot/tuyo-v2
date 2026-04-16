'use strict';

angular.module('TuyoTools')
  .controller('DonationDetailsPage', [
    '$scope',
    '$http',
    '$state',
    '$stateParams',
    '$cookies',
    '$document',
    '$window',
    'API',
    'FileUploader',
  function (
    $scope,
    $http,
    $state,
    $stateParams,
    $cookies,
    $document,
    $window,
    API,
    FileUploader
  ) {

    // API.donation_details($stateParams.donationId)
    //   .then(function(data){
    //       $scope.$emit('changeSection', ['datos_donacion']);
    //       $scope.donation = data;
    //   }, function(){
    //     $scope.SiteController.showError('Error al obtener datos de la donacion');
    //   });

  }]);
