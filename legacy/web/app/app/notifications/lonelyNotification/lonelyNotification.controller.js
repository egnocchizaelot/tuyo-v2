'use strict'

angular.module('notifications')
.controller('lonelyNotificationController', ['$scope', '$location', '$stateParams', 'API',
    function ($scope, $location, $stateParams, API) {

        API.getNotification($stateParams.id).then(
            function (data) {
            	if(data == 'Acceso no autorizado'){
            		$location.url(/dashboard/);
            	}else{
	                $scope.text = data.extended_text;
	                $scope.image = data.extended_file_url;

	                $scope.notificationLoaded = true;
	            }
            }
        );

    }
]);
