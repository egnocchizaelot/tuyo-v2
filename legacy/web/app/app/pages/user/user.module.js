'use strict';

angular.module('user', ['post']).
config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('app.user', {
            controller: 'userProfileController',
            templateUrl: 'app/pages/user/userProfile.template.html',
            url: 'profile/:id',
            params: {
                id: {value: 'user', squash: false},
                state: {value: 0, squash: false}
            }
        })
    }

]);
