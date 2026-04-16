'use strict'

angular.module('user').
controller('userPublicController', ['$scope', 'Auth', 'API', '$timeout',
    function ($scope, Auth, API, $timeout) {
        $scope.userData = Auth.userData;
        $scope.MEDIAURL = API.mediaURL;

        $scope.state = { HISTORY: 1, PROFILE: 2 };

        $scope.active = $scope.state.HISTORY;

        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
        	clickBlock.remove();
        }, 700);

    }
]);
