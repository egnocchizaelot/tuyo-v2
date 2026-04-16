'use strict'

angular.module('notifications')
.directive('notifications', ['API', 'appService', '$interval', 'socketService', '$timeout', '$state',
    function (API, appService, $interval, socketService, $timeout, $state) {

        const scope = {
        }

        const link = function (scope, element, attr) {

            scope.notifications = [];
            scope.page = 1;
            scope.pages = 1;

            scope.unread = 0;

            scope.isMobile = appService.isMobile;

            // region  --  SHOW & HIDE  --
            scope.show = false;
            scope.showNotifications = function () {
                if (appService.isMobile)
                    scope.showMobile();
                else {
                    if (scope.show)
                        scope.hideWeb();
                    else
                        scope.showWeb();
                }
            }

            scope.showMobile = function () {

                scope.readNotifications();

                let s = $state.$current.self.name
                let did = $state.$current.locals.globals.$stateParams.donationId

                $state.go('app.mobileModal', {
                    data: {
                        notifications: scope.notifications,
                    },
                    case: 7,
                    close: function (result) {
                        $state.go(s, {donationId: did});
                    }
                })
            }

            scope.showWeb = function () {
                scope.show = true;
                scope.readNotifications();
                element.find('.dropdown-menu').show();

            }

            scope.readNotifications = function () {
                API.notificationsRead().then( () => {

                    let unread = 0;
                    for (let i = 0; i < scope.notifications.length; i++) {
                        let notif = scope.notifications[i];
                        if (notif.type === "AdminNotification" && !notif.read)
                            unread++;
                    }

                    scope.unread = unread;
                });
            }

            // scope.$on('notificationRead', function (e, id) {
            //     for (let i = 0; i < scope.notifications.length; i++) {
            //         let notif = scope.notifications[i]
            //         if (notif.id != id)
            //             continue
            //
            //         notif.read = true
            //         if (notif.type === "AdminNotification")
            //             scope.unread--;
            //
            //         if (scope.unread < 0) scope.unread = 0
            //
            //         return
            //     }
            // })

            scope.hideWeb = function () {
                scope.show = false;
                element.find('.dropdown-menu').hide();
            }

            scope.$on('hideNotifications', function() {
                scope.hideWeb();
            })

            if (!appService.isMobile){
                $(window).bind('click', function (e) {

                    if (!scope.show)
                        return;

                    if (element.find(e.target).length > 0)
                        return;

                    scope.hideWeb();
                });
            }

            // angular.element(window.document).on('click', function (e) {
            //     if (!scope.show)
            //         return;
            //
            //     if (element.find(e.target).length > 0)
            //         return;
            //
            //     scope.hideWeb();
            //
            // })
            // endregion
            scope.loadNotifications = function () {
                API.notifications({page_size: appService.notificationsPageSize}).then(function (data) {

                    if (data.count === 0)
                        return;

                    let pages = Math.ceil(data.count / appService.notificationsPageSize);
                    scope.notifications = data.results;
                    scope.pages = pages;
                    scope.page = 1;

                    scope.notifications.map(n => { if (!n.read) scope.unread++; });

                    scope.newestNotification = scope.notifications[0].created;

                    scope.$broadcast('moreNotifications', scope.notifications);

                })
            }
            // endregion

            $timeout(function() {
                scope.loadNotifications()
            },1000)

            // region  --  AUTOMATIC UPDATES  --
            if (!scope.newNotifications)
                scope.newestNotification = (new Date()).toJSON();

            socketService.notificationCallback = function (notifications) {
                if (!notifications || notifications.length === 0)
                    return;

                scope.unread = scope.unread + notifications.length;

                for (let i = notifications.length - 1; i >= 0; i--) {

                    if (_.findIndex(scope.notifications, { id: notifications[i].id }) !== -1)
                        continue;

                    scope.notifications.unshift(notifications[i]);
                }

                scope.newestNotification = notifications[0].created;

                scope.$broadcast('moreNotifications', scope.notifications);
            };


            var promise = $interval(function () {
                socketService.newNotifications(scope.newestNotification);
            }, 3000);

            scope.$on('$destroy', function() {
                angular.element(window.document).off('click');

                if (promise)
                    $interval.cancel(promise);
            });
            // endregion

        }

        return {
            restrict: 'E',
            templateUrl: 'app/notifications/notifications.template.html',
            controller: 'notificationsController',
            link: link,
            scope: scope
        }
    }
]);
