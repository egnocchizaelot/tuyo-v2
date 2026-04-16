'use strict'

angular.module('publicForum').
directive('publicForumMessage', ['moment', 'Auth', 'API', 'growl', '$state', 'ModalService', '$compile',
    function (moment, Auth, API, growl, $state, ModalService, $compile) {

        var scope = {
            message: '=',
        }

        const link = function (scope, element, attr) {
            scope.mediaURL = API.mediaURL;
            scope.element = element;
            scope.message.count_likes = scope.message.count_likes || 0;

            scope.sendDate = scope.message.send_date.replace('T', ' ');
            scope.responses = !!scope.message.children && scope.message.children.length > 0;
            scope.mine = scope.message.sender.id === Auth.userData.id


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
                scope.$emit('removeApplication');
            }


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
            templateUrl: 'app/contact/publicForum/publicMessage/publicMessage.template.html',
            controller: 'publicForumMessageController',
            link: link,
            scope: scope
        }
    }
]);
