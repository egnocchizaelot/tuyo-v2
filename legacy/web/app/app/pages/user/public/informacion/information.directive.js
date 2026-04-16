'use strict'

angular.module('user')
.directive('publicInformation', ['moment', '$window',
    function (moment, $window) {

        let scope = {
            userData: '='
        }

        const link = function (scope, element, attr) {

            scope.joinDate = moment(scope.userData.date_joined.replace('T', ' ')).fromNow();

/*
            scope.addresses = [];

            for (let i = 0; i < scope.userData.addresses.length; i++) {
                let address = scope.userData.addresses[i];
                let a = '';

                if (address.district)
                    a += address.district

                if (address.city) {
                    if (a !== '')
                        a+= ', ';

                    a += address.city;
                }

                if (a !== '' && scope.addresses.indexOf(a) === -1)
                    scope.addresses.push(a);
            }
*/

            scope.openFacebook = function () {
                $window.open(scope.facebookLink, '_blank');
            }

        }

        return {
            restrict: 'E',
            templateUrl: 'app/pages/user/public/informacion/information.template.html',
            controller: 'publicInformationController',
            scope: scope,
            link: link
        }
    }
]);
