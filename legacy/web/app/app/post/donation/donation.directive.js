/* global _ */
/* global BASE_URL */
'use strict';

angular.module('post').
directive('donationPost', ['growl', 'API', 'Auth', 'postServices', '$timeout', '$state', '$compile', 'appService',
    function (growl, API, Auth, postServices, $timeout, $state, $compile, appService) {
        var scope = {
            donation: '=',
            fromAppreciation: '='
        };

        var link = function (scope, element) {
            scope.appId = appService.appId;

            scope.userData = Auth.userData;
            scope.element = element;
            scope.compile = $compile;

            scope.isCreator = scope.donation.creator.id === scope.userData.id;
            scope.isApplicant = scope.donation.selected_user && scope.donation.selected_user === scope.userData.id;
            scope.alreadyApplicant = scope.donation.alredy_applicant;

            var date = scope.donation.created.date;
            date = date.split('-');
            scope.donationDate = "";
            for (var i = date.length - 1; i >= 0; i--) {
                scope.donationDate += date[i] + "/";
            }
            scope.donationDate = scope.donationDate.slice(0, -1);

            // region  --  ADD & REMOVE LIKES --
            scope.processingLike = false;
            function addLike() {
                if (scope.processingLike || scope.donation.like) {
                    return;
                }

                scope.processingLike = true;

                var data = {
                    entity_type: 'D',
                    entity_id: scope.donation.id
                };

                scope.donation.like = scope.userData.id;
                scope.donation.count_likes++;

                API.add_like(data).then(
                    function(res) {

                        if (typeof res === 'string') {
                            if (appService.DEVELOP) {
                                growl.error(res);
                            } else {
                                growl.error('Error al darle like. Pruebe más tarde');
                            }

                            scope.donation.like = undefined;
                            scope.donation.count_likes--;

                            scope.processingLike = false;
                            return;
                        }

                        scope.donation.like = res;
                        // scope.donation.count_likes ++;
                        scope.processingLike = false;
                    },
                    function (err) {
                        if (appService.DEVELOP) {
                            growl.error(err);
                        } else {
                            growl.error('Error al darle like. Pruebe más tarde');
                        }

                        scope.donation.like = undefined;
                        scope.donation.count_likes--;

                        scope.processingLike = false;
                    }
                );
                scope.likeClick = removeLike;
            }
            function removeLike() {
                if (scope.processingLike || !scope.donation.like) {
                    return;
                }

                scope.processingLike = true;

                var lastLike = scope.donation.like;
                scope.donation.like = undefined;
                scope.donation.count_likes--;

                API.remove_like(lastLike).then(
                    function(res) {

                        if (typeof res === 'string' && res !== 'OK') {
                            if (appService.DEVELOP) {
                                growl.error(res);
                            } else {
                                growl.error('Error al sacar el like. Pruebe más tarde');
                            }

                            scope.donation.like = lastLike;
                            scope.donation.count_likes++;

                            scope.processingLike = false;
                            return;
                        }

                        scope.processingLike = false;
                    },
                    function (err) {
                        if (appService.DEVELOP) {
                            growl.error(err);
                        } else {
                            growl.error('Error al sacar el like. Pruebe más tarde');
                        }

                        scope.donation.like = lastLike;
                        scope.donation.count_likes++;

                        scope.processingLike = false;
                    }
                );
                scope.likeClick = addLike;
            }
            // endregion

            scope.likeClick = scope.donation.like ? removeLike : addLike;

            scope.reserved = !!scope.donation.selected_user;
            scope.donation.pickup_description = scope.donation.pickup_description || appService.pickupDescription;

            scope.mediaURL = API.mediaURL;

            // if (scope.donation.state.name === 'Reserved')
            //     element.children().first().addClass('reservado');
            // else if (scope.donation.state.name === 'Completed')
            //     element.children().first().addClass('entregado');

            if (scope.donation.preview && appService.isMobile) {
                // scope.previewHeight = element.children().height
                $timeout(function() {
                    var previewHeight = element.children().outerHeight() - 61;
                    element.children()[0].style.height = previewHeight + 'px';
                });
            }

            scope.ranking = function () {
                var rank = Math.round(scope.donation.creator.ranking);
                return Array.apply(0, new Array(rank));
            };


            scope.charactersShown = 200;
            scope.showMore = scope.donation.description.length > scope.charactersShown ? true : false;
            scope.showingDescription = scope.showMore ? scope.donation.description.substring(0, scope.charactersShown) + "... " : scope.donation.description;

            scope.showAll = function () {
                scope.showingDescription = scope.donation.description;
                scope.showMore = false;
            };


            // region  --  CAROUSEL STUFF  --
            scope.getSliderImages = function () {
                scope.sliderImages = [];

                var images = scope.donation.files.slice();
                for (var k = 0; k < images.length; k++) {
                    var img = images[k];

                    if (scope.donation.preview) {
                        scope.sliderImages.push(img);
                    } else {
                        scope.sliderImages.push(scope.mediaURL + img.file_url);
                    }
                }

                scope.shareImage = scope.sliderImages.length > 0 ? scope.sliderImages[0] : scope.mediaURL + '/media/sin_foto.png';

                if (scope.donation.preview) {
                    element.children(':first').removeClass('margin-bottom');
                    element.children(':first').addClass('preview-margin-bottom');
                }
            };
            scope.getSliderImages();

            scope.imagesChange = function() {

                scope.element.find('#slider').remove();

                scope.getSliderImages();

                var newSlider = angular.element("<the-slider id='slider' images='sliderImages'></the-slider>");
                var container = scope.element.find('#sliderContainer');
                container.append(newSlider);
                scope.compile(newSlider)(scope);

            };

            scope.$on('imagesChange', function () {
                scope.imagesChange();
            });

            scope.$on('readyToShowSlider', function() {
                scope.$broadcast('showSlider', scope.sliderImages);
                $timeout(function() { $(window).trigger('resize'); });
            });

            scope.removeSlick = function () {
                scope.element.find('#slider').remove();
            };
            // endregion

            /* APPRECIATIONS */
            scope.backToAppreciation = function () {
                scope.$emit('back');
            };


            // region  --  CHANGE DONATION STATES  --
            scope.reservedOrNot = function(result, sender, chat) {
                switch (result) {
                    case 'Published':
                        scope.donation.state.id = 2;
                        scope.donation.state.name = 'Published';

                        if (scope.isCreator && scope.donation.selected_user && !sender) {
                            growl.success("Se le sacó la reserva a " + scope.donation.selected_user.full_name);
                        }

                        scope.donation.selected_user = undefined;
                        scope.reserved = false;
                    break;

                    case 'Reserved':
                        scope.donation.state.id = 4;
                        scope.donation.state.name = 'Reserved';

                        scope.donation.selected_user = sender;
                        scope.reserved = true;

                        if (chat && scope.isCreator) {
                            growl.success("Has reservado tu artículo para " + sender.full_name);
                            postServices.CloseForumModal();
                            scope.showPrivateChat();
                        }
                    break;

                    case 'Completed':
                        scope.donation.state.id = 5;
                        scope.donation.state.name = 'Completed';
                    break;

                    case 'OpenChat':
                        postServices.CloseForumModal();
                        scope.showPrivateChat();
                    break;
                }

                scope.blackSign();
            };
            // endregion


            scope.deleteDonation = function () {
                API.deleteDonation(scope.donation.id).then(
                    function () {
                        // scope.removeSlick();
                        scope.donation.deleted = true;
                        scope.element.remove();
                        scope.$emit('deletedDonation', scope.donation.id);

                        growl.success("La publicación ha sido eliminada con éxito.");
                    }
                );
            };

            // region  --  MODALS  --

            scope.thisPath = $state.current.name;

            scope.showMeAnotoModal = function() {
                if (scope.donation.already_applicant) {
                    postServices.ShowForumModal(scope.donation, scope.reservedOrNot, scope.thisPath);
                    return;
                }

                postServices.ShowMeAnotoModal(scope.donation, scope.reservedOrNot, scope.thisPath);
            };

            scope.showForumModal = function () {
                scope.toggleMeAnotoButton();
                if (scope.donation.mandatory && !scope.donation.already_applicant && scope.donation.state.name === 'Published' && !scope.isCreator) {
                    postServices.ShowMeAnotoModal(scope.donation, scope.reservedOrNot, scope.thisPath);
                }
                else {
                    postServices.ShowForumModal(scope.donation, scope.reservedOrNot, scope.thisPath);
                }
            };

            scope.showAppreciationModal = function () {
                if (scope.isCreator || scope.donation.selected_user.id === scope.userData.id) {
                    postServices.ShowAppreciationModal(scope.donation,
                        function(){
                            scope.donation.already_rate = true;
                        }
                    );
                } else {
                    $state.go('app.user', {id: scope.donation.selected_user.id});
                }
            };

            scope.showPrivateChat = function () {
                if (!scope.reserved) {
                    scope.showForumModal();
                } else {
                    if (scope.isCreator || scope.donation.selected_user.id === scope.userData.id) {
                        scope.donation.unread_private_messages_count = 0;
                        postServices.ShowPrivateChatModal(scope.donation, scope.reservedOrNot, function() {
                            scope.showAppreciationModal();
                        }, scope.thisPath);
                    }
                    else {
                        $state.go('app.user', {id: scope.donation.selected_user.id});
                    }
                }
            };

            scope.editDonation = function () {
                if (!scope.isCreator) {
                    return;
                }

                postServices.EditDonationModal(scope.donation, function() {
                    scope.showMore = scope.donation.description.length > scope.charactersShown;
                    scope.showingDescription = scope.showMore ? scope.donation.description.substring(0, scope.charactersShown) + "... " : scope.donation.description;
                    scope.imagesChange();
                });

            };
            // endregion

            // region  --  BLACK INFO BOXES  --
            scope.showingShareLinks = false;
            scope.showShareLinks = function () {
                scope.element.find('#otherInfo').css('display', 'none');

                scope.showingShareLinks = !scope.showingShareLinks;
                var show = scope.showingShareLinks;
                var e = scope.element.find('#shareLink');

                postServices.ShowShareLinks(show, e);
            };

            scope.hideOtherInfo = function() {
                scope.element.find('#otherInfo').css('display', 'none');
            };

            scope.blackSign = function () {
                if (scope.isCreator) {
                    if (scope.donation.state.name === 'Completed' && !scope.donation.appreciation){
                        scope.information = 'Felicitaciones por tu entrega';
                        scope.infoButton = 'Agradecer';
                        scope.infoButtonClick = scope.showAppreciationModal;
                    }
                    else if (scope.donation.state.name === 'Published' && scope.donation.applicants_count && !scope.donation.selected_user) {
                        scope.information = '¡Tu publicación ya tiene interesados!';
                        scope.infoButton = 'Elige el destinatario';
                        scope.infoButtonClick = scope.showForumModal;
                    }
                }
                else if (scope.isApplicant){
                    if (scope.donation.state.name === 'Completed' && !scope.donation.appreciation) {
                        scope.information = 'Felicitaciones por haber recibido esta donación';
                        scope.infoButton = 'Agradecer';
                        scope.infoButtonClick = scope.showAppreciationModal;
                    }

                }
            };

            scope.blackSign();

            if (scope.information) {
                scope.element.find('#otherInfo').css('display', 'block');
            }

            // endregion



            scope.$on('showIt', function () {
                $timeout( function() {
                    scope.$broadcast('showSlider', scope.sliderImages);
                });
            });

            scope.goToProfile = function () {
                if (scope.donation.preview) {
                    return;
                }

                return $state.href('app.user', {id: scope.donation.creator.id});
            };

            scope.goToReserved = function () {
                return $state.href('app.user', {id: scope.donation.selected_user.id});

            };


            // region  --  REAL TIME CHANGES  --
            scope.$on("donationChanged", function(smth, donation) {
                scope.donationChanged(donation);
            });

            scope.reporting = false;
            scope.$on("reporting", function(e, r) {
                scope.reporting = r;
            });


            scope.donationChanged = function (donation) {

                if (scope.reporting) {
                    return;
                }

                if (donation.state.id === 1 || donation.state.id === 6 || donation.state.id === 8 || donation.state.id === 7) {
                    scope.donation.deleted = true;
                    scope.element.remove();
                    scope.$emit('deletedDonation', scope.donation.id);
                }

                scope.donation.description = donation.description;
                scope.showMore = scope.donation.description.length > scope.charactersShown;
                scope.showingDescription = scope.showMore ? scope.donation.description.substring(0, scope.charactersShown) + "... " : scope.donation.description;

                scope.donation.pickup_description = donation.pickup_description;
                scope.donation.mandatory = donation.mandatory;

                if (donation.user_applicants) {
                    scope.donation.user_applicants = donation.user_applicants;
                }

                scope.donation.already_applicant = donation.already_applicant;
                scope.alreadyApplicant = scope.donation.alredy_applicant;

                scope.donation.selected_user = donation.selected_user;
                scope.isApplicant = scope.donation.selected_user && scope.donation.selected_user === scope.userData.id;
                scope.reserved = !!scope.donation.selected_user;

                if (scope.donation.state.name !== donation.state.name) {
                    scope.donation.state = donation.state;
                    scope.donation.prior_state = donation.prior_state;

                    scope.reservedOrNot(scope.donation.state.name, scope.donation.selected_user);
                }

                if (donation.rate_id) {
                    scope.donation.rate_id = donation.rate_id;
                }

                scope.donation.addresses = donation.addresses;

                scope.donation.applicants_count = donation.applicants_count;
                scope.donation.count_likes = donation.count_likes;

                scope.donation.unread_public_messages_count = donation.unread_public_messages_count;
                scope.donation.unread_private_messages_count = donation.unread_private_messages_count;


                var differentImages = false;

                if (scope.donation.files && scope.donation.files.length !== donation.files.length) {
                    differentImages = true;
                } else {
                    var c = 0;
                    for (var j = 0; j < scope.donation.files.length; j++) {
                        var id = scope.donation.files[j].id;
                        if (!_.find(donation.files, { id: id })) {
                            differentImages = true;
                            break;
                        }
                        c++;
                    }
                    if (c !== donation.files.length) {
                        differentImages = true;
                    }
                }

                if (differentImages) {
                    scope.donation.files = donation.files;
                    scope.imagesChange();
                }

                if (!scope.donation.appreciation && donation.appreciation) {
                    scope.donation.appreciation = donation.appreciation;
                }

                scope.donation.date_modified = donation.date_modified;

                scope.donation.public_forum.state = donation.public_forum.state;

            };

            scope.$on("donationDescriptionChanged", function() {
                scope.showMore = scope.donation.description.length > scope.charactersShown;
                scope.showingDescription = scope.showMore ? scope.donation.description.substring(0, scope.charactersShown) + "... " : scope.donation.description;
            });
            // endregion

            // region  --  SHARE  --
            scope.linkCopied = function () {
                growl.success('Se ha copiado link para el ofrecimiento en su portapapeles.');
            };

            scope.facebookShare = function () {
                scope.showLoading = true;
                scope.loadingData = {};
                scope.loadingData.text = "Compartiendo en facebook";

                API.shareFacebook({ donation_id: scope.donation.id}).then(
                    function(result) {

                        scope.showLoading = false;

                        switch (result) {
                            case 200:
                                growl.success("Se compartió esta publicación en Facebook");
                                break;

                            case 503:
                                growl.info("Hubo un error en Facebook. Por favor pruebe más tarde");
                                break;

                            default:
                                growl.info("No pudimos compartir la publicación. Por favor pruebe más tarde");
                        }
                    }
                );

                // growl.success('Se ha copiado un link que puede utilizar en Facebook en su portapapeles.');

            };

            scope.linkToShare = undefined; // = window.location.origin + '/#/donation/' + scope.donation.id;
            scope.facebookShareLink = undefined;
            scope.twitterShareLink = undefined;

            scope.getShareLinks = function() {
                var apiURL = BASE_URL.substring(0, BASE_URL.length-4);
                var link = 'https:' + apiURL + "sharefbdon/" + scope.donation.id + '/';

                scope.twitterShareLink = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(link);

                var dt = scope.donation.created.date + scope.donation.created.time;
                dt = dt.split('-').join('').split(':').join('');

                scope.facebookShareLink = link + dt + '/';
                scope.linkToShare = link;
            };
            scope.getShareLinks();
            // endregion

            scope.checkIfModalShouldOpen = function () {
                if ($state.params.modalType.indexOf('public') !== -1){
                    $state.params.modalType = 'none';
                    scope.showForumModal();
                }
                else if ($state.params.modalType.indexOf('private') !== -1 && !scope.fromAppreciation){
                    $state.params.modalType = 'none';
                    scope.showPrivateChat();
                }
                else if ($state.params.modalType.indexOf('rate') !== -1){
                    $state.params.modalType = 'none';
                    scope.showAppreciationModal();
                }
            };

            angular.element(document).ready(function () {
                if ($state.params.modalType && $state.params.modalType.indexOf('Donation') !== -1){
                    scope.checkIfModalShouldOpen();
                }
            });

            scope.toggleMeAnotoButton = function(){
                var elem = element.find('.me-anoto');
                if (elem.hasClass('btn-line-green')){
                    elem.removeClass('btn-line-green');
                    elem.addClass('btn-primary');
                }
                else{
                    elem.addClass('btn-line-green');
                    elem.removeClass('btn-primary');
                }
            };

            scope.$on('updateButtonStatus', function(){
                scope.toggleMeAnotoButton();
            });


            scope.funcionNotDone = function () {
                growl.info('Esta funcionalidad no está disponible por el momento');
            };

            scope.$on('openChatOnPage', function() {
                scope.showPrivateChat();
            });

        };

        return {
            restrict: 'E',
            templateUrl: 'app/post/donation/donation.template.html',
            controller: 'donationPostController',
            link: link,
            scope: scope
        };
    }
]);
