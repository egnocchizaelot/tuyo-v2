'use strict'

angular.module('user')
.directive('miCuenta', ['Auth', 'API', 'moment', 'growl', 'modalServices', '$state',
    function (Auth, API, moment, growl, modalServices, $state) {

        let scope = {
        }

        const link = function (scope, element, attr) {

            scope.maxLength = 200;

            scope.userData = Auth.userData;
            scope.element = element;

            scope.description = scope.userData.description;
            scope.descriptionEditing = false;

            scope.email = scope.userData.email;
            scope.emailEditing = false;

            scope.joinDate = moment(scope.userData.date_joined?.replace('T', ' ')).fromNow();

            scope.addresses = [];
            for (let i = 0; i < scope.userData.addresses?.length; i++) {
                let address = scope.userData.addresses[i];
                let a = '';

                if (address.district)
                    a += address.district

                if (address.city) {
                    if (a !== '') a+= ', ';

                    a += address.city;
                }

                if (a !== '')
                    scope.addresses.push(a);
            }

            // region  --  E-MAIL  --
            scope.editMail = function () {
                scope.emailEditing = !scope.emailEditing;
            }

            scope.changeEmail = function () {
                let email = scope.element.find('#email').val()
                if (email === scope.email)
                    scope.emailEditing = !scope.emailEditing
                else
                    scope.updateData({ email });
            }

            scope.resending = false;
            scope.refreshIndication = false;
            scope.resendConfirmation = function () {

                if (scope.resending)
                    return

                scope.resending = true;
                API.resendEmail().then(function(res) {
                    if (res.status)
                        growl.success('Se reenvió el mail de confirmación. Por favor revisa todas las casillas para asegurarte que no fue filtrado como SPAM');
                    else
                        growl.error(res.message);

                    scope.refreshIndication = true;
                    scope.resending = false
                });
            }

            // endregion


            scope.editDescription = function() {
                scope.descriptionEditing = !scope.descriptionEditing;
            }

            scope.changeDescription = function() {
                let description = scope.element.find('#description').val();
                if (description === scope.description)
                    scope.descriptionEditing = !scope.descriptionEditing;
                else
                    scope.updateData({ description });
            }

            scope.updateData = function (data) {
                if (data.description && data.description.length > scope.maxLength) {
                    growl.info('La descripción no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                API.updateUser(data, scope.userData.id).then(
                    function(result){
                        if (!result.status) {
                            growl.error(result.message);
                            return;
                        }

                        growl.success(`Se modificó tu información sin problemas`);

                        data.email_confirmed = false;

                        Auth.changeData(data);
                        for (let d in data) {
                            scope[d] = data[d];
                            scope[d+'Editing'] = !scope[d+'Editing'];
                        }

                        scope.userData = Auth.userData;
                    },

                    function(e) {
                        growl.error('Tuvimos un problema. Por favor volvé a intentar más tarde');
                        for (let d in data)
                            scope[d+'Editing'] = !scope[d+'Editing'];

                    }

                );
            }

            scope.logout = function () {
                Auth.logout(true);
            }

            scope.deleteAccount = function() {

                let title = '¿Seguro deseas eliminar tu cuenta?';
                let text = 'De hacerlo, ya no podrás ingresar a Si lo venís a buscar, es tuyo!';
                modalServices.BasicModal(title, text, function (res) {
                    if (!res)
                        return;

                    title = '¡ATENCIÓN!';
                    text = "Esto eliminará tu cuenta. ¿Seguro deseas continuar?"
                    modalServices.CancelModal(title, text, function (res){
                        if (!res)
                            return;

                        API.deleteUser(scope.userData.id).then(
                            function(result) {
                                if (result.status)
                                    Auth.logout(true);
                                else
                                    growl.error('No se pudo eliminar el usuario. Pruebe más tarde');
                            }
                        );

                    })
/*
                    API.deleteUser(scope.userData.id).then(
                        function(result) {
                            if (result.status)
                                Auth.logout(true);
                            else
                                growl.error('No se pudo eliminar el usuario. Pruebe más tarde');
                        }
                    );
*/
                })
            }

            /*  ADDRESSESS  */
            scope.acceptAddress = function (address) {

                API.createAddress(address).then(
                    function (result) {
                        scope.userData.addresses.push(result);
                        Auth.changeData({addresses: scope.userData.addresses});

                        let a = result.district;
                        if (result.city)
                            a += a === '' ? result.city : ', ' + result.city;
                        scope.addresses.push(a);

                        growl.success(`Se ha agregado una nueva ubicación.`);
                        scope.backToHere();
                    },
                    function (e) {
                        growl.error(e);
                        scope.backToHere();
                    }
                );

            }

            scope.cancelAddress = function () {
                scope.backToHere();
            }

            scope.newAddress = function () {
                $state.go('app.map', {
                    cancel: scope.cancelAddress,
                    accept: scope.acceptAddress
                });
            }

            scope.editedAddress = function (address, lat, lng) {

                let index = _.findIndex(scope.userData.addresses, {'lat': lat, 'lng': lng});
                let a = scope.userData.addresses[index];

                API.updateAddress(address, a.id).then(
                    function(result){
                        if (!result.status) {
                            growl.error(result.message);
                            return;
                        }

                        scope.userData.addresses[index] = result.result;
                        Auth.changeData({addresses: scope.userData.addresses});

                        let a = result.district;
                        if (result.city)
                            a += a === '' ? result.city : ', ' + result.city;
                        scope.addresses[index] = a;

                        growl.success(`Se modificó la dirección sin problemas`);
                        scope.backToHere();
                    },

                    function(e) {
                        growl.error('Tuvimos un problema. Por favor volvé a intentar más tarde');
                        scope.backToHere();
                    }

                );

            }

            scope.editAddress = function (index) {
                let desc = scope.userData.addresses[index].district;
                if (scope.userData.addresses[index].city && scope.userData.addresses[index].city !== "")
                    desc += ", " + scope.userData.addresses[index].city;

                $state.go('app.map', {
                    cancel: scope.cancelAddress,
                    accept: scope.editedAddress,
                    delete: scope.deleteAddress,
                    lat: scope.userData.addresses[index].lat,
                    lng: scope.userData.addresses[index].lng,
                    description: desc
                });
            }

            scope.deleteAddress = function (lat, lng) {
                let index = _.findIndex(scope.userData.addresses, {'lat': lat, 'lng': lng});
                let a = scope.userData.addresses[index];

                API.deleteAddress(a.id).then(
                    function (result) {

                        if (!result.status) {
                            growl.error("Ocurrió un error borrando la dirección. Pruebe de nuevo más tarde");
                            scope.backToHere();
                            return;
                        }

                        scope.userData.addresses.splice(index, 1);
                        scope.addresses.splice(index, 1);

                        Auth.changeData({addresses: scope.userData.addresses});

                        growl.success('Se ha eliminado la ubicación.');
                        scope.backToHere();
                    },

                    function (e) {
                        growl.error(e);
                        scope.backToHere();
                    }
                );
            }

            scope.backToHere = function () {
                scope.$emit('reload', 'PROFILE');
            }


        }

        return {
            restrict: 'E',
            templateUrl: 'app/pages/user/private/miCuenta/profile.template.html',
            controller: 'miCuentaController',
            link: link
        }
    }
]);
