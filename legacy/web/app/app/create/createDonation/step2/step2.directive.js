'use strict'

angular.module('creation').
directive('stepTwo', [
    function () {

        let scope = {
        }

        const link = function (scope, element, attr) {

            scope.maxLength = 300;

            let height = element.parent().find('#creationNavBar').outerHeight()
            element.css('padding-top', `${height}px`);
            element.css('display', `block`);


            scope.$on('sendData', () => {
                let ret = {
                    step: 2,
                    pickupTime: scope.pickupTime,
                    only: scope.checkbox.only
                };
                scope.$emit('dataSent', ret);
            })

            /*  EDITING  */
            scope.$on('editingDonation', function (smth, donation) {
                scope.pickupTime = donation.pickup_description;
                scope.checkbox.only = donation.mandatory;
            });

            scope.$emit('readyToGo',  {step: 2, callback: function () {
                if (scope.pickupTime && scope.pickupTime.length > scope.maxLength)
                    return false;

                return true;
            }});

        }

        return {
            restrict: 'E',
            templateUrl: 'app/create/createDonation/step2/step2.template.html',
            controller: 'stepTwoController',
            link: link,
            scope: scope
        }
    }
]);
