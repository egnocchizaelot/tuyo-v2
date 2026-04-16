'use strict'

angular.module('staticPagesModule')
.controller('confirmationSuccessController', ['$scope', '$timeout', 'Auth',
    function ($scope, $timeout, Auth) {
        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        if (Auth.userData)
            $scope.id = Auth.userData.id;

        $timeout(function() {
            clickBlock.remove();
        }, 700);
    }
]);
