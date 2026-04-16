'use strict';

angular.module('footer')
.controller('tuyoFooterController', [ '$scope',
    function ($scope) {
        $scope.login = function(e){
            $scope.$emit('footerDecideLogIn');
        }
    }
]);
