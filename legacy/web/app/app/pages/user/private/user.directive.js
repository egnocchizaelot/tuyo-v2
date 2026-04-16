'use strict'

angular.module('user').
directive('userPrivate', ['API', 'appService', '$state', '$timeout', '$window', 'Auth',
    function (API, appService, $state, $timeout, $window, Auth) {

        let scope = {
        }

        const link = function (scope, element, attr) {

            scope.window = angular.element($window);
            scope.mediaURL = API.mediaURL;

            scope.$state = $state;
            scope.thisURL = $state.current.name;


            let rank = Math.round(Auth.userData.ranking);
            scope.goldStars = () => { return Array.apply(0, new Array(rank)); }
            scope.greyStars = () => { return Array.apply(0, new Array( 5 - rank)); }

            API.getUserRanking().then(ranking => {

                if (typeof ranking === 'string' || ranking === Auth.userData.ranking)
                    return;

                Auth.changeData({ranking: ranking});

                let rank = Math.round(ranking);
                scope.goldStars = () => { return Array.apply(0, new Array(rank)); }
                scope.greyStars = () => { return Array.apply(0, new Array( 5 - rank)); }
            });

            if (!Auth.userData.email_confirmed) {
                API.getUserEmailConfirm().then(confirm => {
                    if (typeof confirm === 'string')
                        return;

                    if (confirm) {
                        Auth.changeData({ email_confirmed: true });
                        scope.$broadcast('email confirmed');
                    }
                })
            }

            API.getUserCounts(Auth.userData.id).then(counts => {
                scope.$broadcast('historyCounts', {delivered: counts.deliveries_count, received: counts.received_count, thanks: counts.thanks_count});
                scope.$broadcast('activityCounts', {offered: counts.offered_count, wanted: counts.wanted_count, reserved: counts.reserved_count});
            });

            /*  ACTIVITY */
            API.reservedDonations({page_size: 10}).then(donations => {
                scope.$broadcast('reservations', donations);
            });

            API.myDonations().then(donations => {
                scope.$broadcast('myDonations', donations);
            });

            API.wantedDonations().then(donations => {
                scope.$broadcast('wantedDonations', donations);
            });

            /*  HISTORY  */
            API.getDeliveredDonations(Auth.userData.id).then(donations => {
                scope.$broadcast('deliveredDonations', donations);
            });

            API.getReceivedDonations(Auth.userData.id).then(donations => {
                scope.$broadcast('givenDonations', donations);
            });

            API.getAppreciationDonations(Auth.userData.id).then(donations => {
                scope.$broadcast('appreciations', donations);
            });


            scope.changeState = function (state) {
                scope.active = state;
                scope.$broadcast('showIt');
            }


            scope.$on('reload', function (state) {
                scope.$state.go(scope.thisURL, {state: scope.state.PROFILE});
            })

            // region  -- LOAD ON SCROLL  --
            scope.OnScroll = function () {

                // if (scope.window.scrollTop() === $(document).height() - scope.window.height()) {
                if (scope.window.scrollTop() + scope.window.height() >= $(document).height() - 400) {

                    switch (scope.active) {

                        case scope.state.ACTIVITY:
                            scope.$broadcast('activityScrollLoad');
                        break;

                        case scope.state.HISTORY:
                            scope.$broadcast('historyScrollLoad');
                        break;
                    }
                }
            };

            scope.window.on('scroll', scope.OnScroll);
            scope.$on('$destroy', function() {
                scope.window.off('scroll', scope.OnScroll);
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'app/pages/user/private/user.template.html',
            controller: 'userPrivateController',
            link: link,
            scope: scope
        }
    }
]);
