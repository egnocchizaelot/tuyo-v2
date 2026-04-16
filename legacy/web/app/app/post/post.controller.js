'use strict';

angular.module('post')
.controller('postController', ['$scope', '$timeout', 'appService',
    function ($scope, $timeout, appService) {

        $scope.visibleDonations = [];
        $scope.donationsDone = true;
        $scope.showingDonations = [];
        $scope.donations = {};

        $scope.filter = undefined;

        $scope.$on('firstDonations', function(smth, donations) {
            $scope.visibleDonations = [];
            $scope.showingDonations = [];
            $scope.donations = {};

            $scope.donationsDone = false;
            $scope.addDonations(donations);
            $timeout(function() { $scope.donationsDone = true; });
        });

        $scope.$on('nextDonations', function(smth, donations) {

            $scope.donationsDone = false;
            $scope.addDonations(donations);
            $scope.donationsDone = true;
        });

        $scope.noMoreDonations = true;
        $scope.addDonations = function (donations) {
            if (!donations || donations.length <= 0) {
                $scope.noMoreDonations = true;

                $scope.$emit('lastDonation', -1, -1);
                return;
            }

            $scope.noMoreDonations = false;

            if (donations.length < appService.donationsPagination) {
                $scope.noMoreDonations = true;
            }


            if (donations[0].donation || donations[0].notice) {
                for (var i = 0; i < donations.length; i++) {

                    if (donations[i].donation) {
                        var d = donations[i].donation;
                        d.trackId = d.id + "_d";
                        if (!$scope.donations[d.trackId]) {
                            var q = $scope.showingDonations.push(d);
                            $scope.donations[d.trackId] = q - 1;
                        }
                    }
                    else {
                        var n = donations[i].notice;
                        n.trackId = n.id + "_n";
                        if (!$scope.donations[n.trackId]) {
                            n.notice = true;
                            var r = $scope.showingDonations.push(n);
                            $scope.donations[n.trackId] = r - 1;
                        }
                    }
                }
            }
            else {
                for (var j = 0; j < donations.length; j++) {
                    var dd = donations[j];
                    dd.trackId = dd.id + "_d";

                    if ($scope.donations[dd.trackId]) {
                        continue;
                    }

                    var qq = $scope.showingDonations.push(dd);
                    $scope.donations[dd.trackId] = qq - 1;
                }
            }

            var date =  $scope.showingDonations[$scope.showingDonations.length - 1].notice ?
                        $scope.showingDonations[$scope.showingDonations.length - 1].created :
                        $scope.showingDonations[$scope.showingDonations.length - 1].date_updated;

            var likes = $scope.showingDonations[$scope.showingDonations.length - 1].count_likes;

            $scope.$emit('lastDonation', date, likes);
        };


        /*  --  PREVIOUS DONATAIONS  --  */
        // This is when someone scrolls top
        $scope.$on('prevDonations', function(smth, donations) {
            $scope.donationsDone = false;
            $scope.addDonationsOnTop(donations);
            $scope.donationsDone = true;
        });

        $scope.addDonationsOnTop = function (donations) {
            if (!donations || donations.length <= 0) {

                $scope.$emit('topDonations', -1);
                return;
            }

            if (donations[0].donation || donations[0].notice) {

                for (var i = donations.length-1; i >= 0; i--) {

                    if (donations[i].donation) {
                        var d = donations[i].donation;
                        d.trackId = d.id + "_d";
                        if (typeof $scope.donations[d.trackId] === "undefined") {
                            $scope.showingDonations.unshift(d);

                            for (var key in $scope.donations) {
                                $scope.donations[key] = $scope.donations[key] + 1;
                            }

                            $scope.donations[d.trackId] = 0;
                        }
                    }
                    else {
                        var n = donations[i].notice;
                        n.trackId = n.id + "_n";
                        if (typeof $scope.donations[n.trackId] === "undefined") {
                            n.notice = true;
                            $scope.showingDonations.unshift(n);


                            for (var nkey in $scope.donations) {
                                $scope.donations[nkey] = $scope.donations[nkey] + 1;
                            }

                            $scope.donations[n.trackId] = 0;
                        }
                    }
                }
            }
            else {
                for (var j = donations.length - 1; j >= 0; j--) {
                    var dd = donations[j];
                    dd.trackId = dd.id + "_d";

                    if (typeof $scope.donations[dd.trackId] === "number") {
                        continue;
                    }


                    $scope.showingDonations.unshift(dd);

                    for (var dkey in $scope.donations) {
                        $scope.donations[dkey] = $scope.donations[dkey] + 1;
                    }

                    $scope.donations[dd.trackId] = 0;
                }
            }

            var date =  $scope.showingDonations[0].notice ?
                        $scope.showingDonations[0].created :
                        $scope.showingDonations[0].date_updated;


            var likes = $scope.showingDonations[0].count_likes;
            $scope.$emit('topDonations', date, likes);
        };

        $scope.$on('setNotices', function(e, notices) {
            $scope.noticesLoaded = true;
            $scope.notices = notices;
            // $timeout(function()
            // {
            //     GetAllVideos();
            //     $timeout(function() { GetAllVideos(); }, 2000);
            // });
        });

        $scope.showNotices = true;
        $scope.$on('showImportantNotices', function(e, show) {
            $scope.showNotices = show;
        });

    }
]);
