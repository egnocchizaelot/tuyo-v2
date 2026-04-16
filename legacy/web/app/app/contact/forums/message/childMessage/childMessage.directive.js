'use strict'

angular.module('forumModule').
directive('childMessage', ['moment', 'Config',
    function (moment, Config) {

        const scope = {
            child: '='
        }

        const link = function (scope, element, attr) {

            scope.mediaURL = Config.mediaURL;
            scope.sendDate = scope.child.send_date.replace('T', ' ');

            scope.ranking = function () {
                let rank = Math.round(scope.child.sender.ranking);
                return Array.apply(0, new Array(rank));
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/contact/forums/message/childMessage/childMessage.template.html',
            controller: 'forumChildMessageController',
            link: link
        }
    }
]);
