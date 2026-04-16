'use strict'

angular.module('help')
.controller('siteHelpController', ['$scope', 'Auth', '$stateParams',
    function ($scope, Auth, $stateParams) {
        $scope.fullName = Auth.userData.full_name;
    }
]);
