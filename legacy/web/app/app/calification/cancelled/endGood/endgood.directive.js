'use strict'

angular.module('calification')
.directive('endGoodCancel', [
    function () {
        var scope = {
            leftPath: '=',
            rightPath: '=',
            mine: '='
        }

        const link = function (scope, element, attr) {

            scope.text = scope.mine ? 'Tu ofrecimiento \nsigue disponible' : 'Ya no estás reservado \n en este ofrecimiento';

            scope.selectNewUser = function () {
                scope.$emit('close', {case: 'forum'})
            }

            scope.close = function () {
                scope.$emit('close', {case: 'close'})
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/calification/cancelled/endGood/endgood.template.html',
            controller: 'endGoodCancelController',
            link: link,
            scope: scope
        }
    }
])
