'use strict'

angular.module('help')
.directive('contactHelp', ['API', '$state', 'growl',
    function (API, $state, growl) {
        const scope = {
        }

        const link = function (scope, element, attr) {
            scope.sending = false;
            scope.maxLength = 1000;

            scope.ruelesPath = $state.href('app.reglamento');
            scope.projectPath = $state.href('app.proyecto');
            scope.helpPath = $state.href('app.help', { s: 'ayuda', t: -1 })
            scope.backPath = $state.href('app.help', {s: 'faq'});


            scope.goToTopic = function (index) {
                let topic = scope.topics[scope.page][index];
                $state.go('app.help', { s: 'topic', t: topic.id, topic: topic });
                // scope.$emit('openTopic', topic);
            }

            scope.removeImage = function(index) {
                if (index < 0 || index >= scope.attachments.length)
                    return;

                scope.attachments.splice(index, 1);
            }

            scope.send = function () {
                if (!scope.option) {
                    growl.info ('No se puede envíar un mensaje sin asunto');
                    return;
                }

                if (!scope.message || scope.message === "") {
                    growl.info ('No se puede envíar un mensaje vacío')
                    return;
                }

                if (scope.message.length > scope.maxLength) {
                    growl.info("No puedes envíar un mensaje con más de " + scope.maxLength + " caractéres.")
                    return;
                }

                let data = {};
                data.message_topic = scope.option;
                data.message_content = scope.message;
                data.message_attachment = scope.attachments && scope.attachments.length > 0 ? scope.attachments[0].img : undefined;

                if (scope.sending) {
                    return;
                }

                scope.sending = true;

                API.messages(data).then(function(stuff) {
                    scope.sending = false;

                    if (typeof stuff === 'string') {
                        growl.error('No se pudo envíar el mensaje.');
                        return
                    }

                    growl.success("Mensaje envíado con éxito");
                    scope.message = ""
                    scope.attachments = [];
                });
            }


        }


        return {
            restrict: 'E',
            templateUrl: 'app/help/contact/contact.template.html',
            controller: 'contactHelpController',
            link: link,
            scope: scope
        }
    }
]);
