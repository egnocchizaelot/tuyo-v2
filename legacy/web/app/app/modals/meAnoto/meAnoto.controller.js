'use strict'

angular.module('modal')
.controller('meAnotoController', ['$scope', 'pickupTime', 'close', '$element', 'appService',
    function ($scope, pickupTime, close, $element, appService) {
        $scope.pickupTime = pickupTime || appService.pickupDescription;

        this.closed = false;
        this.closeModal = function () { $scope.close(); this.closed = true; }

        $scope.close = function (result) {
            $element.modal('hide');
            $element.off('hidden.bs.modal');

            $('body').removeClass('modal-open');
            $('body').css('padding-right', '0px');

            close(result, 200);
        }
    }
]);
