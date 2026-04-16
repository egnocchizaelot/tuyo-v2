'use strict';

angular.module('post')
.service('donationServices', ['Auth', '$state', 'growl', 'postServices',
    function (Auth, $state, growl, postServices) {

        this.OpenPrivateChat = function (donation) {
            donation.unread_private_messages_count = 0;
            postServices.ShowPrivateChatModal(donation, this.reservedOrNot.bind(this), function() {
                this.showAppreciationModal();
            }, $state.current.name);
        };

        this.showAppreciationModal = function (donation) {
            postServices.ShowAppreciationModal(donation,
                function(){
                    donation.already_rate = true;
                }
            );
        };

        this.reservedOrNot = function(result, sender, chat, donation) {
            var isCreator = donation.creator.id === Auth.userData.id;

            switch (result) {
                case 'Published':
                    donation.state.id = 2;
                    donation.state.name = 'Published';

                    if (isCreator && donation.selected_user && !sender) {
                        growl.success("Se le sacó la reserva a " + donation.selected_user.full_name);
                    }

                    donation.selected_user = undefined;
                break;

                case 'Reserved':
                    donation.state.id = 4;
                    donation.state.name = 'Reserved';

                    donation.selected_user = sender;

                    if (chat && isCreator) {
                        growl.success("Has reservado tu artículo para " + sender.full_name);
                        postServices.CloseForumModal();
                        this.OpenPrivateChat(donation);
                    }
                break;

                case 'Completed':
                    donation.state.id = 5;
                    donation.state.name = 'Completed';
                break;

                case 'OpenChat':
                    postServices.CloseForumModal();
                    this.OpenPrivateChat(donation);
                break;
            }

        };

    }
]);
