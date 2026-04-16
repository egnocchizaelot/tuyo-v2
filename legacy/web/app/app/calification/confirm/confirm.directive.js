'use strict'

angular.module('calification')
.directive('confirmDelivery', ['Auth', 'Config', 'growl', 'API', 'appService',
    function (Auth, Config, growl, API, appService) {

        var scope = {
            donation: '=',
            close: '&'
        };

        const link = function (scope, element, attr) {
            scope.mediaURL = Config.mediaURL;

            scope.me = Auth.userData;

            scope.isCreator = scope.donation.creator.id === scope.me.id;
            scope.other = scope.isCreator ? scope.donation.selected_user : scope.donation.creator;

            scope.name = !scope.isCreator ? scope.donation.creator.full_name : scope.donation.selected_user.full_name;
            scope.imgPath = !scope.isCreator ? scope.donation.creator.picture_url : scope.donation.selected_user.picture_url;

            scope.leftPath = scope.mediaURL + scope.donation.creator.picture_url;
            scope.rightPath = scope.mediaURL + scope.donation.selected_user.picture_url;


            scope.calificate = function (button) {
                if (scope.selected === button) {
                    scope.selected = undefined;
                    element.find('#' + button).removeClass('selected');
                    return;
                }

                scope.selected = button;

                if (button === 'mala') element.find('#mala').addClass('selected');
                else element.find('#mala').removeClass('selected');

                if (button === 'buena') element.find('#buena').addClass('selected');
                else element.find('#buena').removeClass('selected');

                if (button === 'genial') element.find('#genial').addClass('selected');
                else element.find('#genial').removeClass('selected');
            }

            scope.continuar = function () {
                if (!scope.selected || (scope.selected !== 'mala' && scope.selected !== 'buena' && scope.selected !== 'genial')) {
                    growl.info("Tenés que elegir una opción antes de continuar")
                    return;
                }

                if (!scope.donation.rate_id){
                    growl.info("¡Ups! Esto normalmente no pasa. Por favor contactá a un administrador");
                    return;
                }

                let state = scope.selected === 'mala' ? scope.states.BAD : scope.states.GOOD;
                if (state === scope.states.GOOD) {

                    let data = {
                        rate: scope.selected === 'buena' ? scope.rateOption.GOOD : scope.rateOption.EXCELENT,
                        rate_id: scope.donation.rate_id
                    }

                    API.rateUser(data).then(function (res) {

                        if (!res.status) {

                            if (appService.DEVELOP) growl.error(res.message);
                            else growl.error("Tuvimos un problema. Volvé a probar más tarde")

                            scope.close({ result: { res: false } });
                            return;
                        }

                        scope.rateDone = true;

                        // growl.success("Calificación exitosa");
                        scope.state = state;

                        scope.donation.already_rate = true;
                    });


                    scope.state = state;
                }
                else if (scope.states.BAD) {
                    scope.state = state;
                }

            }

            scope.$on('close', function(s, data) {
                switch (data.case) {
                    case 'appreciation':
                            scope.close({result: { res: true, done: true } });
                        break;

                    case 'report':

                        let info = {
                            rate: scope.rateOption.BAD,
                            rate_id: scope.donation.rate_id,
                            feedback: data.text
                        }

                        API.rateUser(info).then(function (res) {

                            if (!res.status) {

                                if (appService.DEVELOP) growl.error(res.message);
                                else growl.error("Tuvimos un problema. Volvé a probar más tarde")

                                scope.close({ result: {res: false} });
                                return;
                            }

                            scope.donation.already_rate = true;
                            scope.rateDone = true;

                            // growl.success("Calificación exitosa");
                            scope.close({ result: { res: false, done: true } });
                        });

                        break;

                    case 'close':
                        scope.close({ result: { res: false, done: scope.rateDone } });
                        //scope.close({ result: { res: false } });
                        break;
                }
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'app/calification/confirm/confirm.template.html',
            controller: 'confirmDeliveryController',
            link: link,
            scope: scope
        }
    }
])
