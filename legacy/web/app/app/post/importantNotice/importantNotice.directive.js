'use strict';

angular.module('post').
directive('importantNotice', ['API', 'growl', '$sce',
    function (API, growl, $sce) {

        var scope = {
            notice: '='
        };

        var link = function (scope, element) {

            scope.htmlText = $sce.trustAsHtml(scope.notice.text);

            scope.stopShowing = function () {
                API.notShowImportantNotice(scope.notice.id).then(
                    function(data) {
                        if (!data.status) {
                            growl.error("En estos momentos no podés dejar de ver este comunicado. Por favor probá más tarde");
                            return;
                        }

                        growl.success("Ya no volveras a ver ese comunicado");
                        element.remove();
                    }
                );
            };

        };

        return {
            restrict: 'E',
            templateUrl: 'app/post/importantNotice/importantNotice.template.html',
            controller: 'importantNoticeController',
            link: link,
            scope: scope
        };

    }
]);
