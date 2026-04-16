'use strict'

angular.module('creation').
directive('createDonation', ['API', '$state', 'growl', 'appService', 'modalServices', 'loadingService', 'Socialshare',
    function (API, $state, growl, appService, modalServices, loadingService, Socialshare) {

        let scope = {
            close: '&',
            donation: '='
        }

        const link = function (scope, element, attr) {
            scope.showNext = true;
            scope.publishing = false;
            /*  DIMENSIONS & STYLES  */
            element.find('#creationNavBar').addClass("shadow");
            element.find('#creationNavBar').css('height', '55px');

            let content = element.parent().find('#content');
            content.css('padding-top', '55px');
            content.css('display', 'block');
            content.css('height', appService.modalHeight + 'px');
            content.css('overflow', 'auto');

            scope.loadingImgs = false;
            scope.loadingData = {text: 'subiendo...'};

            scope.nextButton = function () {
                if (scope.step < 4){

                    if (scope.step === 1) {
                        let d = scope.oneDone();
                        if (d !== 0) {

                            let text = "";
                            switch (d) {
                                case -1:
                                    text = 'Por favor, describe tu artículo';
                                    break;

                                case -2:
                                    text = 'No se pueden subir más de 4 fotos';
                                    break

                                default:
                                    text = 'La descripción no puede tener más de ' + d + ' caracteres';
                                    break
                            }

                            //let text = d === -1 ? 'Por favor, describe tu artículo' : 'La descripción no puede tener más de ' + d + ' caracteres';

                            growl.info(text);
                            return;
                        }
                    }

                    if (scope.step === 2 && !scope.twoDone()) {
                        growl.info('El texto es muy largo');
                        return
                    }

                    if (scope.step === 3 && !scope.threeDone()) {
                        growl.info('Debes indicar la zona de retiro.');
                        return;
                    }

                    scope.step++;
                }

                if (scope.step === 4) {
                    scope.dataReceived = 0;
                    scope.$broadcast('sendData', scope.data);
                }
            }

            scope.changeStep = function (step) {
                if (scope.step === step)
                    return;

                if (scope.step === 1) {
                    let d = scope.oneDone();
                    if (d !== 0) {
                        let text = d === -1 ? 'Por favor, describe tu artículo' : 'La descripción no puede tener más de ' + d + ' caracteres';

                        growl.info(text);
                        return;
                    }
                }


                if (scope.step === 2 && !scope.twoDone()) {
                    growl.info('El texto es muy largo');
                    return
                }


                if (scope.step === 3 && !scope.threeDone()) {
                    growl.info('Debes indicar la zona de retiro.');
                    return;
                }

                scope.step = step;

            }

            scope.dataReceived = 0;
            scope.data = {};
            scope.$on('dataSent', (smth, data) => {

                switch (data.step) {
                    case 1:
                        scope.data.description = data.description;
                        scope.data.files = data.images;
                        scope.files = data.images;
                        break;

                    case 2:
                        scope.data.pickup_description = data.pickupTime;
                        scope.data.onlyTime = data.only ? true : false;
                        break;

                    case 3:
                        scope.data.addresses = data.addresses;
                        scope.addresses = data.locations.concat(data.toRemove);
                        break;

                }


                scope.dataReceived++;

                if (scope.dataReceived === 3)
                    scope.$broadcast('setDonation', scope.data);

            })


            scope.$on('editDonation', () => { scope.step = 1 });

            scope.$on('donationAction', function() {
                if (!scope.donation)
                    scope.publishDonation();
                else
                    scope.updateDonation();
            });

            scope.publishDonation = function() {
                //SHA_TODO
                // if admin approval required only!
                // let title = 'Aprobación Pendiente';
                // let text = 'La donación será creada, pero no será publicada hasta que sea aprobada por un administrador.';

                // modalServices.BasicSingleButtonModal(title, text, function (res) {
                //     if (res){
                //         doPublishDonation();
                //     }
                // });
                doPublishDonation();
                // else no approval needed

                // $state.reload();
            };

            function doPublishDonation(){
                if (scope.publishing) {
                    return;
                }

                scope.publishing = true;


                scope.loadingImgs = true;
                scope.loadingData.text = "Publicando ofrecimiento";

                let images = scope.files.map(f => f.img);

                let data = {
                    description: scope.data.description,
                    pickup_description: scope.data.pickup_description,
                    mandatory: scope.data.onlyTime,
                    max_applicants: 0,
                    type_name: 'Public',
                    images: images,
                    addresses: scope.addresses
                };

                API.newDonation(data).then(
                    function (result) {

                        scope.publishing = false;
                        // loadingService.Close();
                        scope.loadingImgs = false;

                        if (typeof result === 'string') {
                            growl.error('Tuvimos un error. Por favor pruebe más tarde');
                            return;
                        }

                        growl.success(`Publicación creada con éxito`);
                        // $state.transitionTo('app.donations.dashboard');
                        scope.close({result: true});
                    },
                    function (result) {
                        scope.publishing = false;
                        // loadingService.Close();
                        scope.loadingImgs = false;
                        growl.error('Se produjo un error, por favor inténtalo nuevamente.');
                    }
                );
            }

            scope.updateDonation = function () {
                if (scope.publishing) return;

                scope.publishing = true;
                // loadingService.Show(loadingText);
                scope.loadingImgs = true;
                scope.loadingData.text = "Editando ofrecimiento";

                let data = {
                    description: scope.data.description,
                    pickup_description: scope.data.pickup_description,
                    mandatory: scope.data.onlyTime,
                    max_applicants: 0,
                    type_name: 'Public',
                    images: scope.files,
                    addresses: scope.addresses
                };

                API.updateDonation(data, scope.donation.id).then(
                    function (result){
                        scope.publishing = false;
                        // loadingService.Close();
                        scope.loadingImgs = false;

                        if (typeof result === 'string') {
                            growl.error('Tuvimos un error. Por favor pruebe más tarde.');
                            return;
                        }

                        scope.donation.description = result.description;
                        scope.donation.pickup_description = result.pickup_description;
                        scope.donation.mandatory = result.mandatory;
                        scope.donation.files = result.files;
                        scope.donation.addresses = result.addresses;

                        growl.success(`Publicación editada con éxito`);
                        // $state.transitionTo('app.donations.dashboard');
                        scope.close({result: result.files});
                    },
                    function (err) {
                        scope.publishing = false;
                        // loadingService.Close();
                        scope.loadingImgs = false;
                    }
                );
            };

            scope.$on('hideNext', function () { scope.showNext = false; });
            scope.$on('showNext', function () { scope.showNext = true; });

            scope.$on('back', function () { scope.Back() });

            scope.Back = function () {

                if (scope.publishing)
                    return;

                let text = 'No se creará tu publicación';
                if (scope.editing) text = 'No se editará tu publicación';

                let title = '¿Seguro deseas salir?';
                modalServices.BasicModal(title, text, function (res) {
                    if (!res)
                        return;

                    scope.close({ result: false });
                })
            }

            if (scope.donation)
                scope.editing = true;

        }

        return {
            restrict: 'E',
            templateUrl: 'app/create/createDonation/creation.template.html',
            controller: 'createDonationController',
            link: link,
            scope: scope
        }
    }
]);
