'use strict'

angular.module('notifications').
directive('notification', ['$state','API', '$stateParams', '$rootScope',
    function ($state, API, $stateParams, $rootScope) {
        const scope = {
            notification: '='
        };

        const link = function (scope, element, attr) {

            scope.imagePath = scope.notification.thumbnail_url !== "" ? API.mediaURL + scope.notification.thumbnail_url : "assets/images/sin_foto_thumb.png";

            // scope.sendDate = scope.notification.send_date.replace('T', ' ');
            scope.MEDIAURL = API.mediaURL;
            scope.path = '#/' + scope.notification.url;
            scope.sendDate = scope.notification.created;

            if (!scope.notification.read) {
                element.find('#notif').addClass('notificacion-nueva');
            }

            scope.pathText = '';
            switch (scope.notification.type) {
                case 'DonationLikes':
                    scope.pathText = "Ver donación"
                    break;
                case 'AppreciationLikes':
                    scope.pathText = "Ver agradecimiento"
                    break;
                case 'Applicants':
                    scope.pathText = "Ver interesados"
                    break;
                case 'DonationPublicForumMessages':
                    scope.pathText = "Ver mensajess"
                    break;
                case 'SelectedApplicant':
                    scope.pathText = "Abrir chat"
                    break;
                case 'UnselectedApplicant':
                    scope.pathText = "Calificar"
                    break;
                case 'DonationStateChange':
                    scope.pathText = "Mostrar"
                    break;
                case 'Appreciations':
                    scope.pathText = "Ver agradecimiento"
                    break;
                case 'DonationPrivateForumMessages':
                    scope.pathText = "Abrir chat"
                    break;
                case 'AppreciationPublicForumMessages':
                    scope.pathText = "Mostrar"
                    break;
                case 'EmailConfirmation':
                    scope.pathText = "Mostrar"
                    break;
                case 'AdminNotification':
                    scope.pathText = "Mostrar"
                    break;
                case 'ApprovedApplication':
                    scope.pathText = "Mostrar"
                    break;
                case 'RejectedDonation':
                    scope.pathText = "Ver reglamento"
                    break;
                case 'PopupNotification':
                    scope.pathText = "Mostrar"
                    break;
                case 'UnselectedApplicantByUserElimination':
                    scope.pathText = "Calificar"
                    break;
                case 'DeferredSiteApplicants':
                    scope.pathText = "Ver interesados"
                    break;
                case 'DeferredDonationPublicForumMessages':
                    scope.pathText = "Ver mensajess"
                    break;
                case 'DeferredDonationPrivateForumMessages':
                    scope.pathText = "Abrir chat"
                    break;
                case 'EmailApplicants':
                    scope.pathText = "Mostrar"
                    break;
                case 'DonationStateChangeToCompleted':
                    scope.pathText = "Calificar"
                    break;
                case 'DonationStateChangeToInReview':
                    scope.pathText = "Ver más"
                    break;
                case 'AppreciationStateChangeToInReview':
                    scope.pathText = "Ver más"
                    break;
            }

            scope.goTo = function (e) {

                // scope.$broadcast('notificationRead', scope.notification.id)
                // scope.notification.read = true;
                element.find('#notif').removeClass('notificacion-nueva');

                let hashUrl = window.location.hash;
                let targetUrl = '#/' + scope.notification.url;

                let idp = scope.notification.url.split('/')[1];
				let itemId = idp.split('?')[0];

                let forumType = 'none';
                let goToProfile = false;
                let goToNotification = false;
                let goToHelp = false;
                let myProfile = false;

                let openChat = false;
                let params = scope.notification.url.split('?')[1]
                if (params) {
                    params = params.split('&');
                    for (let i = 0; i < params.length; i++) {
                        let p = params[i].split('=');
                        if (p[0] !== 'open_chat')
                            continue;

                        openChat = p[1] === "1" ? true : false;
                    }
                }


                switch (scope.notification.type) {
                    case 'DonationLikes':
                        // Do nothing, just show donation
                        break;
                    case 'AppreciationLikes':
                      // Do nothing, just show appreciation
                        break;
                    case 'Applicants':
                        forumType = 'publicDonation';
                        break;
                    case 'DonationPublicForumMessages':
                        forumType = 'publicDonation';
                        break;
                    case 'SelectedApplicant':
                          forumType = 'privateDonation';
                          // Do nothing, just show donation
                        break;
                    case 'UnselectedApplicant':
                        goToProfile = true;
                        break;
                    case 'DonationStateChange':
                        forumType = 'rateDonation';
                        targetUrl = '#/donation/' + scope.notification.entity_id;
                        break;
                    case 'Appreciations':
                        forumType = 'textAppreciation';
                        break;
                    case 'DonationPrivateForumMessages':
                        forumType = 'privateDonation';
                        break;
                    case 'AppreciationPublicForumMessages':
                        forumType = 'publicAppreciation';
                        break;
                    case 'EmailConfirmation':
                        goToProfile = true;
                        myProfile = true;
                        break;
                    case 'AdminNotification':
                        goToNotification = true;
                        break;
                    case 'ApprovedApplication':
                        // Do nothing, just show donation
                        break;
                    case 'RejectedDonation':
                        // Do nothing, just show donation
                        break;
                    case 'PopupNotification':
                        goToNotification = true;
                        break;
                    case 'UnselectedApplicantByUserElimination':
                        goToProfile = true;
                        break;
                    case 'DeferredSiteApplicants':
                        // Do nothing, just show donation
                        break;
                    case 'DeferredDonationPublicForumMessages':
                        // Do nothing, just show donation
                        break;
                    case 'DeferredDonationPrivateForumMessages':
                        // Do nothing, just show donation
                        break;
                    case 'EmailApplicants':
                        // Do nothing, just show donation
                        break;
                    case 'DonationStateChangeToCompleted':
                        goToProfile = true;
                        break;
                    case 'DonationStateChangeToInReview':
                        goToHelp = 46
                        break;
                    case 'AppreciationStateChangeToInReview':
                        goToHelp = 47
                        break;
                }



                //since we are reloading or redirecting
                if (hashUrl === targetUrl){
                    $stateParams.modalType = forumType;
                    $stateParams.entityId = scope.notification.entity_id;
                    $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                }
                else {
                    if (e.which === 1){
                        if (goToProfile){
                            if (myProfile)
                                $state.go('app.user');
                            else
                                $state.go('app.user', {id: itemId});
                        }
                        else if (goToNotification){
                            $state.go('app.notification', {id: itemId});
                        }
                        else if (goToHelp) {
                            $state.go('app.help', { s: 'topic', t: goToHelp });
                        }
                        else{
                            $state.transitionTo('app.donation',
                              { donationId: itemId, entityId: scope.notification.entity_id, modalType: forumType, openChat: openChat },
                              { reload: true, inherit: false, notify: true });
                        }
                    }
                    else if (e.which === 2){
                        var reg = new RegExp('%3f', 'gi');
                        let url = targetUrl.replace(reg, '?');
                        window.open(targetUrl, '_blank');
                    }
                }
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/notifications/notification/notification.template.html',
            controller: 'notificationController',
            link: link,
            scope: scope
        }
    }
]);
