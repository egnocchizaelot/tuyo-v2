'use strict'

angular.module('notifications')
.directive('notificationsDropdown', ['appService', '$window', '$timeout', 'API',
    function (appService, $window, $timeout, API) {

        const scope = {
            notifications: '=',
            pages: '=',
            close: '&'
        };

        const link = function (scope, element, attr) {

            scope.isMobile = appService.isMobile;

            scope.page = 1;

        	if (scope.notifications && scope.notifications.length > 0)
        		scope.notificationsLoaded = true;

        	scope.$on('moreNotifications', function(smth, notif) {
        		scope.notifications = notif;
        		scope.notificationsLoaded = true;
        	});

            scope.showNotifications = function () {
            	if (!appService.isMobile)
            		scope.$emit('hideNotifications');
            	else
            		scope.close();
            }

            if (appService.isMobile) {
            	angular.element('#titulo').css({
            		'background-color': '#00c074',
				    'color': '#ffffff',
				    'line-height': '35px',
				    'text-align': 'center',
				    'margin': '-5px 0 0',
				    'padding': '10px'
            	});

            	$timeout(function() {
            		angular.element($window).scrollTop(0);
        		})

                angular.element($window).on('scroll', function () {

                    if (scope.loadingDoantions)
                        return;

                    if (angular.element($window).scrollTop() + angular.element($window).height() >= $(document).height() - 100)
                        scope.LoadOnScroll();
                });
            }

            if (!appService.isMobile) {
                angular.element("#theNotifications").on('mousewheel DOMMouseScroll', function (e) {

                    let e0 = e;
                    let delta = e0.originalEvent.wheelDelta || -e0.detail;

                    let lastScroll = this.scrollTop;
                    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                    e.preventDefault();


                    if (scope.loadingDoantions)
                        return;

                    if (this.scrollTop !== 0 && this.scrollTop === lastScroll) {
                        scope.LoadOnScroll();
                    }

                });
            }

            scope.$on('destroy', function() {
                angular.element('#theNotifications').off('mousewheel DOMMouseScroll');
               angular.element($window).off('scroll');
            })


            scope.LoadOnScroll = function () {
                if (scope.page >= scope.pages)
                    return;

                scope.page++;
                scope.loadingDoantions = true;

                API.notifications({page: scope.page, page_size: appService.notificationsPageSize}).then(function (data) {
                    scope.notifications = scope.notifications.concat(data.results);


                    scope.loadingDoantions = false;
                })

            }

        };

        return {
            restrict: 'E',
            templateUrl: 'app/notifications/notificationDropdown/notificationDropdown.template.html',
            controller: 'notificationsDropdownController',
            link: link,
            scope: scope
        }

    }
]);
