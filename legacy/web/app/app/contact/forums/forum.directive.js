'use strict'

angular.module('forumModule')
.directive('forum', ['API', 'Auth', 'growl', 'forumService', '$timeout', 'appService', 'socketService', '$interval', 'postServices',
    function (API, Auth, growl, forumService, $timeout, appService, socketService, $interval, postServices) {

        var scope = {
            donation: '=',
            close: '&',
            reservedOrNot: '&',
            appreciation: '='
        }

        const link = function (scope, element, attr) {
            scope.isMobile = appService.isMobile;

            scope.selected = false;

            scope.maxLength = 800

            scope.text = {}
            scope.closed = true;
            scope.element = element;

            scope.orderSelected = 3;

            scope.applicant = scope.donation.already_applicant;
            scope.reservedDonation = scope.donation.selected_user ? scope.donation.selected_user.id : -1;
            scope.delivered = scope.donation.state.name === "Completed";

            scope.ImDonator = scope.donation.creator.id === Auth.userData.id;

            scope.responding = false;
            scope.respondingId = -1;

            scope.$on('closeForum', function () {
                scope.close({result: false});
            });

            scope.Back = function () {
                scope.close({result: false});
            }
            scope.lastMessage = -1;


            // region  --  APPLICATIONS  --
            scope.MeAnoto = function () {
                if (scope.donation.already_applicant) {
                    growl.error('Ya estas anotado.');
                    return;
                }

                if (!scope.text.message || scope.text.message.length === 0 || scope.text.message.trim() === '') {
                    growl.error('Tiene que enviar un mensaje.');
                    return;
                }

                if (scope.text.message && scope.text.message.length > scope.maxLength) {
                    growl.info('El mensaje no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                var data = {
                    'donation_id': scope.donation.id,
                    'action': 'add',
                    'forum_message': scope.text.message.trim()
                }

                API.donationApplicantsAcctions(data).then(
                    function(data){
                        if (typeof data === 'string'){
                            growl.error(data);
                            scope.close({result: false});
                            return;
                        }

                        scope.donation.already_applicant = true;

                        if (scope.donation.user_applicants)
                            scope.donation.user_applicants.push({ user_id: data.sender.id });
                        else
                            scope.donation.user_applicants = [{ user_id: data.sender.id }];


                        if (!data.childs){

                            scope.lastMessage = data.id;

                            scope.donation.public_forum.messages.push(data);
                            scope.donation.public_messages_count = !scope.donation.public_messages_count ? 1 : scope.donation.public_messages_count++;


                            if (!data.parent) {

                                data.repeatId = data.id + "_0";

                                scope.donation.messageTree.push(data);
                            }
                            else {
                                let parent = _.find(scope.donation.messageTree, {id: data.parent.id});
                                if (!parent){
                                    if (appService.DEVELOP)
                                        growl.error('El mensaje vino sin padre. El padre tiene que ser el primer mensaje que mandó para anotarse la primera vez.');
                                    else
                                        growl.info('Tuvimos un problema mostrandote el mensaje. Pero quedaste anotado igual. No te preocupes');


                                    scope.close({result: true});
                                    return;
                                }

                                if (parent.children)
                                    parent.children.push(data);
                                else
                                    parent.children = [data];

                                parent.repeatId = parent.id + "_" + parent.children.length;

                            }
                        }
                        else {
                            data.children = data.childs;
                            delete data.childs;

                            data.applicant = true;
                            data.reserved = false;
                            data.parent = null;
                            data.like = null;
                            data.count_likes = 0;

                            data.repeatId = data.id + "_" + data.children.length;

                            scope.donation.messageTree.push(data);

                            scope.donation.public_forum.messages.push(data);
                            scope.donation.public_forum.messages = scope.donation.public_forum.messages.concat(data.children);

                            scope.donation.public_messages_count = scope.donation.public_forum.messages.length;

                            scope.lastMessage = data.children[data.children.length-1].id;

                        }
                        growl.success('Quedaste anotado.')

                        // scope.close({result: true});

                        //$timeout(function() { scope.messagesLoaded = true; })
                    },
                    function(){
                        growl.error('Error al anotarse.');
                        // scope.close({result: false});
                    }
                );

                scope.text.message = '';
            }

            scope.$on('removeApplication', function() {
                scope.RemoveApplication();
            });

            scope.RemoveApplication = function () {
                if (!scope.donation.already_applicant) {
                    growl.error(`No estas anotado en esta donacion.`);
                    return;
                }
                let id = Auth.userData.id;
                let data = {
                    'donation_id': scope.donation.id,
                    'action': 'remove'
                }

                API.donationApplicantsAcctions(data).then(
                    function(data){

                        if (!data.status) {
                            growl.info(data.message);
                            return;
                        }


                        scope.close({result: false});

                        // scope.donation.applicants_count--;
                        scope.donation.already_applicant = false;

                        let i = _.findIndex(scope.donation.user_applicants, {user_id: id});
                        if (i !== -1)
                            scope.donation.user_applicants.splice(i, 1);

                        // REMOVE ALL MESSAGES FROM THIS/THAT APPLICATION
                        i = _.findIndex(scope.donation.messageTree, function (o) { return o.sender.id === id; });
                        if (i !== -1) {
                            let m = scope.donation.messageTree.splice(i, 1)[0];

                            i = _.findIndex(scope.donation.public_forum.messages, {id: m.id});
                            if (i !== -1)   scope.donation.public_forum.messages.splice(i, 1);

                            if (m.children) {
                                for (let q = 0; q < m.children.length; q++) {
                                    i = _.findIndex(scope.donation.public_forum.messages, {id: m.children[q].id});
                                    if (i !== -1)   scope.donation.public_forum.messages.splice(i, 1);
                                }
                            }
                        }
                        growl.success('Solicitud eliminada.');

                    },
                    function () {
                        growl.error('Error al cancelar.')
                        scope.close({result: false});
                    }
                );
            }
            // endregion

            // region  --  RESPOND TO MESSAGE  --
            scope.$on('enableResponse', function(s, id) {
                scope.responding = true;
                scope.respondingId = id;

                scope.$broadcast('take out responding green', id);
            });

            scope.Respond = function () {

                if (scope.text.response && scope.text.response.length > scope.maxLength) {
                    growl.info('El mensaje no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                let id = Auth.userData.id;
                let data = {
                    'forum_id': scope.donation.public_forum.id,
                    'subject': 'Response',
                    'content': scope.text.response,
                    'messageParent' : scope.respondingId
                }

                API.sendMessage(data).then(
                    function(data){
                        if (typeof data === 'string'){
                            growl.error(data);
                            return;
                        }

                        scope.donation.public_forum.messages.push(data);

                        let parent = _.find(scope.donation.messageTree, { id: scope.respondingId });
                        if (!parent) return;


                        data.active = true;



                        if (parent.children) {
                            parent.children.push(data);
                            parent.repeatId = parent.id + "_" + parent.children.length;
                        }
                        else {
                            let parentIndex = scope.donation.messageTree.indexOf(parent);
                            let p = _.clone(scope.donation.messageTree.splice(parentIndex, 1)[0]);
                            //let p = _.clone(scope.donation.messageTree.splice(parentIndex, parentIndex+1)[0]);

                            p.children = [data];
                            p.repeatId = p.id + "_1";

                            scope.donation.messageTree.splice(parentIndex, 0, p);
                        }


                        scope.donation.public_messages_count = !scope.donation.public_messages_count ? 1 : scope.donation.public_messages_count++;
                        scope.lastMessage = data.id;

                        scope.$broadcast('take out responding green');

                    },
                    function (err) {
                        growl.error('Error al enviar respuesta.');
                        scope.$broadcast('take out responding green');
                    }
                );

                scope.text.response = '';
                scope.responding = false;
            }

            // region  --  DONOR VIEWS AND STUFF  --
            scope.orderText = 'Ordenar';
            scope.OrderBy = function (option) {
                scope.showOrder();
                scope.orderSelected = option;
                switch (option) {
                    case 0:
                        scope.orderText = 'Reputación';
                        $('#orderIcon').removeClass();
                        $('#orderIcon').addClass("btn btn-empty-white float-right icon-reputacion");
                        break;

                    case 1:
                        scope.orderText = 'Te gusta';
                        $('#orderIcon').removeClass();
                        $('#orderIcon').addClass("btn btn-empty-white float-right icon-gusta");
                        break;

                    case 2:
                        scope.orderText = 'Amigos en común';
                        $('#orderIcon').removeClass();
                        $('#orderIcon').addClass("btn btn-empty-white float-right icon-amigos");
                        break;

                    case 3:
                        scope.orderText = 'Orden de llegada';
                        $('#orderIcon').removeClass();
                        $('#orderIcon').addClass("btn btn-empty-white float-right icon-primero");
                        break;

                }
                scope.donation.messageTree = forumService.OrderMessageTree(scope.donation.messageTree, option);
                let selectedId = scope.donation.selected_user ? scope.donation.selected_user.id : -1;
                scope.donation.messageTree = forumService.SendSelectedToTop(scope.donation.messageTree, selectedId);
            };

            scope.$on('reserveIt', function (s, sender) {
                scope.stopUdate = true

                if (sender === "openChat") {
                    scope.reservedOrNot({state: "OpenChat", donation: scope.donation});
                    return;
                }

                scope.donation.selected_user = {
                    id: sender.id,
                    picture_url: API.mediaURL + sender.picture_url
                }

                scope.selected = true;

                scope.donation.state.id = 4;
                scope.donation.state.name = "Reserved";
                scope.donation.state.description = "An applicant has been selected";

                scope.reservedDonation = sender.id;
                scope.setReserved();
                scope.closed = true;
                scope.donation.public_forum.state.id = 1;

                let selectedId = scope.donation.selected_user ? scope.donation.selected_user.id : -1;
                scope.messageTree = forumService.SendSelectedToTop(scope.messageTree, selectedId);

                if (scope.reservedOrNot)
                    scope.reservedOrNot({state: "Reserved", sender: sender, chat: true, donation: scope.donation});
                else
                    $state.go('app.donations.dashboard');
            });
            scope.showOrder = function() {
                element.find('#ordenar').slideToggle();
            }

            // region  --  REAL TIME UPDATE  --
            socketService.forumCallback = function (messages, deleted, threaded, state, applicants, selected, lastUpdate) {
                if (scope.stopUdate)
                    return;

                scope.stateChange(state);
                scope.deleteMessages(deleted);
                scope.newThreadedMessages(threaded);
                scope.addMessages(messages);

                if (applicants) {
                    scope.donation.user_applicants = applicants;
                    scope.setApplicants();
                }

                if (selected) {
                    if (selected.length === 0) {
                        scope.reservedDonation = -1;
                        scope.setReserved();
                    }
                    else {
                        if (scope.reservedDonation !== selected[0].user_id) {
                            scope.reservedDonation = selected[0].user_id;
                            scope.setReserved();
                        }
                    }
                }
                let selectedId = scope.donation.selected_user ? scope.donation.selected_user.id : -1;
                scope.messageTree = forumService.SendSelectedToTop(scope.messageTree, selectedId);
                scope.donation.public_forum.lastUpdate = lastUpdate;
            }

            scope.addMessages = function (messages) {
               if (!messages || messages.length === 0)
                    return;


                for (var i = 0; i < messages.length; i++) {
                    let message = messages[i];
                    message.active = true;

                    if (_.find(scope.donation.messageTree, { id: message.id }))
                        continue;

                    if (!message.parent) {
                        scope.donation.messageTree.push(message);
                        message.repeatId = message.id + "_0";
                        continue;
                    }

                    let parent = _.find(scope.donation.messageTree, { id: message.parent.id });
                    if (parent) {
                        if (parent.children){

                            if (_.find(parent.children, {id: message.id}))
                                continue;

                            parent.children.push(message);

                            parent.repeatId = parent.id + "_" + parent.children.length;

                        }
                        else{

                            let i = scope.donation.messageTree.indexOf(parent);
                            let p = _.clone(scope.donation.messageTree.splice(i, i+1)[0]);

                            p.children = [message];
                            p.repeatId = p.id + "_1";


                            let minga = [];

                            for (let t = 0; t < i; t++)
                                minga.push(scope.donation.messageTree[t]);

                            minga.push(p);

                            for (let t = i; t < scope.donation.messageTree.length; t++)
                                minga.push(scope.donation.messageTree[t]);

                            scope.donation.messageTree.length = 0;

                            angular.extend(scope.donation.messageTree, minga);
                            //scope.donation.messageTree = minga;

                            //scope.donation.messageTree.splice(i, 0, p);
                        }
                    }
                }

                //scope.donation.messageTree = scope.donation.messageTree.slice(0);

                scope.donation.public_forum.messages = scope.donation.public_forum.messages.concat(messages);
                scope.donation.public_messages_count = scope.donation.public_forum.messages.length;

                scope.lastMessage = messages[messages.length - 1].id;



                //$timeout(function () { scope.messagesLoaded = true; })
            };

            scope.deleteMessages = function (deleted) {
                if (!deleted)
                    return;

                for (let q = deleted.length -1; q >= 0; q--){
                    let i = _.findIndex(scope.donation.messageTree, {id: deleted[q].id });
                    if (i === -1)
                        continue;
                    scope.donation.messageTree.splice(i, 1);
                }

            }

            scope.newThreadedMessages = function (threaded) {

                if (!threaded || threaded.length === 0)
                    return;

                let parents = [];
                let children = [];
                for (let i = 0; i < threaded.length; i++) {

                    let tm = threaded[i];

                    for (let c = 0; c < tm.childs.length; c++) {
                        let child = tm.childs[c];
                        child.parent = { id: tm.id };
                        children.push(child);
                    }

                    delete tm.childs;
                    parents.push(tm);
                }

                scope.addMessages(parents);
                scope.addMessages(children);

                //scope.addMessages(messages);

            }

            scope.stateChange = function (state) {
                if (!state)
                    return;

                if (!scope.closed && state.id === 1)
                    growl.info('Éste foro se cerró')

                scope.closed = state.id === 1;
            }


            scope.getParents = function () {
                let parents = [];
                for (let i = 0; i < scope.donation.messageTree.length; i++) {
                    parents.push(scope.donation.messageTree[i].id);
                }
                if(parents.length == 0){
                    parents.push(0);
                }
                return parents;
            }

            var promise = $interval(function () {
                if (scope.lastMessage !== -1) {

                    let parents = scope.getParents();

                    socketService.newMessages('forum', scope.lastMessage, scope.donation.public_forum.id, scope.donation.public_forum.lastUpdate, parents);

                }
            }, 5000);

            scope.$on('$destroy', function() {
                if (promise)
                    $interval.cancel(promise);

                socketService.forumCallback = undefined;

            });
            // endregion

            // region  --  LOAD MESSAGES  --
            scope.createMessageTree = function(forum) {
                let messages = forum.messages.slice(0);
                let messageTree = forumService.CreateMessageTree(messages);
                //messageTree = forumService.OrderMessageTree(messageTree);

                for (let i = 0; i < messageTree.length; i++)
                    messageTree[i].repeatId = messageTree[i].id + "_0";


                scope.donation.messageTree = messageTree;

                scope.closed = forum.state.id === 1;
                scope.messagesLoaded = true;
            }


            // Sets which messages belong to applicants
            scope.setApplicants = function () {
                for (let i = 0; i < scope.donation.messageTree.length; i++) {
                    let id = scope.donation.messageTree[i].sender.id;
                    if (_.findIndex(scope.donation.user_applicants, {user_id: id}) !== -1)
                        scope.donation.messageTree[i].applicant = true;
                    else
                        scope.donation.messageTree[i].applicant = false;

                }
            }

            // Sets the message that is reserved
            scope.setReserved = function () {
                for (let i = 0; i < scope.donation.messageTree.length; i++) {
                    let id = scope.donation.messageTree[i].sender.id;
                    if  (id === scope.reservedDonation)
                        scope.donation.messageTree[i].reserved = true;
                    else
                        scope.donation.messageTree[i].reserved = false;
                }
            }



            if (!scope.donation.public_forum.messages){

                API.donationForum(scope.donation.id).then(data => {

                    scope.donation.user_applicants = data.applicants;

                    let forum = data.forum;
                    scope.donation.public_forum = forum;

                    scope.lastMessage = 0;
                    if (scope.donation.public_forum.messages && scope.donation.public_forum.messages.length > 0)
                        scope.lastMessage = scope.donation.public_forum.messages[scope.donation.public_forum.messages.length - 1].id;

                    scope.createMessageTree(forum);
                    scope.setApplicants();
                    scope.setReserved();

                    scope.donation.public_forum.lastUpdate = scope.donation.date_modified;
                    scope.donation.unread_public_messages_count = 0;

                    scope.closed = data.forum.state.id === 1;
                });
            }
            else {

                if (scope.donation.public_forum.messages.length !== 0)
                    scope.lastMessage = scope.donation.public_forum.messages[scope.donation.public_forum.messages.length -1].id;
                else
                    scope.lastMessage = 0

                let parents = scope.getParents();

                API.forumUpdated(scope.lastMessage, scope.donation.public_forum.id, scope.donation.public_forum.lastUpdate, parents).then(messages => {

                    if (messages.applicants)
                        scope.donation.user_applicants = messages.applicants;
                        //scope.donation.user_applicants = scope.donation.user_applicants.concat(messages.applicants);
                    scope.deleteMessages(messages.new_deleted_messages);
                    scope.newThreadedMessages(messages.thread_new_messages);
                    scope.addMessages(messages.new_messages);

                    scope.closed = scope.donation.public_forum.state.id === 1;

                    scope.setApplicants();
                    scope.setReserved();

                    scope.donation.unread_public_messages_count = 0;
                    scope.messagesLoaded = true;


                    let selectedId = scope.donation.selected_user ? scope.donation.selected_user.id : -1;
                    scope.donation.messageTree = forumService.SendSelectedToTop(scope.donation.messageTree, selectedId);

                    if (selectedId === -1 && scope.selected) {
                        scope.selected = false;
                        scope.donation.messageTree = forumService.OrderMessageTree(scope.donation.messageTree, scope.orderSelected);
                    }


                });
            }


            // region  --  STYLES, ANIMATIONS & STUFF
            element.find('#navBar').addClass("shadow");
            let messageContainer = element.parent().find('#messageContainer');
            //messageContainer.css('display', 'block');


            // endregion


            // region  --  TEXT AREA  --
            scope.limitRows = 5;
            scope.messageLastScrollHeight;
            scope.expand = function (id) {
                let textArea = scope.element.find(id);
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

        }

        return {
            restrict: 'E',
            templateUrl: 'app/contact/forums/forum.template.html',
            controller: 'forumController',
            link: link,
            scope: scope
        }
    }
]);
