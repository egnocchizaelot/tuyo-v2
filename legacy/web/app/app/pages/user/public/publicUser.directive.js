'use strict'

angular.module('user').
directive('userPublic', ['API', "appService", '$timeout', '$window',
    function (API, appService, $timeout, $window) {

        let scope = {
            userId: '='
        }

        const link = function (scope, element, attr) {
            scope.window = angular.element($window);

            scope.mediaURL = API.mediaURL;
            scope.element = element;

            // scope.facebook = $facebook;
            API.getPublicUser(scope.userId).then( user => {


                if (typeof user === "string") {
                    scope.notFound = true;
                    return;
                }


                scope.userData = user

                scope.$broadcast('userId', user.id);
                scope.$broadcast('userData', user)

                let rank = Math.round(user.ranking);
                scope.goldStars = () => { return Array.apply(0, new Array(rank)); }
                scope.greyStars = () => { return Array.apply(0, new Array( 5 - rank)); }

                /*  INFORMATION  */
                // scope.facebook.api('/' + scope.userData.facebook_uid).then(
                //     function (response) {
                //         scope.$broadcast('facebookLink', response.id);
                //     },
                //     function (err) {
                //     }
                // );
                //
                // scope.facebook.api('/' + scope.userData.facebook_uid, {'fields': "context.fields(mutual_friends)"}).then(
                //     function (response) {
                //         scope.$broadcast('mutualFriends', response.context.mutual_friends);
                //     },
                //     function (err) {
                //     }
                // )

                API.getUserCounts(user.id).then(counts => {
                    scope.$broadcast('historyCounts', {delivered: counts.deliveries_count, received: counts.received_count, thanks: counts.thanks_count});
                });

                /*  HISTORY  */
                API.getDeliveredDonations(scope.userId).then(donations => {
                    scope.$broadcast('deliveredDonations', donations);
                });

                API.getReceivedDonations(scope.userId).then(donations => {
                    scope.$broadcast('givenDonations', donations);
                });

                API.getAppreciationDonations(scope.userId).then(donations => {
                    scope.$broadcast('appreciations', donations);
                });

                scope.userLoaded = true;
                // scope.correctNavBar()
            });


            // region  -- LOAD ON SCROLL  --
            scope.OnScroll = function () {
                // if (scope.window.scrollTop() === $(document).height() - scope.window.height()) {
                if (scope.window.scrollTop() + scope.window.height() >= $(document).height() - 400) {


                    switch (scope.active) {
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
            templateUrl: 'app/pages/user/public/publicUser.template.html',
            controller: 'userPublicController',
            link: link,
            scope: scope
        }
    }
]);
