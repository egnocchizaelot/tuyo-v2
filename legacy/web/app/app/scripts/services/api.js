'use strict';

angular.module('TuyoTools')
    .service('API', ['$q', '$http', '$cookies', '$state', '$localStorage', '$modalStack', 'Config', function ($q, $http, $cookies, $state, $localStorage, $modalStack, Config) {
        var API = this,
            registerEndpoint = function (id, url, diffBase, useMock) {
                var baseURL = API.baseURL;
                if (useMock) {
                    baseURL = API.mockBaseURL;
                }
                if (diffBase) {
                    baseURL = diffBase;
                }

                url = url || id;
                API.endpoints[id] = baseURL + url;
            },
            apiCall = function (endpoint, method, params, data, urlParams) {
                var time = (new Date()).getTime();
                if (endpoint !== 'send_message' && time - API.lastRequest[endpoint] < API.timeBetweenRequestsMillis) {
                    return API.pendingPromises[endpoint];
                } else {
                    API.pendingPromises[endpoint] = null;
                }

                var deferred = $q.defer(),
                    url = API.endpoints[endpoint];
                urlParams = urlParams || {};
                angular.forEach(urlParams, function (value, key) {
                    url = url.replace('$' + key, value);
                });

                if ((endpoint === 'login' && !$cookies.get('Authorization')) || $cookies.get('Authorization') || ($state.current.data && !$state.current.data.requireLogin)) {
                    $http({
                            'method': method,
                            'url': url,
                            'data': data,
                            'params': params
                        })
                        .error(function (data) {
                            if (data && data[0] === 'Acceso no Autorizado') {
                                deferred.reject(data[0]);
                            }
                            else if(data && data.detail=="Invalid token."){
                              $cookies.remove('Authorization');
                              delete $localStorage.UserData;
                              $modalStack.dismissAll('close');
                              $state.go('app.landing');
                            }
                            else if(data && data.detail && data.detail === 'You do not have permission to perform this action.'){
                              $cookies.remove('Authorization');
                              delete $localStorage.UserData;
                              $modalStack.dismissAll('close');
                              $state.go('app.landing');
                            }
                            deferred.reject();
                        })
                        .success(function (data) {
                            deferred.resolve(data);
                        });
                } else {
                    var active_modals_levelOne = angular.element('modal_level_one');
                    var active_modals_levelTwo = angular.element('modal_level_two');
                    active_modals_levelOne.modal('hide');
                    active_modals_levelTwo.modal('hide');
                    $state.go('app.landing');
                }
                API.lastRequest[endpoint] = time;
                API.pendingPromises[endpoint] = deferred.promise;
                return deferred.promise;
            };

        //Para probar mail_sender
        API.emailURL = Config.emailURL;

        API.baseURL = Config.baseURL;
        API.mediaURL = Config.mediaURL;
        API.mockBaseURL = Config.mockBaseURL;
        API.endpoints = {};
        API.pendingPromises = {};
        API.lastRequest = {};
        API.timeBetweenRequestsMillis = 500;
        API.modules = {
            Administradores: [
        'app.admins.donations',
        'app.admins.users'
      ],
            Usuarios: [
        'app.users.profile'
      ],
            Donaciones: [
        'app.donations.donation_details',
        'app.donations.donations',
        'app.donations.donation_new',
        'app.donations.donation_new_form',
        'app.insurances.donation_edit_form'
      ],
            Reportes: [
        'app.reports.reports',
        'app.reports.donations_report',
        'app.reports.users_report'
      ],
            General: [

      ]
        };

        /* USER PROFILE*/

        registerEndpoint('getUserCounts', 'profile_counts/$user_id/');
        API.getUserCounts = function (userId, params) {
            return apiCall('getUserCounts', 'GET', params, null, {user_id: userId});
        };

        registerEndpoint('getUserRanking', 'user_ranking/');
        API.getUserRanking = function (params) {
            return apiCall('getUserRanking', 'GET', params);
        };

        registerEndpoint('getUserEmailConfirm', 'user_email_confirmed/');
        API.getUserEmailConfirm = function (params) {
            return apiCall('getUserEmailConfirm', 'GET', params);
        };

        registerEndpoint('userSuggestions', 'user_config_suggestions/');
        API.setUserSuggestions = function(data, params){
            return apiCall('userSuggestions', 'POST', params, data)
        }

        registerEndpoint('myDonations', 'my_donations/');
        registerEndpoint('reservedDonations', 'my_reserved_donations/');
        registerEndpoint('wantedDonations', 'my_wanted_donations/');

        // - PRIVATE
        API.myDonations = function (params) {
            return apiCall('myDonations', 'GET', params);
        };

        API.reservedDonations = function (params) {
            return apiCall('reservedDonations', 'GET', params);
        };

        API.wantedDonations = function (params) {
            return apiCall('wantedDonations', 'GET', params);
        };

        // - ALL
        registerEndpoint('getDeliveredDonations', 'get_delivered_donations/$user_id/');
        registerEndpoint('getReceivedDonations', 'get_received_donations/$user_id/');
        registerEndpoint('getAppreciationDonations', 'get_appreciation_donations/$user_id/');

        API.getDeliveredDonations = function(userId, params) {
            return apiCall('getDeliveredDonations', 'GET', params, null, {'user_id': userId });
        };

        API.getReceivedDonations = function(userId, params) {
            return apiCall('getReceivedDonations', 'GET', params, null, {'user_id': userId });
        };

        API.getAppreciationDonations = function(userId, params) {
            return apiCall('getAppreciationDonations', 'GET', params, null, {'user_id': userId });
        };



        registerEndpoint('addresses', 'addresses/');
        registerEndpoint('manageAddresses', 'addresses/$address_id/');


        API.createAddress = function(data, params){
          return apiCall('addresses', 'POST', params, data);
        };
        API.updateAddress = function (data, addressId, params) {
            return apiCall('manageAddresses', 'PUT', params, data, {address_id: addressId});
        };
        API.deleteAddress = function (addressId, params) {
            return apiCall('manageAddresses', 'DELETE', params, null, {address_id: addressId});
        }

        registerEndpoint('tuyoLogin', 'tuyo_login/');
        registerEndpoint('tuyoRegister', 'tuyo_register/');
        registerEndpoint('checkEmail', 'check_email/');
        registerEndpoint('forgotPassword', 'forgot_password/');
        registerEndpoint('resetPassword', 'reset_password/');
        registerEndpoint('confirmEmail', 'confirm_email/');
        registerEndpoint('login', 'sociallogin/');
        registerEndpoint('logout', 'logout/');
        registerEndpoint('user_data', 'user_data/');
        registerEndpoint('user', 'users/$user_id/');
        registerEndpoint('getPublicUser', 'get_public_user/$user_id/');
        registerEndpoint('rateUser', 'rate/');
        registerEndpoint('uploadProfilePic', 'upload_profile_picture/')

        registerEndpoint('important_notices', 'important_notices/');
        registerEndpoint('notShowImportantNotice', 'important_notices/$notice_id/');

        API.notices = function (params) {
            return apiCall('important_notices', 'GET', params);
        };
        API.notShowImportantNotice = function (noticeId, params) {
            return apiCall('notShowImportantNotice', 'PUT', params, null, { notice_id: noticeId });
        };

        registerEndpoint('getNextDonations', 'get_next_elements/$date/$direction/');
        API.getNextDonations = function (date, params) {
            return apiCall('getNextDonations', 'GET', params, null, {date, direction:"down"});
        };

        registerEndpoint('getPrevDonations', 'get_next_elements/$date/$direction/');
        API.getPrevDonations = function (date, params) {
            return apiCall('getPrevDonations', 'GET', params, null, {date, direction:"up"});
        };

        registerEndpoint('getDonationContext', 'get_donation_context/$donationId/');
        API.getDonationContext = function (donationId, params) {
            return apiCall('getDonationContext', 'GET', params, null, {donationId});
        }


        registerEndpoint('donations', 'donations/');
        registerEndpoint('doDonations', 'donations/$donation_id/');
        registerEndpoint('appreciations', 'appreciations/');

        registerEndpoint('public_donation', 'donation_public_data/$donation_id/');

        registerEndpoint('likes', 'likes/');
        registerEndpoint('delete_like', 'likes/$like_id/');

        registerEndpoint('donationApplicantsAcctions', 'donation_applicants/');

        API.tuyoLogin = function (data, params) {
            return apiCall('tuyoLogin', 'POST', params, data);
        };

        API.tuyoRegister = function (data, params) {
            return apiCall('tuyoRegister', 'POST', params, data);
        };

        API.checkEmail = function (data, params) {
            return apiCall('checkEmail', 'POST', params, data);
        }

        API.forgotPassword = function (data, params) {
            return apiCall('forgotPassword', 'POST', params, data);
        }

        API.resetPassword = function (data, params) {
            return apiCall('resetPassword', 'POST', params, data);
        }

        API.confirmEmail = function (data, params) {
            return apiCall('confirmEmail', 'POST', params, data);
        }

        API.login = function (data) {
            return apiCall('login', 'POST', null, data);
        };

        API.logout = function (params) {
            return apiCall('logout', 'POST', params);
        };

        API.obtain_user_profile_data = function (params) {
            return apiCall('user_data', 'GET', params);
        };

        API.updateUser = function (data, userId, params) {
            return apiCall('user', 'PUT', params, data, {user_id: userId});
        };

        API.deleteUser = function (userId, params) {
            return apiCall('user', 'DELETE', params, null, {user_id: userId});
        };

        API.getPublicUser = function(userId, params) {
            return apiCall('getPublicUser', 'GET', params, null, {'user_id': userId });
        };

        API.rateUser = function (data, params) {
            return apiCall('rateUser', 'POST', params, data);
        };

        API.uploadProfilePic = function (data, params) {
            return apiCall('uploadProfilePic', 'POST', params, data);
        }

        API.public_donation = function (donationId, params) {
            return apiCall('public_donation', 'GET', params, null, { 'donation_id': donationId });
        }

        API.donations = function (params) {
            return apiCall('donations', 'GET', params);
        };

        API.newDonation = function (data, params) {
            return apiCall('donations', 'POST', params, data);
        };

        API.updateDonation = function (data, donationId, params) {
            return apiCall('doDonations', 'PUT', params, data, {donation_id: donationId});
        };

        API.deleteDonation = function (donationId, params) {
            return apiCall('doDonations', 'DELETE', params, null, {'donation_id': donationId});
        };

        API.donation_details = function (donationId, params) {
            return apiCall('doDonations', 'GET', params, null, {'donation_id': donationId});
        };

        //  --  SHARE  --  //
        registerEndpoint('shareFacebook', 'share_facebook/');
        API.shareFacebook = function (data, params) {
            return apiCall('shareFacebook', 'POST', params, data);
        };


        //  --  FORUMS  --  //
        registerEndpoint('appreciationForum', 'appreciation_forum/$appreciation_id/');
        registerEndpoint('donationForum', 'donation_forum/$donation_id/');
        registerEndpoint('noticeForum', 'notice_forum/$notice_id/');
        registerEndpoint('privateForum', 'private_forum/$donation_id/');

        registerEndpoint('forumUpdated', 'forum_updated/$message_id/$forum_id/$donation_datetime/$parents/');

        API.appreciationForum = function (appreciationId, params) {
            return apiCall('appreciationForum', 'GET', params, null, {'appreciation_id': appreciationId});
        };

        API.donationForum = function (donationId, params) {
            return apiCall('donationForum', 'GET', params, null, {'donation_id': donationId});
        };

        API.noticeForum = function (noticeId, params) {
            return apiCall('noticeForum', 'GET', params, null, {'notice_id': noticeId});
        };

        API.privateForum = function (donationId, params) {
            return apiCall('privateForum', 'GET', params, null, {'donation_id': donationId});
        };

        API.forumUpdated = function (messageId, forumId, lastUpdate, parents, params) {
            return apiCall('forumUpdated', 'GET', params, null, {'message_id': messageId, 'forum_id': forumId, 'donation_datetime': lastUpdate, 'parents': parents});
        };




        API.appreciations = function (params) {
            return apiCall('appreciations', 'GET', params);
        };

        API.newAppreciation = function (data, params) {
            return apiCall('appreciations', 'POST', params, data);
        };

        API.add_like = function (data, params) {
            return apiCall('likes', 'POST', params, data);
        };

        API.remove_like = function (like_id, params) {
            return apiCall('delete_like', 'DELETE', params, null, {'like_id':like_id});
        };



        API.donationApplicantsAcctions = function(data, params){
          return apiCall('donationApplicantsAcctions', 'POST', params, data);
        };


        registerEndpoint('changeDonationState', 'set_donation_state/');

        API.changeDonationState = function(data, params){
          return apiCall('changeDonationState', 'POST', params, data);
        };


        registerEndpoint('complaint', 'complaint/$entity_id/$entity_type/');

        API.complaint = function (data, entityId, entityType, params) {
            return apiCall('complaint', 'POST', params, data, {entity_id: entityId, entity_type: entityType});
        };


        registerEndpoint('resendEmail', 'resend_email_confirmation/');
        API.resendEmail = function (params) {
            return apiCall('resendEmail', 'GET', params)
        }


        registerEndpoint('notifications', 'notifications/');
        registerEndpoint('getNotification', 'notifications/$notification_id/');
        registerEndpoint('notificationsRead', 'update_unread_notifications/');

        API.notifications = function (params) {
            return apiCall('notifications', 'GET', params);
        };

        API.getNotification = function (notificationId, params) {
            return apiCall('getNotification', 'GET', params, null, { 'notification_id': notificationId });
        };

        API.notificationsRead = function (params) {
            return apiCall('notificationsRead', 'GET', params);
        };


        //  HELP  //
        registerEndpoint('areas', 'areas/', Config.helpURL);
        registerEndpoint('topics', 'topics/', Config.helpURL);
        registerEndpoint('messages', 'messages/', Config.helpURL);
        registerEndpoint('get_area_topics', 'get_area_topics/$areaId/', Config.helpURL);

        registerEndpoint('getTopic', 'topics/$topic_id/', Config.helpURL);

        API.areas = function (params) {
            return apiCall('areas', 'GET', params);
        };

        API.topics = function (params) {
            return apiCall('topics', 'GET', params);
        };

        API.messages = function (data, params) {
            return apiCall('messages', 'POST', params, data);
        };

        API.areaTopics = function (areaId, params) {
            return apiCall('get_area_topics', 'GET', params, null, { 'areaId': areaId });
        }

        API.getTopic = function (topicId, params) {
            return apiCall('getTopic', 'GET', params, null, {'topic_id': topicId});
        };

        // FILE DISPATCHER //
        registerEndpoint('fileDispatcher', 'fileDispatcher/$fileType/$fileId/')

        API.fileDispatcher = function (fileType, fileId, params) {
            return apiCall('fileDispatcher', 'GET', params, null, {
                'fileType': fileType,
                'fileId': fileId
            });
        };

        //Obtener datos del foro
        registerEndpoint('forum_details', 'forum/$forum_id/');
        //Obtener todos los foros del usuario logueado
        registerEndpoint('forums', 'get_forums/');
        //Enviar mensaje
        registerEndpoint('send_message', 'messages/');


        registerEndpoint('save_notification_settings', 'save_notification_settings/$user_id/');
        registerEndpoint('save_notification_settings_refined', 'save_notification_settings_refined/$user_id/');
        registerEndpoint('get_notifications_refined', 'get_notifications_refined/$type_id/');

        registerEndpoint('get_filters', 'get_filters/$model/');

        registerEndpoint('user_access_levels', 'user_access_levels/');
        registerEndpoint('user_roles', 'user_roles/');


        API.sendMessage = function(data, params){
          return apiCall('send_message', 'POST', params, data);
        };

        // FACEBOOK AUTH
        registerEndpoint('facebook_auth', 'facebook_auth/')

        API.sendFacebookCode = function (code){
            return apiCall('facebook_auth', 'GET', {code:code}, null, null);
        }

  }]);
