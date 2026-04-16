'use strict'

angular.module('calification')
.directive('endGoodConfirm', [
    function () {
        var scope = {
            leftPath: '=',
            rightPath: '=',
            creator: '='

        };

        const link = function (scope, element, attr) {
            scope.text = scope.creator ? 'Tu' : 'La';

            scope.addAppreciation = function () {
                scope.$emit('close', {case: 'appreciation'});
            }

            scope.close = function () {
                scope.$emit('close', {case: 'close'});
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/calification/confirm/endGood/endgood.template.html',
            controller: 'endGoodConfirmController',
            link: link,
            scope: scope
        }
    }
]);
