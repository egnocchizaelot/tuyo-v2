'use strict'

angular.module('chat')
.controller('privateChatController', ['$scope', "appService",
    function ($scope, appService) {

        $scope.headerTop = false;

        let chatContainer = angular.element('#chatContainer')

        header = angular.element('#header').outerHeight() / 2

        $scope.smallHeader = false;
        $scope.animateHeader = function () {

            if ($scope.smallHeader)
                return;

            $scope.smallHeader = true;

            angular.element('#imageHeader').animate(
                {
                    height: 0,
                },
                "slow",
                function () {
                    angular.element('#imageHeader').css('display', 'none');
                }
            );

            chatContainer.animate({
                'padding-top': 140
            }, 'slow');

            //  --  PRIVATE CHAT FORMER CHANGES  --
            // chatContainer.animate({
            // }, 'slow');
            //
            // $scope.headerTop = true;
            // chatContainer.off('click');
            // chatContainer.off('scroll');
            //
            // if (!appService.isMobile) {
            //     let h = $("#navBar").outerHeight() + $("#theContainer").height();
            //     $("#theContainer").animate({
            //         "padding-top": 145,
            //         // "height": h
            //     }, "slow");
            // }
        }


        $scope.OnScroll = function () {

            if (!$scope.activeScroll) {
                $scope.activeScroll = true;
                return;
            }

            if (chatContainer.scrollTop() >=  header){
                $scope.animateHeader();
            }

        };


        chatContainer.on('scroll', $scope.OnScroll);
        chatContainer.on('click', $scope.animateHeader);
        angular.element('#textContainer').on('click', $scope.animateHeader);

        $scope.$on('$destroy', function() {
            chatContainer.off('scroll', $scope.OnScroll);
            chatContainer.off('click', $scope.animateHeader);
            angular.element('#textContainer').off('click', $scope.animateHeader);
        })


    }
]);

var header


// padding-top: 280px;
