'use strict'

angular.module('staticPagesModule')
.controller('artprohibidosController', ['$scope', 'Auth', '$state', 'appService', '$timeout',
    function ($scope, Auth, $state, appService, $timeout) {
        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
        	clickBlock.remove();
        }, 700);
    }
]);
