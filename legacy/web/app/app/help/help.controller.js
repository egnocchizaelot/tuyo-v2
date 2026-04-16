'use strict'

angular.module('help')
.controller('helpController', ['$scope', '$stateParams', '$state', 'appService',
    function ($scope, $stateParams, $state, appService) {

        $scope.state = $stateParams.s;
        $scope.theTopic = $stateParams.topic;

        $scope.$on('openTopic', (s, topic) => {
            $state.go('app.help', { s: 'topic', t: topic.id, topic: topic });
        })

        $scope.login = function () {
            appService.login(true);
        }

    }
]);
