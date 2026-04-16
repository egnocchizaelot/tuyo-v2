'use strict';

angular.module('post')
.service('postMobileServices', ['$state', 'Auth', 'modalServices',
    function($state, Auth, modalServices) {

        this.RESERVEDORNOT = undefined;

        this.ShowMeAnotoModal = function (donation, reservedOrNot, s) {

            if (this.processingModal) {
                return;
            }

            s = $state.$current.self.name;

            this.processingModal = true;
            var that = this;

            var title = "¿Seguro puedes asumir el compromiso?";
            var text = "Este artículo se retira únicamente: \n" + donation.pickup_description;

            modalServices.BasicModal(title, text, function (res) {
                that.processingModal = false;

                if (res) {
                    that.ShowForumModal(donation, reservedOrNot, s);
                }
            });

        };

		/**  --  APPRECIATION FORUM  --  **/
        this.ShowPublicForumModal = function (data) {

            var s = $state.$current.self.name;
            $state.go('app.mobileModal', {
                data: {
                    donation: data,
                },
                case: 6,
                close: function () {
                    $state.go(s, {donationId: data.id});
                }
            });
        };


        this.ShowForumModal = function (donation, reservedOrNot, appreciation, s) {

            s = s || $state.$current.self.name;
            $state.go('app.mobileModal', {
                data: {
                    donation: donation,
                    reservedOrNot: reservedOrNot,
                    appreciation: appreciation
                },
                case: 3,
                close: function () {
                        $state.go(s, {donationId: donation.id});
                }
            }, { reload: true, inherit: false, notify: true });
        };

        this.CloseForumModal = function () {
        };


        this.ShowPrivateChatModal = function (donation, reservedOrNot, s) {

            var self = this;
            s = s || $state.$current.self.name;

            this.RESERVEDORNOT = reservedOrNot;

            $state.go('app.mobileModal', {
                data: {
                    donation: donation,
                    reservedOrNot: reservedOrNot
                },
                case: 4,
                close: function (result) {

                    if (!result || !result.state) {
                        $state.go(s, {donationId: donation.id});
                    }

                    self.ShowCalificationPage(donation, result, undefined, s);
                }
            });
        };


        this.ShowAppreciationModal = function (donation, s) {
            s = s || $state.$current.self.name;
            $state.go('app.mobileModal', {
                data: {
                    donation: donation,
                },
                case: 2,
                close: function () {
                    $state.go(s, {donationId: donation.id});
                }
            }, { reload: true, inherit: false, notify: true });
        };


        this.EditDonationModal = function (donation) {

            var s = $state.$current.self.name;
            $state.go('app.mobileModal', {
                data: {
                    donation: donation,
                },
                case: 1,
                close: function () {
                    $state.go(s, {donationId: donation.id});
                }
            });
        };


        this.ShowCalificationPage = function (donation, result, callback, s) {

            s = s || 'app.donations.dashboard';

            var self = this;
            if (result.state === 'delivered') {
                $state.go('app.mobileModal', {
                    data: {
                        state: 'delivered',
                        donation: donation,
                    },
                    case: 5,
                    close: function (closeResult) {

                        if (closeResult) {
                            if (callback) {
                                callback();
                            }

                            if (closeResult.res) {
                                self.ShowAppreciationModal(donation, s);
                                return;
                            }
                        }

                        if (s !== 'app.user') {
                            $state.go(s, { donationId: donation.id });
                        } else {
                            $state.go(s, { id: Auth.userData.id });
                        }

                    }
                });
            }
            else if (result.state === 'cancelled') {
                $state.go('app.mobileModal', {
                    data: {
                        state: 'cancelled',
                        donation: donation,
                        selected: result.selected
                    },
                    case: 5,
                    close: function (closeResult) {

                        if (!closeResult){
                            if (s !== 'app.user') {
                                $state.go(s, { donationId: donation.id });
                            } else {
                                $state.go(s, { id: Auth.userData.id });
                            }

                            return;
                        }

                        if (closeResult.res) {
                            self.ShowForumModal(donation, self.RESERVEDORNOT, undefined, s);
                            return;
                        }


                        if (!closeResult.done || !callback) {
                            if (s !== 'app.user') {
                                $state.go(s, { donationId: donation.id });
                            } else {
                                $state.go(s, { id: Auth.userData.id });
                            }

                            return;
                        }

                        callback();

                        $state.go(s, { id: Auth.userData.id });

                    }
                });
            }
        };

        this.NewDonation = function () {
            var s = $state.$current.self.name;
            $state.go('app.mobileModal', {
                data: {
                },
                case: 1,
                close: function (result) {
                    if (result) {
                        $state.go('app.donations.dashboard', {}, { reload: true, inherit: false, notify: true });
                    } else {
                        $state.go(s);
                    }
                }
            });
        };
    }
]);
