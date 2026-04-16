'use strict'

angular.module('user')
.controller('userActivityController', ['$scope', 'appService',
    function ($scope, appService) {
        $scope.panel = {RESERVED: 1, OFFERED: 2, WANTED: 3};
        $scope.activePanel = $scope.panel.RESERVED;

        $scope.offeredCount = -1;
        $scope.wantedCount = -1;
        $scope.reservedCount = -1;

        $scope.$on('activityCounts', (s, counts) => {
            $scope.offeredCount = counts.offered;
            $scope.wantedCount = counts.wanted;
            $scope.reservedCount = counts.reserved;
        });

        $scope.$on('myDonations', (smth, donations) => {
            $scope.myDonations = donations.results;

            $scope.myDonationsPage = 1;
            $scope.myDonationsPages = donations.num_pages;

            $scope.myDonationsLoaded = true;
        });

        $scope.$on('wantedDonations', (smth, donations) => {
            $scope.wantedDonations = donations.results;

            $scope.wantedDonationsPage = 1;
            $scope.wantedDonationsPages = donations.num_pages;

            $scope.wantedDonationsLoaded = true;
        });

        $scope.$on('reservations', (smth, donations) => {

            let res = donations.results;
            $scope.reservations = [];
            for (let i = 0; i < res.length; i++) {
                let d = res[i];
                for (let q = 0; q < d.rates.length; q++) {
                    // let donation = Object.assign({}, d);
                    let donation = _.extend({}, d);
                    let rate = donation.rates[q];
                    delete donation.rates;
                    donation.rate = rate;
                    donation.rate_id = rate.id;

                    $scope.reservations.push(donation);
                }
            }

            // $scope.reservedCount = $scope.reservations.length;

            $scope.reservationsPage = 1;
            $scope.reservationsPages = donations.num_pages;

            $scope.reservatiosLoaded = true;
        });
    }
]);
