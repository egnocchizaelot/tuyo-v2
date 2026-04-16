'use strict'

angular.module('user')
.controller('userHistoryController', ['$scope', 'appService',
    function ($scope, appService) {
        // ENTREGADAS y RECIBIDAS. Los nombre no están muy bien puestos.
        $scope.donationStates = {DELIVERED: 1, GIVEN: 2, THANKS: 3};
        $scope.historyPanel = $scope.donationStates.DELIVERED;

        $scope.deliveredCount = -1;
        $scope.receiveCount = -1;
        $scope.thanksCount = -1

        $scope.$on('historyCounts', (s, counts) => {
            $scope.deliveredCount = counts.delivered;
            $scope.receiveCount = counts.received;
            $scope.thanksCount = counts.thanks
        });

        $scope.$on('deliveredDonations', (smth, donations) => {
            $scope.deliveredDonations = donations.results;

            $scope.deliveredDonationsPage = 1;
            $scope.deliveredDonationsPages = donations.num_pages;

            $scope.deliveredDonationsLoaded = true
        });

        $scope.$on('givenDonations', (smth, donations) => {
            $scope.givenDonations = donations.results;

            $scope.givenDonationsPage = 1;
            $scope.givenDonationsPages = donations.num_pages;

            $scope.givenDonationsLoaded = true
        });

        $scope.$on('appreciations', (s, appreciations) => {
            $scope.appreciations = appreciations.results;

            $scope.appreciationsPage = 1;
            $scope.appreciationsPages = appreciations.num_pages;

            $scope.appreciationsLoaded = true;
        });

    }
]);
