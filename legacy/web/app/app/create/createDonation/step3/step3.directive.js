'use strict'

angular.module('creation').
directive('stepThree', ['Auth', 'API', 'growl',
    function (Auth, API, growl) {

        let scope = {
        }

        const link = function (scope, element, attr) {

            let height = element.parent().find('#creationNavBar').outerHeight()
            element.css('padding-top', height + 'px');
            element.css('display', 'block');

            scope.width = element.parent().width();
            scope.height = element.parent().height() - 165;

            scope.user = Auth.userData;
            for (var i = 0; i < scope.user.addresses.length; i++)
                scope.user.addresses[i].active = false;


            scope.activeLocations = [];
            scope.change = function(index) {
                scope.activeLocations[index] = !scope.activeLocations[index];
            }

            scope.addLocation = function () {
                scope.$emit('hideNext');
                scope.newLocation = true;
            }

            // region  -- CALLBACK FUNCTIONS FOR MAP  --
            scope.acceptNewLocation = function (address) {
                API.createAddress(address).then(
                    function (result) {

                        if (!scope.user.addresses)
                            scope.user.addresses = [];

                        result.active = true;
                        scope.user.addresses.push(result);
                        scope.activeLocations[scope.user.addresses.indexOf(result)] = true;
                        // scope.change(scope.user.addresses.length - 1);

                        Auth.changeData({addresses: scope.user.addresses});

                        growl.success('Se ha agregado una nueva ubicación.');
                    },
                    function (e) {
                        growl.error(e);
                    }
                );

                scope.$emit('showNext');

                scope.newLocation = false;
            }

            scope.cancelNewLocation = function () {
                scope.newLocation = false;
                scope.$emit('showNext');
            }
            // endregion

            scope.$on('sendData', () => {

                let addresses = [];
                let locations = [];
                for (let i = 0; i < scope.activeLocations.length; i++) {
                    if (scope.activeLocations[i]) {

                        addresses.push({ address: scope.user.addresses[i] });

                        let data = { 'user_address': scope.user.addresses[i].id };
                        if (scope.editing)
                            data.is_new = true;

                        locations.push(data);
                    }
                }

                let toRemove = [];
                if (scope.editing) {
                    for (let i = 0; i < scope.oldAddresses.length; i++) {

                        let q = _.findIndex(locations, {user_address: scope.oldAddresses[i].userAddress});
                        if (q !== -1)
                            locations.splice(q, 1);
                        else
                            toRemove.push({is_deleted: true, id: scope.oldAddresses[i].donationAddress });

                    }
                }

                let ret = {
                    step: 3,
                    locations: locations,
                    toRemove: toRemove,
                    addresses: addresses
                };

                scope.$emit('dataSent', ret);
            });


            /*  EDITING  */
            scope.$on('editingDonation', function (smth, donation) {
                scope.oldAddresses = [];

                let addresses = donation.addresses;

                for (let a = 0; a <  scope.user.addresses.length; a++) {
                    let address = scope.user.addresses[a];
                    let i = _.find(addresses, function(q) { return q.address.id === address.id});
                    if (i) {
                        scope.activeLocations[a] = true;
                        scope.user.addresses[a].active = true;
                        scope.oldAddresses.push({ userAddress: i.address.id, donationAddress: i.id })
                    }
                }

                scope.editing = true;
            });

            scope.$emit('readyToGo', {step: 3, callback: function () {
                for (let i = 0; i < scope.activeLocations.length; i++)
                    if (scope.activeLocations[i])
                        return true;

                return false;
            }});

        }

        return {
            restrict: 'E',
            templateUrl: 'app/create/createDonation/step3/step3.template.html',
            controller: 'stepThreeController',
            link: link,
            scope: scope
        }
    }
]);
