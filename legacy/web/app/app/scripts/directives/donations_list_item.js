'use strict';

angular.module('TuyoTools')
  .directive('donationsListItem', ['$state', '$modal' , 'growl', 'API', function ($state, $modal, growl, API) {
    return {
      templateUrl: 'app/views/directives/donations_list_item.template.html.html',
      restrict: 'E',
      scope: {
        'donation': '=?',
      },
      link: function postLink(scope) {

        scope.MEDIAURL = API.mediaURL;
        scope.variables = {};
        scope.userData = scope.$root.userData;
        scope.signup_on_donation_step1 = function(donation){
          scope.signup_modal = $modal.open({
              animation: true,
              templateUrl: 'app/views/modals/signup_on_donation.template.html',
              scope: scope
          });
        };

        scope.signup_on_donation_step2 = function(donation){
          var data ={
            'donation_id':donation.id,
            'action': 'add',
            'forum_message' : donation.forum_message
          }
          API.donationApplicantsAcctions(data)
            .then(function(data){
              scope.donation = data;
              scope.signup_modal.close();
              $state.reload();
            }, function(){
              growl.error('Error al anotarse.')
            });
        };


        scope.add_like = function(donation){
          var data ={
            'entity_type':'D',
            'entity_id': donation.id
          }
          API.add_like(data)
            .then(function(data){
              donation.like = data;
              donation.count_likes +=1;
            }, function(){
              growl.error('Error al anotarse.')
            });
        };

        scope.remove_like = function(donation){
          API.remove_like(donation.like)
            .then(function(data){
              donation.like = undefined;
              donation.count_likes -= 1;
            }, function(){
              growl.error('Error al anotarse.')
            });
        };


        scope.donation_modal_view = function(){
          scope.donation_details_modal = $modal.open({
              //animation: true,
              templateUrl: 'app/views/modals/donation_details_modal.template.html',
              scope: scope
          });
        };

        scope.donation_modal_view = function(){
          scope.donation_details_modal = $modal.open({
              //animation: true,
              templateUrl: 'app//views/modals/donation_details_modal.template.html',
              scope: scope
          });
        };
      }
    };
  }]);
