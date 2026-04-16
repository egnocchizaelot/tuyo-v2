'use strict';

angular.module('post')
.directive('reservePost', ['Auth', 'appService', 'Config', 'modalServices', 'growl', 'postServices', '$state', 'API', 'donationServices',
    function (Auth, appService, Config, modalServices, growl, postServices, $state, API, donationServices) {

        var scope = {
            donation: '='
        };

        var link = function (scope, element) {
            scope.userData = Auth.userData;
            scope.mediaURL = Config.mediaURL;
            scope.element = element;

            // region  --  SETTING UP  --
            scope.description = scope.donation.description.length > appService.reserveTextLength ?
                scope.donation.description.substring(0,130) + '...' : scope.donation.description;


            scope.isCreator = scope.userData.id === scope.donation.creator.id;
            // let creator = scope.userData.id === scope.donation.creator.id;
            scope.img = scope.donation.thumbnail ? scope.mediaURL + "/" + scope.donation.thumbnail : "assets/images/sin_foto_thumb.png";

            if (scope.donation.rate.state === "1") {
                scope.state = scope.states.RESERVED;
                scope.title = scope.isCreator ? 'Reservado para' : 'Reservado por';
            }
            else if (scope.donation.rate.state === "2") {
                if (scope.donation.rate.type === "Completed") {
                    scope.state = scope.states.COMPLETED;
                    scope.title = scope.isCreator ? 'Entregado a' : 'Entregado por';
                }
                else if (scope.donation.rate.type === "Cancelled") {
                    scope.state = scope.states.CANCELLED;
                    scope.title = scope.isCreator ? 'Reserva cancelada:' : 'Reserva cancelada por';
                }
            }

            scope.otherUser = undefined;
            if (scope.isCreator) {

                if (scope.state === scope.states.CANCELLED) {
                    scope.otherUser = scope.donation.rate.cancelled_user;
                } else {
                    scope.otherUser = scope.donation.selected_user;
                }


                scope.userImage = scope.otherUser.picture_url;
                scope.name = scope.otherUser.full_name;

                scope.deliverTitle = '¿Ya entregaste tu artículo a \n' + scope.otherUser.full_name + '?';
                scope.deliverText = 'El chat quedará inhabilitado y podrás calificar tu experiencia';

                scope.cancelText = 'Se cerrará el chat y tu ofrecimiento volverá a estar disponible';
            }
            else {
                scope.userImage = scope.donation.creator.picture_url;
                scope.name = scope.donation.creator.full_name;

                scope.deliverTitle = '¿Ya recibiste tu artículo de \n' + scope.donation.creator.full_name + '?';
                scope.deliverText = 'Fuiste a buscar y recibiste el artículo';

                scope.cancelText = 'El chat quedará inhabilitado';

                scope.otherUser = scope.donation.creator;
            }


            // endregion

            // region  --  RESERVED  --
            scope.cancelReservation = function () {

                var title = '¿Seguro deseas cancelar esta reserva?';
                var text = scope.cancelText;
                modalServices.BasicModal(title, text,
                    function (res) {

                        if (!res) {
                            return;
                        }

                        var data = {
                          'donation_id': scope.donation.id,
                          'action': 'unselect',
                          'selected_user': scope.donation.selected_user.id
                        };

                        API.donationApplicantsAcctions(data).then(
                            function(data){

                                if (!data.status) {
                                    growl.error(data.message);
                                    return;
                                }

                                // growl.success("Se le canceló la reserva a " + scope.donation.selected_user.full_name)

                                var ex = scope.donation.selected_user;
                                scope.donation.selected_user = undefined;
                                scope.donation.private_forum = undefined;
                                scope.donation.prior_state = scope.donation.state;
                                scope.donation.state = {
                                    description: 'The donation is open',
                                    id: 2,
                                    name: 'Published'
                                };

                                scope.changeState(scope.states.CANCELLED);
                                scope.calificate({state: 'cancelled', selected: ex});

                            },
                            function () {
                                growl.error('Error al cancelar la reserva');
                            }
                        );
                    }
                );

            };

            scope.deliverDonation = function () {
                var title = scope.deliverTitle;
                var text = scope.deliverText;
                modalServices.BasicModal(title, text, function (res) {
                    if (!res) {
                        return;
                    }

                    var data = {
                        state: 'Completed',
                        donation_id: scope.donation.id
                    };

                    API.changeDonationState(data).then(
                        function (data) {

                            if (!data.status) {
                                growl.error(data.message);
                                return;
                            }

                            // growl.success(`Se le entregó la donación a ${scope.donation.selected_user.full_name}`);

                            scope.donation.state = {
                                description: 'Applicant has received the donation',
                                id: 5,
                                name: 'Completed'
                            };

                            scope.delivered = true;

                            scope.changeState(scope.state.COMPLETED);
                            scope.calificate({state: 'delivered'});
                        },
                        function () {
                            growl.error('Error al marcar el artículo como entregada. Intentelo en otro momento');
                        }
                    );
                });
            };

            scope.privateChat = function () {
                scope.donation.unread_private_messages_count = 0;
                postServices.ShowPrivateChatModal(scope.donation);
            };
            // endregion

            // region  --  COMPLETED  --
            scope.deliverCalification = function () {
                scope.calificate({ state: 'delivered' });
            };

            scope.publishThanks = function () {
                scope.calificate({state: 'delivered'});
            };
            // endregion

            // region  --  CANCELLED  --
            scope.cancelledCalification = function () {
                if (scope.isCreator) {
                    scope.calificate({state: 'cancelled', selected: scope.otherUser});
                } else {
                    scope.calificate({state: 'cancelled', selected: scope.userData});
                }

            };

            scope.reportUser = function () {

            };
            // endregion

            scope.calificate = function(data) {
                postServices.ShowCalificationModal(scope.donation, data,
                    function () {
                        scope.element.remove();
                        scope.$emit('removeReserved', scope.donation.id);


                    }, 'app.user', donationServices.reservedOrNot.bind(donationServices)
                );
            };

            scope.changeState = function (state) {
                if (scope.state === state) {
                    return;
                }

                scope.state = state;
                switch (state) {
                    case scope.states.RESERVED:
                        scope.donation.state.name = 'Reserved';
                        scope.donation.state.id = 4;
                        break;

                    case scope.states.CANCELLED:
                        scope.donation.state.name = 'Published';
                        scope.donation.state.id = 2;
                        break;

                    case scope.states.COMPLETED:
                        scope.donation.state.name = 'Completed';
                        scope.donation.state.id = 5;
                        break;
                    default:

                }

            };

            scope.goToUser = function () {
                return $state.href('app.user', {id: scope.otherUser.id});
            };


            /* jshint -W117 */
            scope.reservedFromForum = function(result, sender, chat) {
                donation.state.id = 4;
                donation.state.name = 'Reserved';

                donation.selected_user = sender;
                reserved = true;

                if (chat &&  donation.creator.id === Auth.userData.id) {
                    growl.success("Has reservado tu artículo para " + sender.full_name);
                    postServices.CloseForumModal();
                    scope.showPrivateChat();
                }

                $timeout(function() {
                    element.children().first().addClass('reservado');
                    element.children().first().removeClass('entregado');

                });
            };
            /* jshint +W117 */



            // region  --  REAL TIME CHANGES  --
            scope.donationChanged = function (donation) {
                // if (scope.state !== scope.states.RESERVED)
                //     return;

                switch (scope.donation.state.name) {
                    case "Reserved":

                        if (donation.state.name === 'Reserved') {
                            scope.donation.unread_private_messages_count = donation.unread_private_messages_count;
                        } else if (donation.state.name === 'Published') {
                            scope.changeState(scope.states.CANCELLED);
                        } else if (donation.state.name === 'Completed') {
                            scope.changeState(scope.states.COMPLETED);
                        }

                        break;

                    case "Published":
                        if (donation.state.name !== 'Reserved') {
                            return;
                        }
                        scope.changeState(scope.states.RESERVED);
                        scope.donation.unread_private_messages_count = donation.unread_private_messages_count;
                        break;

                    case "Completed":
                        // scope.changeState(scope.states.COMPLETED);
                        break;
                }

            };
            // endregion


        };

        return {
            restrict: 'E',
            templateUrl: 'app/post/reserve/reserve.template.html',
            controller: 'reservePostController',
            link: link,
            scope: scope
        };
    }
]);
