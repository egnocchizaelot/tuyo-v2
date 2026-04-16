'use strict'

angular.module('user').
controller('userProfileController', ['$scope', '$stateParams', 'Auth',
    function ($scope, $stateParams, Auth) {

        $scope.private = false;
        $scope.userId = $stateParams.id;

        let id = $stateParams.id;
        if (id === 'user' || id === Auth.userData.id+'')
            $scope.private = true;
    }
]);
