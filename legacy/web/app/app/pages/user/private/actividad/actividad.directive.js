'use strict'

angular.module('user')
.directive('userActivity', ['$interval', 'socketService', 'appService', '$window', 'API',
    function ($interval, socketService, appService, $window, API) {

        let scope = {};

        const link = function (scope, element, attr) {
            scope.window = angular.element($window);

            scope.activatePanel = function (panel) {
                scope.activePanel = panel;
                scope.$broadcast('showIt');

                scope.visibleActives = [];
            }

            scope.changeActivePanel = function (state) {
                if (scope.activePanel === state)
                    return;

                for(let i = 0; i < scope.visibleActives.length; i++) {
                    let index = scope.visibleActives[i];

                    if (scope.activePanel === scope.panel.RESERVED) {
                        let r = scope.reservations[index];
                        if (r && r.rate.state !== "1")
                            continue;

                        socketService.removeCallback(r?.id);
                    }
                    else if (scope.activePanel === scope.panel.OFFERED) socketService.removeCallback(scope.myDonations[index].id);
                    else if (scope.activePanel === scope.panel.WANTED)  socketService.removeCallback(scope.wantedDonations[index].id);
                }

                scope.activePanel = state;
                scope.visibleActives = [];

                scope.$broadcast('showIt');
            }

            scope.$on('removeReserved', function(s, id) {
                scope.reservedCount--;
            });

            // region  --  UPDATE VISIBLE ONES  --
            scope.visibleActives = [];
            scope.onViewActivity = function (index, visible) {

                let i = scope.visibleActives.indexOf(index);
                if (visible) {
                    if (i === -1)
                        scope.visibleActives.push(index);
                }
                else {
                    if (i !== -1) {
                        let d = scope.visibleActives.splice(i, 1)[0];

                        if (scope.activePanel === scope.panel.RESERVED) {
                            let r = scope.reservations[index];
                            if (r && r.rate.state !== "1")
                                return;

                            socketService.removeCallback(r.id);
                        }
                        else if (scope.activePanel === scope.panel.OFFERED) socketService.removeCallback(scope.myDonations[d].id);
                        else if (scope.activePanel === scope.panel.WANTED)  socketService.removeCallback(scope.wantedDonations[d].id);

                    }
                }
            }

            var promise = $interval(function () {

                if (!scope.wantedDonationsLoaded || !scope.myDonationsLoaded)
                    return;


                if (scope.active !== scope.state.ACTIVITY)
                    return;

                for (let i = 0; i < scope.visibleActives.length; i++) {

                    let visible = scope.visibleActives[i];

                    let donation = undefined;
                    if (scope.activePanel === scope.panel.RESERVED) {
                        donation = scope.reservations[visible];
                        if (donation && donation.rate.state !== "1")
                            continue;
                     }
                    else if (scope.activePanel === scope.panel.OFFERED) donation = scope.myDonations[visible];
                    else if (scope.activePanel === scope.panel.WANTED)  donation = scope.wantedDonations[visible];

                    if (!donation) continue;

                    let id = donation.id;
                    let lastUpdate = donation.date_modified;

                    socketService.donationChanged(id, lastUpdate,
                        function (data) {

                            for (var v = 0; v < scope.visibleActives.length; v++) {

                                let index = scope.visibleActives[v];

                                let donation = undefined;
                                if (scope.activePanel === scope.panel.RESERVED) {
                                    donation = scope.reservations[index];
                                    if (donation && donation.rate.state !== "1")
                                        continue;
                                }
                                else if (scope.activePanel === scope.panel.OFFERED) donation = scope.myDonations[index];
                                else if (scope.activePanel === scope.panel.WANTED)  donation = scope.wantedDonations[index];

                                if (!donation) continue;

                                let id = donation.id;

                                if (id === data.id) {
                                    id = '#'+ scope.activePanel + '_' + index;
                                    let el = angular.element(id).scope().$$childHead;

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
            scope.activityReloading = false;
            scope.$on('activityScrollLoad', function () {
                if (scope.activityReloading)
                    return;

                switch (scope.activePanel) {
                    case scope.panel.RESERVED:

                        if (!scope.reservatiosLoaded)
                            return;

                        if(scope.reservationsPage >= scope.reservationsPages)
                            return;

                        scope.activityReloading = true;

                        API.reservedDonations({page: scope.reservationsPage + 1}).then(donations => {
                            scope.reservationsPage++;

                            let res = donations.results;
                            for (let i = 0; i < res.length; i++) {
                                let d = res[i];
                                for (let q = 0; q < d.rates.length; q++) {
                                    let donation = Object.assign({}, d);
                                    let rate = donation.rates[q];
                                    delete donation.rates;
                                    donation.rate = rate;
                                    donation.rate_id = rate.id;

                                    scope.reservations.push(donation);
                                }
                            }

                            scope.activityReloading = false;
                        });

                    break;

                    case scope.panel.OFFERED:

                        if (!scope.myDonationsLoaded)
                            return;

                        if(scope.myDonationsPage >= scope.myDonationsPages)
                            return;

                        scope.activityReloading = true;

                        API.myDonations({page: scope.myDonationsPage + 1}).then(donations => {
                            scope.myDonationsPage++;

                            for (let i = 0; i < donations.results.length; i ++)
                                if (!_.find(scope.myDonations, { id: donations.results[i].id }))
                                    scope.myDonations.push(donations.results[i]);

                            // scope.myDonations = scope.myDonations.concat(donations.results);

                            scope.activityReloading = false;
                        });

                        break;

                    case scope.panel.WANTED:

                        if (!scope.wantedDonationsLoaded)
                            return;

                        if(scope.wantedDonationsPage >= scope.wantedDonationsPages)
                            return;

                        scope.activityReloading = true;

                        API.wantedDonations({page: scope.wantedDonationsPage + 1}).then(donations => {
                            scope.wantedDonationsPage++;

                            for (let i = 0; i < donations.results.length; i ++)
                                if (!_.find(scope.wantedDonations, { id: donations.results[i].id }))
                                    scope.wantedDonations.push(donations.results[i]);

                            // scope.wantedDonations = scope.wantedDonations.concat(donations.results);

                            scope.activityReloading = false;
                        });
                        break;
                }
            });
            // endregion

        }

        return {
            restrict: 'E',
            templateUrl: 'app/pages/user/private/actividad/actividad.template.html',
            controller: 'userActivityController',
            link: link
        }
    }
]);
