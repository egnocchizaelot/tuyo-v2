'use strict'

angular.module('calification')
.directive('cancelDelivery', ['Auth', 'Config', 'growl', 'API', 'appService',
    function (Auth, Config, growl, API, appService) {
        var scope = {
            donation: '=',
            selectedUser: '=',
            close: '&'
        };

        const link = function (scope, element, attr) {
            scope.mediaURL = Config.mediaURL;

            scope.me = Auth.userData;

            let isCreator = scope.donation.creator.id === scope.me.id;
            scope.other = isCreator ? scope.selectedUser : scope.donation.creator;

            scope.name = !isCreator ? scope.donation.creator.full_name : scope.selectedUser.full_name;
            scope.imgPath = !isCreator ? scope.donation.creator.picture_url : scope.selectedUser.picture_url;

            scope.leftPath = scope.mediaURL + scope.donation.creator.picture_url;
            scope.rightPath = scope.mediaURL + scope.selectedUser.picture_url;

            scope.mine = isCreator;

            scope.calificate = function (button) {
                if (scope.selected === button) {
                    scope.selected = undefined;
                    element.find('#' + button).removeClass('selected');
                    return;
                }

                scope.selected = button;

                if (button === 'mala') element.find('#mala').addClass('selected');
                else element.find('#mala').removeClass('selected');

                if (button === 'neutro') element.find('#neutro').addClass('selected');
                else element.find('#neutro').removeClass('selected');
            }

            scope.continuar = function () {
                if (!scope.selected) {
                    growl.info("Tenés que elegir una opción antes de continuar")
                    return;
                }

                let state = scope.selected === 'mala' ? scope.states.BAD : scope.states.GOOD;

                if (state === scope.states.GOOD) {

                    let data = {
                        rate: scope.rateOption.NEUTRO,
                        rate_id: scope.donation.rate_id
                    }

                    API.rateUser(data).then(function (res) {
                        if (!res.status) {

                            if (appService.DEVELOP) growl.error(res.message);
                            else growl.error("Tuvimos un problema. Volvé a probar más tarde")

                            scope.close({ result: {res: false} });
                            return;
                        }

                        scope.donation.already_rate = true;
                        scope.rateDone = true;

                        // growl.success("Calificación exitosa");
                        scope.state = state;

                    });
                }
                else if (state === scope.states.BAD) {
                    scope.state = state;
                }
            }

            scope.$on('close', function(s, data) {
                switch (data.case) {
                    case 'forum':
                        scope.close({ result: {res: true, done: true} });
                        break;

                    case 'report':

                        let info = {
                            rate: scope.mine ? scope.rateOption.BAD : scope.rateOption.NEUTRO,
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

                            scope.state = scope.states.GOOD;

                            // if (scope.donation.selected_user)
                            //     scope.close({ result: {res: false, done: true} });
                            // else
                            //     scope.close({ result: {res: true, done: true} });
                        });

                        // scope.close({ result: {res: false} });
                        break;

                    case 'close':
                        scope.close({ result: {res: false, done: scope.rateDone} });
                        break;

                }
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'app/calification/cancelled/cancel.template.html',
            controller: 'cancelDeliveryController',
            link: link,
            scope: scope
        }
    }
]);
