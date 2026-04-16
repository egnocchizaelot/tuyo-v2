'use strict';

angular.module('post')
.service('postWebServices', ['$modal', '$state', 'modalServices', '$rootScope',
    function($modal, $state, modalServices, $rootScope) {

        // region  --  MODALS  --
        this.processingModal = false;
        this.forumIsOpen = false;

        this.RESERVEDORNOT = undefined;

        this.ShowMeAnotoModal = function (donation, reservedOrNot) {

            if (this.processingModal) {
                return;
            }

            this.processingModal = true;
            var that = this;

            var title = "¿Seguro puedes asumir el compromiso?";
            var text = "Este artículo se retira únicamente: \n" + donation.pickup_description;

            modalServices.BasicModal(title, text, function (res) {
                that.processingModal = false;

                if (res) {
                    that.ShowForumModal(donation, reservedOrNot);
                }
            });

        };

        this.ShowPublicForumModal = function (data) {

            if (this.processingModal) {
                return;
            }

            this.processingModal = true;
            var that = this;

            data.showingForum = true;

            var modal = $modal.open({
                templateUrl: 'app/modals/publicForum/publicForum.template.html',
                controller: 'publicForumModalController',
                resolve: {
                    data: {
                        data: data,
                    }
                },
                // backdrop: 'static',
                animation: true
            });

            $rootScope.$emit('addToHistory');

            modal.result.then(
                // Close
                function () {
                    data.showingForum = false;
                    that.processingModal = false;
                },

                // Dissmiss
                function() {
                    data.showingForum = false;
                    that.processingModal = false;
                }
            );
        };

        this.ShowForumModal = function (donation, reservedOrNot, appreciation) {

            if (this.processingModal) {
                return;
            }

            this.processingModal = true;
            var that = this;

            donation.showingForum = true;

            var modal = $modal.open({
                templateUrl: 'app/modals/chatModal/chat.template.html',
                controller: 'chatApplicantController',
                resolve: {
                    data: {
                        donation: donation,
                        reservedOrNot: reservedOrNot,
                        appreciation: appreciation
                    }
                },
                // backdrop: 'static',
                windowClass:'bg-all-gray',
                animation: true
            });

            that.forumIsOpen = true;
            that.forumModal = modal;

            $rootScope.$emit('addToHistory');

            modal.result.then(
                // Close
                function (res) {
                    donation.showingForum = false;
                    that.processingModal = false;
                    that.forumIsOpen = false;

                    if (!res){
                      $rootScope.$broadcast('updateButtonStatus');
                      return;
                    }

                    donation.already_applicant = true;
                },

                // Dissmiss
                function() {
                    donation.showingForum = false;
                    that.processingModal = false;
                    that.forumIsOpen = false;
                    $rootScope.$broadcast('updateButtonStatus');
                }
            );
        };

        this.CloseForumModal = function () {
            if (this.forumIsOpen){
                this.processingModal = false;
                this.forumIsOpen = false;
                this.forumModal.close({result: true});
            }
        };

        this.ShowPrivateChatModal = function (donation, reservedOrNot, calificationCallback) {

            if (this.processingModal) {
                return;
            }

            this.RESERVEDORNOT = reservedOrNot;

            this.processingModal = true;
            var that = this;

            donation.showingForum = true;
            var self = this;

            var modal = $modal.open({
                templateUrl: 'app/modals/privateChat/privateChat.template.html',
                controller: 'privateChatModalController',
                resolve: {
                    data: {
                        donation: donation,
                        reservedOrNot: reservedOrNot
                    }
                },
                // backdrop: 'static',
                animation: true
            });

            $rootScope.$emit('addToHistory');

            modal.result.then(
                // Close
                function (res) {
                    donation.showingForum = false;
                    that.processingModal = false;

                    if (!res || !res.state) {
                        return;
                    }

                    if (res.state === 'cancelled') {
                        self.ShowCalificationModal(donation, res);
                    } else if (res.state === 'delivered') {
                        self.ShowCalificationModal(donation, res, calificationCallback);
                    }
                },

                // Dissmiss
                function() {
                    donation.showingForum = false;
                    that.processingModal = false;
                }
            );
        };

        this.ShowAppreciationModal = function (donation, reservedOrNot, callback) {

            if (this.processingModal) {
                return;
            }

            this.processingModal = true;
            var that = this;

            if (!donation.already_rate) {
                this.processingModal = false;
                this.ShowCalificationModal(donation, { state: 'delivered' }, callback);
                return;
            }

            var modal = $modal.open({
                templateUrl: 'app/modals/appreciation/appreciation.template.html',
                controller: 'appreciationModalController',
                resolve: {
                    donation: donation
                },
                // backdrop: 'static',
                animation: true
            });

            $rootScope.$emit('addToHistory');

            modal.result.then(
                // Close
                function () {
                    that.processingModal = false;
                    if (callback) {
                        callback();
                    }
                },

                // Dissmiss
                function() {
                    that.processingModal = false;
                    if (callback) {
                        callback();
                    }
                }
            );
        };

        this.EditDonationModal = function (donation, callback) {
            if (this.processingModal) {
                return;
            }

            this.processingModal = true;
            var that = this;

            var modal = $modal.open({
                templateUrl: 'app/modals/createDonation/createDonation.template.html',
                controller: 'modalCreateController',
                resolve: {
                    donation: donation
                },
                backdrop: 'static',
                keyboard: false,
                animation: true
            });

            $rootScope.$emit('addToHistory');

            modal.result.then(
                // Close
                function (res) {
                    that.processingModal = false;

                    if (res) {
                        callback();
                    }
                },

                // Dissmiss
                function() {
                    that.processingModal = false;
                }
            );
        };

        this.ShowCalificationModal = function (donation, result, callback, s, reservedOrNot) {

            if (this.processingModal) {
                return;
            }

            if (reservedOrNot) {
                this.RESERVEDORNOT = reservedOrNot;
            }

            this.processingModal = true;
            var that = this;
            var self = this;
            var calModal;

            if (result.state === 'delivered') {
                calModal = $modal.open({
                    templateUrl: 'app/modals/calification/confirm/calificationConfirmModal.template.html',
                    controller: 'calificationConfirmModalController',
                    resolve: {
                        donation: donation,
                    },
                    backdrop: 'static',
                    keyboard: false,
                    animation: true,
                    windowClass: 'modal-url'
                });

                $rootScope.$emit('addToHistory');

                calModal.result.then(
                    // Close
                    function (res) {
                        that.processingModal = false;

                        if (!res) {
                            return;
                        }

                        if (callback && res.done) {
                            callback();
                        }

                        if (res.res) {
                            donation.already_rate = true;
                            self.ShowAppreciationModal(donation);
                        }

                    },

                    // Dissmiss
                    function() {
                        that.processingModal = false;
                    }
                );
            }
            else if (result.state === 'cancelled') {
                calModal = $modal.open({
                    templateUrl: 'app/modals/calification/cancel/calificationCancelModal.template.html',
                    controller: 'calificationCancelModalController',
                    resolve: {
                        data: {
                            donation: donation,
                            selected: result.selected
                        }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    animation: true
                });

                $rootScope.$emit('addToHistory');

                calModal.result.then(
                    // Close
                    function (res) {
                        that.processingModal = false;

                        if (!res) {
                            return;
                        }

                        if (callback && res.done) {
                            callback(donation);
                        }

                        if (res.res) {
                            self.ShowForumModal(donation, self.RESERVEDORNOT);
                        }


                    },

                    // Dissmiss
                    function() {
                        that.processingModal = false;
                    }
                );
            }

        };

        this.NewDonation = function () {

            if (this.processingModal) {
                return;
            }

            this.processingModal = true;
            var that = this;

            var modal = $modal.open({
                    templateUrl: 'app/modals/createDonation/createDonation.template.html',
                    controller: 'modalCreateController',
                    resolve: {
                        donation: null
                    },
                    backdrop: 'static',
                    keyboard: false,
                    animation: true
                });

                modal.result.then(
                    // Close
                    function (res) {
                        that.processingModal = false;
                        if (res) {
                            $state.go('app.donations.dashboard', {}, { reload: true, inherit: false, notify: true });
                        }
                    },
                    function () {
                        that.processingModal = false;
                        // $state.go('app.donations.dashboard', {}, { reload: true, inherit: false, notify: true })
                    }
                );
        };
        // endregion

    }
]);
