'use strict'

angular.module('chat')
.directive('block', ['moment', 'Config',
    function (moment, Config) {
        var scope = {
            block: '=',
            pos: '='
        }

        const link = function (scope, element, attr) {

            scope.mediaURL = Config.mediaURL;

            scope.messages = scope.block.slice(0);

            scope.first = scope.messages.splice(0,1)[0];
            scope.first.date = getMeTime(scope.first.send_date)

            for (let i = 0; i < scope.messages.length; i++){
                scope.messages[i].date = moment(scope.messages[i].send_date).format('HH:mm');
            }

            if (scope.messages.length > 0)
                scope.last = scope.messages.splice(scope.messages.length - 1, 1)[0];


            if (scope.block.me)
                element.children().addClass('usuario')
            else
                element.children().addClass('destinatario')


            function getMeTime(time) {
                return moment(time).calendar(null, {
                    lastDay: () => {return '[Yesterday]'},
                    smaeDay: () => {return '[Today]'},
                    nextDay: () => {return '[Tomorrow]'},
                    lastWeek: () => {return '[Last] dddd'},
                    nextWeek: () => {return '[Next] dddd'},
                    sameElse: () => {return 'L'}
                })
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/contact/privateChat/block/block.template.html',
            controller: 'blockController',
            scope: scope,
            link: link
        }
    }
]);
