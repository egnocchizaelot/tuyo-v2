'use strict'

angular.module('user')
.controller('publicInformationController', ['$scope',
    function ($scope) {

        $scope.$on('mutualFriends', (smth, friends) => {

            if (!friends || !friends.data)
                return;

            $scope.mutualFriends = friends;

            $scope.nameList = "";
            let i = 0;
            while (i < 20 && i < friends.data.length)
            {
                $scope.nameList += friends.data[i].name + ", ";
                i++;
            }

            if (i >= friends.data.length){
                $scope.nameList = $scope.nameList.slice(0, -2);
            }
            else {
                $scope.nameList += "etc";
            }

            $scope.mutualsLoaded = true;
        });

        $scope.$on('facebookLink', (smth, id) => {
            $scope.facebookLink = 'http://www.facebook.com/' + id;
            $scope.linkLoaded = true;
        });

    }
]);
