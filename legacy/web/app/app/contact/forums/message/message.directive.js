'use strict'

angular.module('forumModule').
directive('forumMessage', ['moment', 'Auth', 'API', 'growl', '$state', '$compile', 'modalServices',
    function (moment, Auth, API, growl, $state, $compile, modalServices) {

        var scope = {
            message: '=',
            reservedDonation: '=',
            alreadyApplicant: '=',
            donor: '=',
            donationId: '=',
            delivered: '=',
            closed: '='
        }

        const link = function (scope, element, attr) {

            scope.mediaURL = API.mediaURL;
            scope.element = element;
            scope.message.count_likes = scope.message.count_likes || 0;

            scope.sendDate = scope.message.send_date.replace('T', ' ');
            scope.responses = !!scope.message.children && scope.message.children.length > 0;
            scope.mine = scope.message.sender.id === Auth.userData.id

            scope.reservedBySender = scope.reservedDonation === scope.message.sender.id;

            scope.ranking = function () {
                let rank = Math.round(scope.message.sender.ranking);
                return Array.apply(0, new Array(rank));
            }

            /* APPLICANT */
            scope.EnableComent = function () {

                let elid = '#theMessage_' + scope.message.id;
                angular.element(elid).css({'background-color': 'rgb(217, 255, 224)'})

                scope.$emit('enableResponse', scope.message.id);
            }

            scope.$on('take out responding green', function (s, id) {

                if (id === scope.message.id)
                    return;

                let elid = '#theMessage_' + scope.message.id;
                angular.element(elid).css({'background-color': ''})

            })

            scope.RemoveApplication = function() {
                if (scope.removing)
                    return;

                scope.removing = true;

                scope.$emit('removeApplication');
            }

            // region  --  RESERVATIONS  --
            scope.AddReservation = function () {
                if (scope.reservedDonation !== -1) {
                    growl.error('La donación ya esta reservada')
                    return;
                }

                if (scope.adding)
                    return;

                scope.adding = true;


                if (!Auth.userData.suggestions_config || Auth.userData.suggestions_config.indexOf('select_popup') === -1) {

                    modalServices.ReserveConfirmation(scope.message.sender, function(result) {

                        if (!result || !result.state)
                        {
                            scope.adding = false;
                            return;
                        }

                        if (result.check) {
                            API.setUserSuggestions({ show: false, string_identifier: 'select_popup' });
                            let sugg = Auth.userData.suggestions_config || [];
                            if (sugg.indexOf('select_popup') === -1) {
                                sugg.push('select_popup');
                                Auth.changeData({ suggestions_config: sugg });
                            }
                        }

                        scope.ReserveIt();
                    })


                }
                else {
                    scope.ReserveIt();
                }
            }

            scope.ReserveIt = function () {
                let data = {
                    'donation_id': scope.donationId,
                    'action': 'select',
                    'selected_user': scope.message.sender.id
                }
                API.donationApplicantsAcctions(data).then(
                    function(data){

                        if (!data.status) {
                            growl.error(data.message);
                            return;
                        }

                        // scope.$emit('reserveIt', scope.message.sender.id, scope.message.sender.picture_url);
                        scope.$emit('reserveIt', scope.message.sender);

                        scope.reservedBySender = true;
                        scope.message.reserved = true;
                    },
                    function (e) {
                        growl.error('Error al reservar donación')
                    }
                );
            }

            scope.GoToReservedChat = function () {
                scope.$emit('reserveIt', "openChat");
            }

            // scope.RemoveReservation = function () {
            //
            //     let data = {
            //       'donation_id': scope.donationId,
            //       'action': 'unselect',
            //       'selected_user': scope.message.sender.id,
            //       'picture_url': scope.message.sender.picture_url,
            //     }
            //     API.donationApplicantsAcctions(data).then(
            //         function(data) {
            //
            //             if (!data.status) {
            //                 growl.error(data.message);
            //                 return;
            //             }
            //
            //             scope.$emit('unreserveIt');
            //
            //             scope.OrderMessageTreeBySender = false;
            //             scope.message.reserved = false;
            //             growl.success(`Se quitó la reserva de ${scope.message.sender.full_name}`)
            //         },
            //         function () {
            //             growl.error(`No se pudo quitar la reserva de ${scope.message.sender.full_name}`)
            //         }
            //     );
            // }
            // endregion


            // region  --  LIKES  --
            scope.likeClick = scope.message.like ? removeLike : addLike;
            function addLike() {
                const data = {
                    'entity_type' : 'M',
                    'entity_id' : scope.message.id
                }
                API.add_like(data).then (
                    function(data) {
                        scope.message.like = data;
                        scope.message.count_likes ++;
                    },
                    function () {
                        growl.error('Error al darle like. Pruebe más tarde');
                    }
                );
                scope.likeClick = removeLike;
            }
            function removeLike() {
                API.remove_like(scope.message.like).then(
                    function(data) {
                        scope.message.like = undefined;
                        scope.message.count_likes --;
                    },
                    function () {
                        growl.error('Error al sacar el like. Pruebe más tarde');
                    }
                );
                scope.likeClick = addLike;
            }
            // endregion


            scope.goToUser = function () {
                $state.go('app.user', {id: scope.message.sender.id});
                scope.$emit('closeForum');
            }

            // region  --  SHOW RESPONSES --
            scope.selected = false;
            scope.toggleResponses = function () {
                element.find('#theResponses').slideToggle(350);
                scope.selected = !scope.selected;
            }
            // endregion

        }

        return {
            restrict: 'E',
            templateUrl: 'app/contact/forums/message/message.template.html',
            controller: 'forumMessageController',
            link: link,
            scope: scope
        }
    }
]);
