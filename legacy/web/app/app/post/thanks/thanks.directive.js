/* global BASE_URL */
'use strict';

angular.module('post').
directive('thanksPost', ['$state', 'growl', 'API', 'Auth', 'postServices', 'appService',
    function ($state, growl, API, Auth, postServices, appService) {

        var scope = {
            donation: '='
        };

        var link = function (scope, element) {
            scope.element = element;
            scope.mediaURL = API.mediaURL;
            scope.userData = Auth.userData;

            scope.linkToShare = window.location.origin + '/#/donation/' + scope.donation.id;

            scope.applicantAppreciation = !!scope.donation.appreciation.applicant_appreciation;
            if (scope.applicantAppreciation) {
                scope.applicantMessage = scope.donation.appreciation.applicant_appreciation.message;

                //scope.applicantTime = scope.donation.appreciation.applicant_appreciation.created.replace('T', ' ');
                var appDate = new Date (scope.donation.appreciation.applicant_appreciation.created);
                scope.applicantTime = appDate.getDate() + "/" + (appDate.getMonth() + 1) + "/" + appDate.getFullYear();

                scope.applicantAppreciationCreator = scope.donation.appreciation.applicant_appreciation.creator;
                scope.applicantAppreciationId = scope.donation.appreciation.applicant_appreciation.id;

                scope.appAppInReview = scope.donation.appreciation.applicant_appreciation.state === 2;

            }

            scope.donorAppreciation = !!scope.donation.appreciation.donor_appreciation;
            if (scope.donorAppreciation) {
                scope.donorMessage = scope.donation.appreciation.donor_appreciation.message;

                //scope.donorTime = scope.donation.appreciation.donor_appreciation.created.replace('T', ' ');
                var donDate = new Date (scope.donation.appreciation.donor_appreciation.created);
                scope.donorTime = donDate.getDate() + "/" + (donDate.getMonth() + 1) + "/" + donDate.getFullYear();

                scope.donorAppreciationCreator = scope.donation.appreciation.donor_appreciation.creator;
                scope.donorAppreciationId = scope.donation.appreciation.donor_appreciation.id;

                scope.donAppInReview = scope.donation.appreciation.donor_appreciation.state === 2;
            }


            scope.whichAppreciation = function () {
                if ($state.current.name === 'app.user') {

                    if (scope.applicantAppreciation && scope.donorAppreciation) {

                        var id = $state.params.id + "";

                        var donorId = scope.donation.appreciation.donor_appreciation.creator + "";

                        scope.selected = donorId !== id ? scope.user.DONOR : scope.user.APPLICANT;
                    }

                    else if (scope.applicantAppreciation && !scope.donorAppreciation) {
                        scope.selected = scope.user.APPLICANT;
                    } else if (!scope.applicantAppreciation && scope.donorAppreciation) {
                        scope.selected = scope.user.DONOR;
                    }

                }

                else {
                    if (scope.applicantAppreciation && scope.donorAppreciation) {
                        var d = new Date(scope.donation.appreciation.donor_appreciation.created);
                        var a = new Date(scope.donation.appreciation.applicant_appreciation.created);

                        scope.selected = a > d ? scope.user.APPLICANT : scope.user.DONOR;

                    }
                    else if (scope.applicantAppreciation && !scope.donorAppreciation) {
                        scope.selected = scope.user.APPLICANT;
                    } else if (!scope.applicantAppreciation && scope.donorAppreciation) {
                        scope.selected = scope.user.DONOR;
                    }

                }
            };
            scope.whichAppreciation();



            scope.showingDonation = false;

            scope.creatorPath = $state.href('app.user', {id: scope.donation.creator.id });
            scope.selectedPath = $state.href('app.user', {id: scope.donation.selected_user.id });

            // region  --  LIKES  --
            scope.processingLike = false;
            function addLike() {
                if (scope.processingLike || scope.donation.appreciation.like) {
                    return;
                }

                scope.processingLike = true;

                var data = {
                    //'entity_type' : 'A',
                    'entity_type' : 'AH',
                    'entity_id' : scope.donation.appreciation.id
                };

                scope.donation.appreciation.like = scope.userData.id;
                scope.donation.appreciation.count_likes ++;

                API.add_like(data).then (
                    function(data) {

                        if (typeof data === 'string') {
                            if (appService.DEVELOP) {
                                growl.error(data);
                            } else {
                                growl.error('Error al darle like. Pruebe más tarde');
                            }


                            scope.donation.appreciation.like = undefined;
                            scope.donation.appreciation.count_likes --;

                            scope.processingLike = false;
                            return;
                        }

                        scope.donation.appreciation.like = data;
                        scope.processingLike = false;


                        scope.likeClick = removeLike;
                    },
                    function (err) {
                        if (appService.DEVELOP) {
                            growl.error(err);
                        } else {
                            growl.error('Error al darle like. Pruebe más tarde');
                        }

                        scope.donation.appreciation.like = undefined;
                        scope.donation.appreciation.count_likes --;

                        scope.processingLike = false;
                    }
                );
            }
            function removeLike() {
                if (scope.processingLike || !scope.donation.appreciation.like) {
                    return;
                }

                scope.processingLike = true;

                var lastLike = scope.donation.appreciation.like;
                scope.donation.appreciation.like = undefined;
                scope.donation.appreciation.count_likes --;

                API.remove_like(lastLike).then(
                    function(data) {

                        if (typeof data === 'string' && data !== 'OK') {
                            if (appService.DEVELOP) {
                                growl.error(data);
                            } else {
                                growl.error('Error al sacar el like. Pruebe más tarde');
                            }

                            scope.donation.appreciation.like = lastLike;
                            scope.donation.appreciation.count_likes ++;

                            scope.processingLike = false;
                            return;
                        }

                        scope.processingLike = false;


                        scope.likeClick = addLike;
                    },
                    function (err) {
                        if (appService.DEVELOP) {
                            growl.error(err);
                        } else {
                            growl.error('Error al sacar el like. Pruebe más tarde');
                        }

                        scope.donation.appreciation.like = lastLike;
                        scope.donation.appreciation.count_likes ++;

                        scope.processingLike = false;
                    }
                );
            }
            scope.likeClick = scope.donation.appreciation.like ? removeLike : addLike;
            // endregion

            scope.showForumModal = function () {
                // postServices.ShowForumModal(scope.donation, undefined, true);
                postServices.ShowPublicForumModal(scope.donation);
            };

            scope.showingShareLinks = false;
            scope.showShareLinks = function () {
                var el = scope.element.find('#shareLink');
                if (!el) {
                    return;
                }

                scope.showingShareLinks = !scope.showingShareLinks;
                postServices.ShowShareLinks(scope.showingShareLinks, el);
            };

            scope.changeUser = function (user) {
                switch (user) {
                    case scope.user.DONOR:
                        if (scope.donorAppreciation || !scope.donorAppreciation && scope.donation.creator.id === scope.userData.id) {
                            scope.selected = scope.user.DONOR;
                        }
                        scope.$broadcast('showSlider');
                    break;

                    case scope.user.APPLICANT:
                        if (scope.applicantAppreciation || !scope.applicantAppreciation && scope.donation.selected_user.id === scope.userData.id) {
                            scope.selected = scope.user.APPLICANT;
                        }
                        scope.$broadcast('showSlider');

                    break;
                }
            };

            scope.linkCopied = function () {
                growl.success('Link copiado');
            };


            // region --  SLIDE  --
            scope.getApplicantImages = function (files) {
                scope.applicantSliderImages = [];

                var images = files ? files : scope.donation.appreciation.applicant_appreciation.files;

                if (images === undefined) {
                    return;
                }


                for (var k = 0; k < images.length; k++) {
                    var i = images[k];

                    scope.applicantSliderImages.push(scope.mediaURL + i.file_url);
                }
            };

            scope.getDonorImages = function (files) {
                scope.donorSliderImages = [];

                var images = files ? files : scope.donation.appreciation.donor_appreciation.files;

                if (images === undefined) {
                    return;
                }

                for (var k = 0; k < images.length; k++) {
                    var i = images[k];

                    scope.donorSliderImages.push(scope.mediaURL + i.file_url);
                }
            };

            if (scope.applicantAppreciation) {
                scope.getApplicantImages();
            }

            if (scope.donorAppreciation) {
                scope.getDonorImages();
            }


            scope.makeAppreciation = function () {
                postServices.ShowAppreciationModal(scope.donation);
            };


            scope.$on('readyToShowSlider', function() {

                scope.$broadcast('showSlider');
            });

            scope.$on('showIt', function () {
                scope.$broadcast('showSlider');
            });
            // endregion

            /*  DONATION && APPRECIATION  */
            scope.showDonation = function () {
                scope.showingDonation = true;
                scope.$broadcast('showIt');
            };

            scope.$on('back', function () {
                 scope.showingDonation = false;
                 scope.$broadcast('showSlider');
             });

             // region  --  REAL TIME UPDATE --
             scope.appreciationChanged = function (donation) {

                scope.$broadcast('donationChanged', donation);


                //if (!scope.applicantAppreciation) {
                    scope.applicantAppreciation = !!donation.appreciation.applicant_appreciation;
                    if (scope.applicantAppreciation) {
                        scope.applicantMessage = donation.appreciation.applicant_appreciation.message;

                        var appChangedDate = new Date (donation.appreciation.applicant_appreciation.created);
                        scope.applicantTime = appChangedDate.getDate() + "/" + (appChangedDate.getMonth() + 1) + "/" + appChangedDate.getFullYear();

                        scope.getApplicantImages(donation.appreciation.applicant_appreciation.files);

                        scope.appAppInReview = donation.appreciation.applicant_appreciation.state === 2;
                    }
                //}



                //if (!scope.donorAppreciation) {
                    scope.donorAppreciation = !!donation.appreciation.donor_appreciation;
                    if (scope.donorAppreciation) {
                        scope.donorMessage = donation.appreciation.donor_appreciation.message;

                        var donChangedDate = new Date (donation.appreciation.donor_appreciation.created);
                        scope.donorTime = donChangedDate.getDate() + "/" + (donChangedDate.getMonth() + 1) + "/" + donChangedDate.getFullYear();

                        scope.getDonorImages(donation.appreciation.donor_appreciation.files);

                        scope.donAppInReview = donation.appreciation.donor_appreciation.state === 2;

                    }
                //}

                scope.donation.appreciation.like = donation.appreciation.like;
                scope.donation.appreciation.count_likes = donation.appreciation.count_likes;
                scope.donation.appreciation.public_messages_count= donation.appreciation.public_messages_count;

             };

            scope.$on('newAppreciationCreated', function (e) {

               if (!scope.applicantAppreciation) {
                    scope.applicantAppreciation = !!scope.donation.appreciation.applicant_appreciation;
                    if (scope.applicantAppreciation) {
                        scope.applicantMessage = scope.donation.appreciation.applicant_appreciation.message;

                        var newAppDate = new Date (scope.donation.appreciation.applicant_appreciation.created);
                        scope.applicantTime = newAppDate.getDate() + "/" + (newAppDate.getMonth() + 1) + "/" + newAppDate.getFullYear();

                        scope.applicantAppreciationCreator = scope.donation.appreciation.applicant_appreciation.creator;
                        scope.applicantAppreciationId = scope.donation.appreciation.applicant_appreciation.id;

                        scope.getApplicantImages();
                    }
                }

                if (!scope.donorAppreciation) {
                    scope.donorAppreciation = !!scope.donation.appreciation.donor_appreciation;
                    if (scope.donorAppreciation) {
                        scope.donorMessage = scope.donation.appreciation.donor_appreciation.message;

                        var newDonDate = new Date (scope.donation.appreciation.donor_appreciation.created);
                        scope.donorTime = newDonDate.getDate() + "/" + (newDonDate.getMonth() + 1) + "/" + newDonDate.getFullYear();

                        scope.donorAppreciationCreator = scope.donation.appreciation.donor_appreciation.creator;
                        scope.donorAppreciationId = scope.donation.appreciation.donor_appreciation.id;

                        scope.getDonorImages();
                    }
                }

                e.preventDefault();
            });
             // endregion


            scope.checkIfModalShouldOpen = function () {
                if ($state.params.modalType.indexOf('Donation') !== -1){
                    scope.showDonation();
                }
                if ($state.params.modalType.indexOf('public') !== -1 && $state.params.entityId === scope.donation.public_forum.id){
                    $state.params.modalType = 'none';
                    scope.showForumModal();
                }
                else if ($state.params.modalType.indexOf('text') !== -1){
                    $state.params.modalType = 'none';
                    if (scope.userData.id === scope.applicantAppreciationCreator){
                        scope.changeUser(scope.user.DONOR);
                    }
                    else if (scope.userData.id === scope.donorAppreciationCreator){
                        scope.changeUser(scope.user.APPLICANT);
                    }
                }
            };
            angular.element(document).ready(function () {
                if ($state.params.modalType){
                    scope.checkIfModalShouldOpen();
                }
            });

            scope.funcionNotDone = function () {
                growl.info('Esta funcionalidad no está disponible por el momento');
            };

            var apiURL = BASE_URL.substring(0, BASE_URL.length-4);
            var shareLink = 'https:' + apiURL + "sharefbdon/" + scope.donation.id + '/';


            var dt = scope.donation.created.date + scope.donation.created.time;
            dt = dt.split('-').join('').split(':').join('');

            scope.twitterShareLink = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(shareLink);
            scope.facebookShareLink = shareLink + dt + '/';
            scope.linkToShare = shareLink;



        };

        return {
            restrict: 'E',
            templateUrl: 'app/post/thanks/thanks.template.html',
            controller: 'thanksPostController',
            link: link,
            scope: scope
        };
    }
]);
