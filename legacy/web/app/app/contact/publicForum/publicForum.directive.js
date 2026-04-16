'use strict'

angular.module('publicForum')
.directive('publicForum', ['API', 'Auth', 'growl', 'forumService', '$timeout', 'appService', 'socketService', '$interval',
    function (API, Auth, growl, forumService, $timeout, appService, socketService, $interval) {

        var scope = {
            data: '=',
            close: '&',
        }

        const link = function (scope, element, attr) {
            scope.isMobile = appService.isMobile;

            // scope.messagesCount = 0;
            scope.maxLength = 800;

            // appService.stopBodyScrolling(true);
            scope.userData = Auth.userData;
            scope.text = {}
            scope.closed = true;
            scope.element = element;


            scope.responding = false;
            scope.respondingId = -1;

            scope.$on('closeForum', function () {
                scope.close({result: false});
            });

            scope.Back = function () {
                scope.close({result: false});
            }
            scope.lastMessage = -1;

            scope.theForum = scope.data.notice ? scope.data.forum : scope.data.appreciation.forum;

            // region  --  RESPOND TO MESSAGE  --
            scope.$on('enableResponse', function(s, id) {

                if (scope.respondingId !== id) {
                    scope.responding = true;
                    scope.respondingId = id;

                    scope.$broadcast('take out responding green', id);
                }
                else {
                    scope.responding = false;
                    scope.respondingId = -1;

                    scope.$broadcast('take out responding green', -1);
                }



            });

            scope.Respond = function () {
                if (!scope.text.response)
                    return

                if(scope.text.response.length === 0)
                    return;

                if (scope.text.response.length > scope.maxLength) {
                    growl.info('El mensaje no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                let id = Auth.userData.id;
                let data = {
                    'forum_id': scope.theForum.id,
                    'subject': 'Response',
                    'content': scope.text.response,
                    'messageParent' : scope.respondingId
                }
                scope.sendMessage(data, scope.respondingId);
                scope.text.response = '';
                scope.responding = false;
            }

            scope.Send = function () {
                if (!scope.text.appreciationText)
                    return

                if(scope.text.appreciationText.length === 0)
                    return;

                if (scope.text.appreciationText.length > scope.maxLength) {
                    growl.info('El mensaje no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                let id = Auth.userData.id;
                let data = {
                    'forum_id': scope.theForum.id,
                    'subject': 'Response',
                    'content': scope.text.appreciationText
                }
                scope.sendMessage(data);
                scope.text.appreciationText = '';
            }


            scope.sendMessage = function (message, respondingId) {

                API.sendMessage(message).then(
                    function(data){
                        if (typeof data === 'string'){
                            growl.error(data);
                            return;
                        }
                        scope.addMessages([data]);

                    },
                    function (err) {
                        growl.error('Error al enviar respuesta.');
                    }
                );
            }

            // endregion


            // region  --  LOAD MESSAGES  --
            scope.addMessages = function (messages) {

                if (!messages || messages.length === 0)
                    return;

                //scope.messagesLoaded = false;

                for (var i = 0; i < messages.length; i++) {
                    let message = messages[i];
                    message.active = true;

                    if (!message.parent) {
                        message.repeatId = message.id + "_0";
                        scope.data.messageTree.push(message);
                        continue;
                    }

                    let parent = _.find(scope.data.messageTree, { id: message.parent.id });
                    if (parent) {
                        if (parent.children) {
                            parent.children.push(message);

                            parent.repeatId = parent.id + "_" + parent.children.length;
                        }
                        else {
                            // parent.children = [message];
                            let i = scope.data.messageTree.indexOf(parent);
                            let p = _.clone(scope.data.messageTree.splice(i, i+1)[0]);

                            p.children = [message];
                            p.repeatId = p.id + "_1";

                            let minga = [];
                            for (let t = 0; t < i; t++)
                                minga.push(scope.data.messageTree[t]);

                            minga.push(p);

                            for (let t = i; t < scope.data.messageTree.length; t++)
                                minga.push(scope.data.messageTree[t]);

                            scope.data.messageTree.length = 0;

                            angular.extend(scope.data.messageTree, minga);

                            /*
                            $timeout(function () {
                                scope.data.messageTree.splice(i, 0, p);
                                // scope.data.messageTree.push(p);
                            })
                            */
                        }
                    }
                }

                //scope.data.messageTree = scope.data.messageTree.slice(0);

                scope.theForum.messages = scope.theForum.messages.concat(messages);

                let thing = scope.data.notice ? scope.data : scope.data.appreciation;
                thing.public_messages_count = scope.theForum.messages.length;

                scope.lastMessage = messages[messages.length - 1].id;

                //$timeout(function () { scope.messagesLoaded = true; })
            };

            scope.createMessageTree = function(forum) {
                let messages = forum.messages.slice(0);
                let messageTree = forumService.CreateMessageTree(messages);
                messageTree = forumService.OrderMessageTree(messageTree);

                for (let i = 0; i < messageTree.length; i++)
                    messageTree[i].repeatId = messageTree[i].id + "_0";

                scope.data.messageTree = messageTree;

                scope.closed = forum.state.id === 1;
                scope.messagesLoaded = true;
            }

            scope.createForum = function (forum) {
                scope.theForum = forum;

                scope.lastMessage = 0;
                if (forum.messages && forum.messages.length > 0)
                    scope.lastMessage = forum.messages[forum.messages.length - 1].id;

                scope.createMessageTree(forum);

                scope.theForum.lastUpdate = scope.data.date_modified;
                scope.data.unread_public_messages_count = 0;
            }

            if (!scope.theForum.messages){
                let method = scope.data.notice ? 'noticeForum' : 'appreciationForum';
                let id = scope.data.notice ? scope.data.id : scope.data.appreciation.id;
                API[method](id).then(forum => {
                    scope.createForum(forum);
                });
            } else {
                scope.lastMessage = 0;
                if (scope.theForum.messages.length !== 0)
                    scope.lastMessage = scope.theForum[scope.theForum.length - 1].id;

                API.forumUpdated(scope.lastMessage, scope.theForum.id, scope.theForum.lastUpdate).then(messages => {
                    scope.addMessages(messages.new_messages);

                    scope.closed = theForum.state.id === 1;

                    scope.data.unread_public_messages_count = 0;
                    scope.messagesLoaded = true;
                });
            }
            // endregion


            // region  --  REAL TIME UPDATE  --
            socketService.forumCallback = function (messages, d, t, state, applicants, selected, lastUpdate) {
                if (messages.length === 0)
                    return;

                scope.addMessages(messages);

                scope.theForum.lastUpdate = lastUpdate;
            }

            var promise = $interval(function () {
                if (scope.lastMessage !== -1) {
                    socketService.newMessages('forum', scope.lastMessage, scope.theForum.id, scope.theForum.lastUpdate);
                }
            }, 5000);

            scope.$on('$destroy', function() {
                if (promise)
                    $interval.cancel(promise);

                socketService.forumCallback = undefined;
            });
            // endregion



            // region  --  STYLES, ANIMATIONS & STUFF
            element.find('#navBar').addClass("shadow");
            let messageContainer = element.parent().find('#messageContainer');
            messageContainer.css('display', 'block');
            //messageContainer.css('height', appService.modalHeight + 'px');
            //messageContainer.css('overflow', 'auto');

            // endregion


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

        }

        return {
            restrict: 'E',
            templateUrl: 'app/contact/publicForum/publicForum.template.html',
            controller: 'publicForumController',
            link: link,
            scope: scope
        }
    }
]);
