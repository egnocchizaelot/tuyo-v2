'use srict'

angular.module('chat')
.directive('privateChat', ['API', 'Auth', '$modal', 'growl', 'appService', '$timeout', '$interval', 'socketService', 'modalServices',
    function (API, Auth, $modal, growl, appService, $timeout, $interval, socketService, modalServices) {
        var scope = {
            donation: '=',
            close: '&',
            reservedOrNot: '&'
        }
        const link = function(scope, element, attr) {

            scope.maxLength = 800;

            scope.mediaURL = API.mediaURL;

            scope.chat = {};

            scope.element = element;

            /*  DIMENSIONS & STYLES  */


            let messageContainer = element.parent().find('#chatContainer');
           messageContainer.css('display', 'block');
           //messageContainer.css('height', appService.modalHeight + 'px');
           messageContainer.css('overflow', 'auto');

           $timeout(function(){

               let height = appService.modalHeight;

               if (appService.isMobile)
                    height = $(window).height() - $(".navbar").outerHeight() - $(".nav-chat-replay").outerHeight() + $("#imageHeader").outerHeight();

              messageContainer.css('height', height + 'px');
          });


            scope.lastMessage = -1;

            scope.id = Auth.userData.id;

            if (scope.donation.state)
                scope.delivered = scope.donation.state.name === "Completed";

            scope.owner = Auth.userData.id === scope.donation.creator.id;


            scope.Back = function () {
                scope.close({result: false});
            }

            scope.Send = function () {

                if (!scope.messagesLoaded)
                    return;

                if (!scope.chat.response || scope.chat.response === '')
                    return;

                if (scope.chat.response.length > scope.maxLength) {
                    growl.info('El mensaje no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                let data = {
                    'forum_id': scope.donation.private_forum.id,
                    'subject': 'Response',
                    'content': scope.chat.response,
                }

                API.sendMessage(data).then(
                    function (data) {

                        if (typeof data === 'string'){
                            growl.error(data);
                            return;
                        }

                        if (scope.lastMessage >= data.id)
                            return;

                        // scope.lastMessage = data.id;
                        scope.donation.private_messages_count++;

                        scope.donation.private_forum.messages.push(data);

                        let length = scope.donation.private_forum.blocks.length;

                        if (length !== 0 && data.sender.id === scope.donation.private_forum.blocks[length - 1][0].sender.id){
                            let block = scope.donation.private_forum.blocks.pop()
                            block = block.slice(0)
                            block.push(data)
                            block.me = data.sender.id === scope.id
                            block.date = (new Date()).toJSON();

                            scope.donation.private_forum.blocks.push(block)

                        }
                        else {
                            let block = [data];
                            block.me = true;
                            scope.donation.private_forum.blocks.push(block);
                        }

                        scope.scrollToTop();

                    },

                    function (err) {
                        growl.error('Error al enviar respuesta.');
                    }
                );

                scope.chat.response = "";
            }

            // region  --  MODALS  --
            if (scope.owner) {
                scope.deliverTitle = '¿Ya entregaste tu artículo a \n' + scope.donation.selected_user.full_name + '?';
                scope.deliverText = 'El chat quedará inhabilitado y podrás calificar tu experiencia';

                scope.cancelText = 'Se cerrará el chat y tu ofrecimiento volverá a estar disponible';
            } else {
                scope.deliverTitle = '¿Ya recibiste tu artículo de \n' + scope.donation.creator.full_name + '?';
                scope.deliverText = 'Fuiste a buscar y recibiste el artículo';

                scope.cancelText = 'El chat quedará inhabilitado'
            }

            scope.cancelReservation = function () {
                scope.stopUpdate = true;

                let title = '¿Seguro deseas cancelar esta reserva?'
                let text = scope.cancelText;
                modalServices.BasicModal(title, text, function (res) {
                    scope.stopUpdate = false
                    if (!res)
                        return;

                    let data = {
                      'donation_id': scope.donation.id,
                      'action': 'unselect',
                      'selected_user': scope.donation.selected_user.id
                    }

                    API.donationApplicantsAcctions(data).then(
                        function(data){

                            if (!data.status) {
                                growl.error(data.message);
                                scope.close({result: false});
                                return;
                            }

                            // growl.success("Se le canceló la reserva a " + scope.donation.selected_user.full_name)

                            let ex = scope.donation.selected_user;
                            scope.donation.selected_user = undefined;
                            scope.donation.private_forum = undefined;
                            scope.donation.prior_state = scope.donation.state;
                            scope.donation.state = {
                                description: 'The donation is open',
                                id: 2,
                                name: 'Published'
                            }

                            scope.donation.rate_id = data.rate_id;

                            if (scope.reservedOrNot)
                                scope.reservedOrNot({state: "Published"});

                            let res = {
                                state: 'cancelled',
                                selected: ex
                            }

                            scope.close({result: res});

                        },
                        function (e) {
                            growl.error('Error al cancelar la reserva')
                            scope.close({result: false})
                        }
                    );
                })

            }

            scope.deliverDonation = function () {
                scope.stopUpdate = true;

                let title = scope.deliverTitle;
                let text = scope.deliverText;
                modalServices.BasicModal(title, text, function (res) {
                    scope.stopUpdate = false

                    if (!res)
                        return;

                    let data = {
                        state: 'Completed',
                        donation_id: scope.donation.id
                    }

                    API.changeDonationState(data).then(
                        function (data) {

                            if (!data.status) {
                                growl.error(data.message);
                                scope.close({result: false});
                                return;
                            }


                            // growl.success(`Se le entregó la donación a ${scope.donation.selected_user.full_name}`);

                            scope.donation.state = {
                                description: 'Applicant has received the donation',
                                id: 5,
                                name: 'Completed'
                            }

                            scope.donation.rate_id = data.rate_id;
                            scope.delivered = true;

                            if (scope.reservedOrNot)
                                scope.reservedOrNot()('Completed');

                            scope.donation.private_forum.state.id = 1;
                            scope.donation.private_forum.state.name = "Closed";

                            let res = {
                                state: 'delivered'
                            }

                            scope.close({result: res});
                        },

                        function (e) {
                            growl.error('Error al marcar la donación como entregada. Intentelo en otro momento')
                            scope.close({result: false});
                        }
                    );
                })
            }
            // endregion

            // region  --  REAL TIME UPDATE  --
            //socketService.forumCallback = function (messages, d, t, state) {
            socketService.chatCallback = function (messages, d, t, state) {
                // d y t son mensajes borrados y threaded messages. Se usan en el foro de applicants

                if (scope.stopUpdate)
                    return

                if (state)
                    scope.stateChange(state);

                if (messages)
                    scope.addMessages(messages);
            }

            scope.addMessages = function (messages) {
                if (!messages || messages.length === 0)
                    return;

                if (scope.donation.private_messages_count)  scope.donation.private_messages_count += messages.length;
                else                                        scope.donation.private_messages_count = messages.length;


                let blocks = BlockThemOut(messages, scope.id);

                let b = scope.donation.private_forum.blocks[scope.donation.private_forum.blocks.length - 1];

                if (b && b[0].sender.id === blocks[0][0].sender.id) {
                    b = scope.donation.private_forum.blocks.pop();
                    b = b.slice(0);
                    let me = blocks[0].me
                    blocks[0] = b.concat(blocks[0]);
                    blocks[0].me = me;
                }

                if (scope.donation.private_forum.blocks)
                    scope.donation.private_forum.blocks = scope.donation.private_forum.blocks.concat(blocks);
                else
                    scope.donation.private_forum.blocks = blocks;


                    if (scope.donation.private_forum.messages)
                        scope.donation.private_forum.messages = scope.donation.private_forum.messages.concat(messages);
                    else
                        scope.donation.private_forum.messages = messages;

                scope.lastMessage = messages[messages.length - 1].id;

                scope.scrollToTop();
            }

            scope.stateChange = function (state) {

                if (state.name === 'Open')
                    return;

                if (scope.donation.private_forum && scope.donation.private_forum.state.name === state.name)
                    return;

                growl.info('Este foro se cerró');
                scope.close({result: false});
            }

            var promise = $interval(function () {
                if (scope.lastMessage !== -1 && scope.donation.private_forum)
                    socketService.newMessages('chat', scope.lastMessage, scope.donation.private_forum.id);
            }, 2000);

            scope.$on('$destroy', function() {
                if (promise)
                    $interval.cancel(promise);

                socketService.chatCallback = undefined;
                //socketService.forumCallback = undefined;
            })

            // endregion

            // region -- LOAD MESSAGES --
            if (!scope.donation.private_forum) {
                API.privateForum(scope.donation.id).then(forum => {

                    scope.donation.private_forum = forum;
                    scope.donation.private_forum.blocks = BlockThemOut(forum.messages, Auth.userData.id);

                    scope.messagesLoaded = true;

                    scope.lastMessage = 0;
                    if (forum.messages && forum.messages.length > 0)
                        scope.lastMessage = forum.messages[forum.messages.length - 1].id;

                    scope.scrollToTop()

                });
            } else {
                if (scope.donation.private_forum.messages.length !== 0) {
                    scope.lastMessage = scope.donation.private_forum.messages[scope.donation.private_forum.messages.length -1].id;
                }
                else
                    scope.lastMessage = 0

                API.forumUpdated(scope.lastMessage, scope.donation.private_forum.id).then(messages => {
                    scope.addMessages(messages.new_messages);

                    scope.closed = scope.donation.private_forum.state.id === 1;
                    scope.messagesLoaded = true;

                    scope.scrollToTop();

                });
            }
            // endregion;

            // region  --  TEXT AREA  --
            scope.limitRows = 5;
            scope.messageLastScrollHeight;
            scope.expand = function () {
                let textArea = scope.element.find('#messageText');
                let rows = textArea.attr('rows');
                let scrollHeight = textArea[0].scrollHeight;
                if (!scope.messageLastScrollHeight)
                    scope.messageLastScrollHeight = scrollHeight;

                textArea.attr('rows', 1);

                if (rows < scope.limitRows && scrollHeight > scope.messageLastScrollHeight)
                    rows++;
                else if (rows > 1 && scrollHeight < scope.messageLastScrollHeight)
                    rows--;

                textArea.attr('rows', rows);
                scope.messageLastScrollHeight = scrollHeight
            }
            // endregion

            // region  --  SCROLL TO TOP --
            scope.scrollToTop = function () {
                scope.activeScroll = false;
                $timeout(function() {
                    $timeout(function() {

                        let h = scope.element.find('#theContainer').height();
                        if (scope.donation.private_forum.messages.length <= 3)
                            h = 0;

                        scope.element.find('#chatContainer').scrollTop(h);

                        if (appService.isMobile)
                            $(window).scrollTop(h);

                    });
                });
            }
            // endregion

        }



        return {
            restrict: 'E',
            templateUrl: 'app/contact/privateChat/privateChat.template.html',
            controller: 'privateChatController',
            link,
            scope
        }
    }
]);

function BlockThemOut (messages, id) {
    messages = _.orderBy(messages, ['send_date']);
    let blocks = [];

    let block = [];
    let lastSender = -1;

    for (let i = 0; i < messages.length; i++) {
        let sender = messages[i].sender.id;

        if (sender === lastSender) {
            block.push(messages[i])
        }
        else {
            if (block.length > 0) {
                if (block[0].sender.id === id)
                    block.me = true;
                blocks.push(block)
            }

            lastSender = sender;
            block = [];
            block.push(messages[i]);
        }
    }

    if (block.length > 0) {
        if (block[0].sender.id === id)
            block.me = true;

        block.date = (new Date()).toJSON();
        blocks.push(block)
    }

    return blocks;
}
