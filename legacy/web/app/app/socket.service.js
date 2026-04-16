'use strict'

angular.module('TuyoTools')
.service('socketService', ['appService', '$cookies',
    function (appService, $cookies) {

        this.tryToLoad = function(that) {

            if (typeof io == 'undefined') {
                $.getScript(SCRIPT_SRC)
                    .done(function( script, textStatus ){
                        clearInterval(loadInterval);
                        that.socket = io.connect(appService.socketServer, { path: SOCKET_PATH });
                        that.setSocketCalls();
                    })
                    .fail(function( jqxhr, settings, exception ) {

                    }
                );
            }
        }

        var loadInterval = setInterval(this.tryToLoad, 1000, this);

        //  --  DONATIONS UPDATE  --  //
        this.donationsCallbacks = {};
        this.socketCalls = [];

        this.donationChanged = function (id, lastUpdate, callback, notice) {
            if (!this.socket)
                return;

            if (this.socketCalls.indexOf(id) !== -1)
                return;


            var token = $cookies.get('Authorization');

            this.donationsCallbacks[id] = callback;
            if (!notice)
                this.socket.emit('donation changed', { id, lastUpdate, token });
            else
                this.socket.emit('notice changed', { id, lastUpdate, token });


            this.socketCalls.push(id);
        }

        this.removeCallback = function(id) {
            if (this.donationsCallbacks.id)
                delete this.donationsCallbacks[id];
        }


        //  --  NEW DONATIONS  --  //
        this.newDonationsCallback;
        this.newDonationsCall = false;

        this.newDonations = function (date, filter) {

            if (!this.socket)
                return;

            if (this.newDonationsCall)
                return;

            var token = $cookies.get('Authorization');
            this.socket.emit('new donations', { date, filter, token });

            this.newDonationsCall = true;
        }


        //  --  NEW FORUM MESSAGES  --  //
        this.forumCallback;
        this.chatCallback;
        this.forumType;
        this.forumCall = false;

        this.newMessages = function (type, id, lastMessage, lastUpdate, parents) {
            if (!this.socket)
                return;

            if (this.forumCall)
                return;

            this.forumType = type;
            var token = $cookies.get('Authorization');
            if (type === 'forum')
                this.socket.emit('forum messages', { id, lastMessage, lastUpdate, token, parents });

            if (type === 'chat')
                this.socket.emit('chat messages', { id, lastMessage, lastUpdate, token, parents });

            this.forumCall = true;
        }


        //  --  NOTIFICATIONS  --  //
        this.notificationCallback;
        this.notificationCall = false;

        this.newNotifications = function(lastUpdate) {
            if (!this.socket)
                return;

            if (this.notificationCall)
                return;

            var token = $cookies.get('Authorization');

            this.socket.emit('new notifications', { lastUpdate, token });

            this.notificationCall = true;
        }

        this.setSocketCalls = function () {

            if (!this.socket) return;

            //  --  DONATIONS UPDATE  --  //
            this.socket.on('it changed', (data) => {
                let i = this.socketCalls.indexOf(data.id);
                if (i === -1)
                    return;

                this.socketCalls.splice(i, 1);


                if (!data.donation || !this.donationsCallbacks[data.id])
                    return;

                this.donationsCallbacks[data.id](data.donation);
                this.removeCallback(data.id);

            });

            this.socket.on('notice changed', (data) => {
                let i = this.socketCalls.indexOf(data.id);
                if (i === -1)
                    return;

                this.socketCalls.splice(i, 1);

                if (!data.notice || !this.donationsCallbacks[data.id])
                    return;

                this.donationsCallbacks[data.id](data.notice);
                this.removeCallback(data.id);
            });


            //  --  NEW DONATIONS  --  //
            this.socket.on('new donations', (data) => {
                this.newDonationsCall = false;
                this.newDonationsCallback(data);
            })


            //  --  NEW FORUM MESSAGES  --  //
            this.socket.on('new messages', (data) => {

                if (typeof data === 'string')
                    return;


                if (data) {
                    if (this.forumType === 'forum' && this.forumCallback)
                        this.forumCallback(data.new_messages, data.new_deleted_messages, data.thread_new_messages, data.forum_state, data.applicants, data.selected_applicants, data.date_modified);

                    if (this.forumType === 'chat' && this.chatCallback)
                        this.chatCallback(data.new_messages, data.new_deleted_messages, data.thread_new_messages, data.forum_state, data.applicants, data.selected_applicants, data.date_modified);
                }

                this.forumCall = false;
            });


            //  --  NOTIFICATIONS  --  //
            this.socket.on('new notifications', (data) => {
                if (data && data.length > 0 && this.notificationCallback)
                    this.notificationCallback(data);

                this.notificationCall = false;
            });
        }
    }
]);
