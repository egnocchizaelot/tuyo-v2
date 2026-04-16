'use strict'

angular.module('notifications')
.controller('notificationsDropdownController', ['$scope', 'appService',
    function ($scope, appService) {


    	if (appService.isMobile) {
    		angular.element('#titulo').css("font-size", "20px");
    		angular.element('#backArrow').css("font-size", "30px");
    		angular.element('#backArrow').css("padding-top", "2px");
    	}

    }
]);
