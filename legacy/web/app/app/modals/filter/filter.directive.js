'use strict'

angular.module('modal').
directive('filterDonations', [
    function () {

        var scope = {}

        const link = function (scope, element, attr) {

        }

        return {
            restrict: 'E',
            templateUrl: 'app/modals/filter/filter.template.html',
            controller: 'filterDonationsController',
            link: link,
            scope: scope
        }
    }
]);
