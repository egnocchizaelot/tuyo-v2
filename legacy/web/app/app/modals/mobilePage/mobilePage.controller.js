'use strict'

angular.module('modal')
.controller('mobilePageController', ['$scope', '$stateParams', '$state',
    function ($scope, $stateParams, $state) {

        $scope.cases = {CREATE_DONATION: 1, CREATE_APPRECIATION: 2, FORUM: 3, CHAT: 4, CALIFICATION: 5, APPRECIATION_FORUM: 6, NOTIFICATIONS: 7}

        $scope.close = $stateParams.close;

        $scope.data = $stateParams.data;
        $scope.case = $stateParams.case;

        if ($scope.case === -1)
        	$state.go('app.donations.dashboard');
    }
]);
