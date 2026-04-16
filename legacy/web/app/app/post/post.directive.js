/* global _ */
'use strict';

angular.module('post').
directive('posts', ['socketService', '$interval', 'appService', '$window',
    function (socketService, $interval, appService, $window) {

        var scope = {
        };

        var link = function (scope, element) {

            scope.element = element;
            scope.window = angular.element($window);

            scope.data = {text: 'Cargando donaciones'};

            scope.$on('deletedDonation', function(s, id) {
                var i = _.findIndex(scope.showingDonations, {id: id});
                scope.onView(i, false);
                scope.showingDonations.splice(i, 1);
                delete scope.donations[id];

                s.stopPropagation();
            });

            scope.onView = function(index, visible) {
                // $(window).trigger('resize');
                if (visible) {
                    if (scope.visibleDonations.indexOf(index) === -1) {
                        scope.visibleDonations.push(index);
                    }
                }
                else {
                    var i = scope.visibleDonations.indexOf(index);
                    if (i !== -1) {
                        var d = scope.visibleDonations.splice(i, 1)[0];
                        socketService.removeCallback(scope.showingDonations[d].id);
                    }
                }
            };

            // region  --  SOCKET.IO  --

            // TODO: Separar esto en dos. Cuando cambia la donación y cuando cambia la apreciación
            scope.donationCallback = function (index, data) {
                var id = '#post_' + index;
                var el = angular.element(id);
                if (!el) {
                    return;
                }

                el = el.scope().$$childHead;

                // region CHANCHADA
                //TODO: Sacar esto cuando sepamos bien por qué pasa y cómo solucionarlo
                var c = 50;
                while (!el.donation && el.$$childHead && c > 0) {
                    el = el.$$childHead;
                    c--;
                }

                if (c <= 0 || !el.donation){
                    console.log('Salió el error de nuevo');
                    return;
                }
                // endregion

                if (!el.donation.appreciation) {
                    if (el.donationChanged) {
                        el.donationChanged(data);
                    }
                }
                else {
                    if (el.appreciationChanged) {
                        el.appreciationChanged(data);
                    }
                }
            };

            scope.noticeCallback = function (index, data) {
                var id = '#post_' + index;
                var el = angular.element(id).scope().$$childHead;

                if (el.noticeChanged) {
                    el.noticeChanged(data);
                }
            };

            scope.callback = function (data) {
                for (var v = 0; v < scope.visibleDonations.length; v++) {
                    var index = scope.visibleDonations[v];
                    var id = scope.showingDonations[index].id;

                    if (id !== data.id) {
                        continue;
                    }

                    if (scope.showingDonations[index].notice) {
                        scope.noticeCallback(index, data);
                    } else {
                        scope.donationCallback(index, data);
                    }

                }
            };

            var promise = $interval(function () {

                for (var i = 0; i < scope.visibleDonations.length; i++) {
                    var idx = scope.visibleDonations[i];

                    if (scope.showingDonations[idx].showingForum) {
                        return;
                    }
                }

                for (var j = 0; j < scope.visibleDonations.length; j++) {

                    var index = scope.visibleDonations[j];

                    var id = scope.showingDonations[index].id;
                    var lastUpdate = scope.showingDonations[index].date_modified;

                    if (!scope.showingDonations[index].notice) {
                        socketService.donationChanged(id, lastUpdate, scope.callback);
                    } else {
                        socketService.donationChanged(id, lastUpdate, scope.callback, true);
                    }
                }
            }, appService.donationUpdateTime);


            scope.$on('$destroy', function() {
                if (promise) {
                    $interval.cancel(promise);
                }
            });
            // endregion
        };

        return {
            restrict: 'E',
            templateUrl: '/app/post/post.template.html',
            controller: 'postController',
            link: link,
            scope: scope
        };
    }
]);
