'use strict';

angular.module('TuyoTools')
  .directive('dashboardDonations', [function () {
    return {
      templateUrl: 'app/views/directives/dashboard_donations.template.html',
      restrict: 'E',
      scope: {
        'donations': '=?',
        'userData': '=?',
      },
      link: function postLink() {
      }
    };
  }]);
