'use strict';

angular.module('post')
.service('postServices', ['appService', '$rootScope', 'postMobileServices', 'postWebServices',
    function(appService, $rootScope, postMobileServices, postWebServices) {

        // region  --  MODALS  --
        $rootScope.$on('$routeChangeStart', function(){
          this.CloseForumModal();
        });

        this.ShowMeAnotoModal = function (donation, reservedOrNot, s) {

            if (appService.isMobile) {
                postMobileServices.ShowMeAnotoModal(donation, reservedOrNot, s);
            } else {
                postWebServices.ShowMeAnotoModal(donation, reservedOrNot);
            }
        };


        /**  --  FORO DE AGRADECIMIENTOS  --  **/
        this.ShowPublicForumModal = function (data) {

            if (appService.isMobile) {
                postMobileServices.ShowPublicForumModal(data);
            } else {
                postWebServices.ShowPublicForumModal(data);
            }
        };

        this.ShowForumModal = function (donation, reservedOrNot, appreciation, s) {

            if (appService.isMobile) {
                postMobileServices.ShowForumModal(donation, reservedOrNot, appreciation, s);
            } else {
                postWebServices.ShowForumModal(donation, reservedOrNot, appreciation, s);
            }
        };

        this.CloseForumModal = function () {

            if (appService.isMobile) {
                postMobileServices.CloseForumModal();
            } else {
                postWebServices.CloseForumModal();
            }
        };

        this.ShowPrivateChatModal = function (donation, reservedOrNot, calificationCallback, s) {


            if (appService.isMobile) {
                postMobileServices.ShowPrivateChatModal(donation, reservedOrNot, calificationCallback, s);
            } else {
                postWebServices.ShowPrivateChatModal(donation, reservedOrNot, calificationCallback);
            }
        };

        this.ShowAppreciationModal = function (donation, callback) {

            if (appService.isMobile) {
                postMobileServices.ShowAppreciationModal(donation, callback);
            } else {
                postWebServices.ShowAppreciationModal(donation, callback);
            }
        };

        this.EditDonationModal = function (donation, callback) {

            if (appService.isMobile) {
                postMobileServices.EditDonationModal(donation, callback);
            } else {
                postWebServices.EditDonationModal(donation, callback);
            }
        };

        this.ShowCalificationPage = function (donation, result, callback, s) {

            if (appService.isMobile) {
                postMobileServices.ShowCalificationPage(donation, result, callback, s);
            } else {
                postWebServices.ShowCalificationPage(donation, result, callback, s);
            }
        };


        this.ShowCalificationModal = function (donation, result, callback, s, reservedOrNot) {

            if (appService.isMobile) {
                postMobileServices.ShowCalificationPage(donation, result, callback, s);
            } else {
                postWebServices.ShowCalificationModal(donation, result, callback, s, reservedOrNot);
            }
        };

        this.NewDonation = function () {
            if (appService.isMobile) {
                postMobileServices.NewDonation();
            } else {
                postWebServices.NewDonation();
            }
        };
        // endregion

        /*  SHARE  */
        this.ShowShareLinks = function (show, e) {
            if (show) {
                e.addClass('collapse');
                e.addClass('in');
            } else {
                e.removeClass('collapse');
                e.removeClass('in');
            }
        };
    }
]);
