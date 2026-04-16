'use strict';

angular.module('post').
directive('notice', ['Auth', 'API', 'appService', 'growl', 'postServices', '$sce',
    function (Auth, API, appService, growl, postServices, $sce) {

        var scope = {
            notice: '=',
        };

        var link = function (scope) {

            scope.htmlText = $sce.trustAsHtml(scope.notice.text);

            scope.userData = Auth.userData;

            var date = new Date(scope.notice.created);
            scope.noticeDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

            // region  --  ADD & REMOVE LIKES --
            scope.processingLike = false;
            function removeLike() {
                if (scope.processingLike || !scope.notice.like) {
                    return;
                }

                scope.processingLike = true;

                var lastLike = scope.notice.like;
                scope.notice.like = undefined;
                scope.notice.count_likes--;

                API.remove_like(lastLike).then(
                    function(res) {

                        if (typeof res === 'string' && res !== 'OK') {
                            if (appService.DEVELOP) {
                                growl.error(res);
                            } else {
                                growl.error('Error al sacar el like. Pruebe más tarde');
                            }

                            scope.notice.like = lastLike;
                            scope.notice.count_likes++;

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

                        scope.notice.like = lastLike;
                        scope.notice.count_likes++;

                        scope.processingLike = false;
                    }
                );
                scope.likeClick = addLike;
            }

            function addLike() {
                if (scope.processingLike || scope.notice.like) {
                    return;
                }

                scope.processingLike = true;

                var data = {
                    entity_type: 'N',
                    entity_id: scope.notice.id
                };

                scope.notice.like = scope.userData.id;
                scope.notice.count_likes++;

                API.add_like(data).then(
                    function(res) {
                        if (typeof res === 'string') {
                            if (appService.DEVELOP) {
                                growl.error(res);
                            } else {
                                growl.error('Error al darle like. Pruebe más tarde');
                            }

                            scope.notice.like = undefined;
                            scope.notice.count_likes--;

                            scope.processingLike = false;
                            return;
                        }

                        scope.notice.like = res;
                        // scope.notice.count_likes ++;
                        scope.processingLike = false;
                    },
                    function (err) {
                        if (appService.DEVELOP) {
                            growl.error(err);
                        } else {
                            growl.error('Error al darle like. Pruebe más tarde');
                        }

                        scope.notice.like = undefined;
                        scope.notice.count_likes--;

                        scope.processingLike = false;
                    }
                );
                scope.likeClick = removeLike;
            }

            scope.likeClick = scope.notice.like ? removeLike : addLike;

            // endregion

            // region  --  FORUM  --
            scope.showForumModal = function () {
                postServices.ShowPublicForumModal(scope.notice);
            };
            // endregion




            // region --  AUTOMATIC UPDATE  --
            scope.$on("noticeChanged", function(smth, notice) {
                scope.noticeChanged(notice);
            });

            scope.noticeChanged = function (notice) {
                scope.notice.file_url = notice.file_url;
                scope.notice.title = notice.title;
                scope.notice.text = notice.text;
                scope.notice.date_modified = notice.date_modified;
                scope.notice.count_likes = notice.count_likes;
                scope.notice.public_messages_count = notice.public_messages_count;
            };
            // endregion


        };

        return {
            restrict: 'E',
            templateUrl: 'app/post/notice/notice.template.html',
            controller: 'noticeController',
            link: link,
            scope: scope
        };

    }
]);
