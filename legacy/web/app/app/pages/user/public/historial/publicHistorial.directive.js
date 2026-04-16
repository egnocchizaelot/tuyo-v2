'use strict'

angular.module('user')
.directive('userPublicHistory', ['API', '$window', 'socketService', '$interval', 'appService',
    function (API, $window, socketService, $interval, appService) {

        let scope = {
        }

        const link = function (scope, element, attr) {
            scope.window = angular.element($window);

            scope.changeHistoryPanel = function (state) {
                if (scope.historyPanel === state)
                    return;


                for(let i = 0; i < scope.visibleHistory.length; i++) {
                    let index = scope.visibleHistory[i];

                    if (scope.historyPanel === scope.donationStates.DELIVERED) socketService.removeCallback(scope.deliveredDonations[index]?.id);
                    else if (scope.historyPanel === scope.donationStates.GIVEN) socketService.removeCallback(scope.givenDonations[index]?.id);
                    else if (scope.historyPanel === scope.donationStates.THANKS) socketService.removeCallback(scope.appreciations[index]?.id);
                }
                scope.historyPanel = state;

                scope.visibleHistory = [];

                scope.$broadcast('showIt');
            }

            // region  --  UPDATE VISBLE ONES  --
            scope.visibleHistory = [];
            scope.onViewHistory = function (index, visible) {

                let i = scope.visibleHistory.indexOf(index);
                if (visible) {
                    if (i === -1)
                        scope.visibleHistory.push(index);
                }
                else {
                    if (i !== -1) {
                        let d = scope.visibleHistory.splice(i, 1)[0];

                        if (scope.historyPanel === scope.donationStates.DELIVERED) socketService.removeCallback(scope.deliveredDonations[d].id);
                        else if (scope.historyPanel === scope.donationStates.GIVEN) socketService.removeCallback(scope.givenDonations[d].id);
                        else if (scope.historyPanel === scope.donationStates.THANKS) socketService.removeCallback(scope.appreciations[d].id);

                    }
                }
            }


            var promise = $interval(function () {

                if (!scope.deliveredDonationsLoaded || !scope.givenDonationsLoaded || !scope.appreciationsLoaded)
                    return;


                if (scope.active !== scope.state.HISTORY)
                    return;

                for (let i = 0; i < scope.visibleHistory.length; i++) {

                    let visible = scope.visibleHistory[i];

                    let donation = undefined;
                    if (scope.historyPanel === scope.donationStates.DELIVERED) donation = scope.deliveredDonations[visible];
                    else if (scope.historyPanel === scope.donationStates.GIVEN) donation = scope.givenDonations[visible];
                    else if (scope.historyPanel === scope.donationStates.THANKS) donation = scope.appreciations[visible];

                    if (!donation) continue;

                    let id = donation.id;
                    let lastUpdate = donation.date_modified;

                    socketService.donationChanged(id, lastUpdate,
                        function (data) {

                            for (var v = 0; v < scope.visibleHistory.length; v++) {

                                let index = scope.visibleHistory[v];

                                let donation = undefined;
                                if (scope.historyPanel === scope.donationStates.DELIVERED) donation = scope.deliveredDonations[index];
                                else if (scope.historyPanel === scope.donationStates.GIVEN) donation = scope.givenDonations[index];
                                else if (scope.historyPanel === scope.donationStates.THANKS) donation = scope.appreciations[index];

                                if (!donation) continue;

                                let id = donation.id;

                                if (id === data.id) {
                                    id = '#'+ scope.historyPanel + '_' + index;
                                    let el = angular.element(id).scope().$$childHead;

                                    if (scope.historyPanel === scope.donationStates.THANKS)
                                        el.appreciationChanged(data);
                                    else
                                        el.donationChanged(data);

                                }

                            }
                        }
                    );
                }
            }, appService.donationUpdateTime);

            scope.$on('$destroy', function() {
                if (promise)
                    $interval.cancel(promise);
            })
            // endregion


            // region  -- LOAD ON SCROLL --

            //TODO: Hacer que quede bien esto. Que no sea código repetido por todas partes
            scope.historyReloading = false;
            scope.$on('historyScrollLoad', function () {
                if (scope.historyReloading)
                    return;

                switch (scope.historyPanel) {
                    case scope.donationStates.DELIVERED:

                        if (!scope.deliveredDonationsLoaded)
                            return;

                         if(scope.deliveredDonationsPage >= scope.deliveredDonationsPages)
                            return;

                        scope.historyReloading = true;

                        API.getDeliveredDonations(scope.userId, {page: scope.deliveredDonationsPage + 1}).then(donations => {
                            scope.deliveredDonationsPage++;

                            for (let i = 0; i < donations.results.length; i ++)
                                if (!_.find(scope.deliveredDonations, { id: donations.results[i].id }))
                                    scope.deliveredDonations.push(donations.results[i]);

                            // scope.deliveredDonations = scope.deliveredDonations.concat(donations.results);

                            scope.historyReloading = false;
                        });

                        break;

                    case scope.donationStates.GIVEN:

                        if (!scope.givenDonationsLoaded)
                            return;

                        if(scope.givenDonationsPage >= scope.givenDonationsPages)
                           return;

                       scope.historyReloading = true;

                        API.getReceivedDonations(scope.userId, {page: scope.givenDonationsPage + 1}).then(donations => {
                            scope.givenDonationsPage++;

                            for (let i = 0; i < donations.results.length; i ++)
                                if (!_.find(scope.givenDonations, { id: donations.results[i].id }))
                                    scope.givenDonations.push(donations.results[i]);

                            // scope.givenDonations = scope.givenDonations.concat(donations.results);

                            scope.historyReloading = false;
                        });

                        break;

                    case scope.donationStates.THANKS:

                        if (!scope.appreciationsLoaded)
                            return;

                        if(scope.appreciationsPage >= scope.appreciationsPages)
                           return;

                       scope.historyReloading = true;

                        API.getAppreciationDonations(scope.userId, {page: scope.appreciationsPage + 1}).then(appreciations => {
                            scope.appreciationsPage++;

                            for (let i = 0; i < appreciations.results.length; i ++)
                                if (!_.find(scope.appreciations, { id: appreciations.results[i].id }))
                                    scope.appreciations.push(appreciations.results[i]);

                            // scope.appreciations = scope.appreciations.concat(appreciations.results);

                            scope.historyReloading = false;
                        });
                        break;
                }
            });
            // endregion

        }

        return {
            restrict: 'E',
            templateUrl: 'app/pages/user/public/historial/publicHistorial.template.html',
            controller: 'userPublicHistoryController',
            link: link
        }
    }
]);
