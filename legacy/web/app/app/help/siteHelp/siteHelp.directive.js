'use strict'

angular.module('help')
.directive('stieHelp', ['API', '$state', 'appService', '$window',
    function (API, $state, appService, $window) {
        const scope = {
        }

        const link = function (scope, element, attr) {

            scope.questions = {};
            scope.pageLoaded = [];
            scope.loadTopicPage = function (p) {
                p = p || 1;

                API.areaTopics(1, {page_size: appService.helpTopicsPageSize, page: p}).then(function (topics) {
                    scope.topicsLoaded = true;

                    scope.page = p;
                    scope.numPages = topics.num_pages;
                    scope.pageLoaded.push(p);

                    let inPage = [];
                    for (let i = 0; i < topics.results.length; i++)
                        inPage.push(topics.results[i]);

                    scope.questions[scope.page] = inPage;
                    scope.arrows();

                    $window.scrollTo(0,0);
                });
            }
            scope.loadTopicPage();


            scope.getPages = function () {
                return new Array(scope.numPages);
            }

            scope.goToPage = function (p) {
                if (p <= 0 || p > scope.numPages)
                    return;

                if (scope.page === p)
                    return;

                if (scope.pageLoaded.indexOf(p) === -1)
                    scope.loadTopicPage(p);
                else {
                    scope.page = p;
                    scope.arrows();
                }
            }

            scope.arrows = function () {
                if (scope.page === 1)
                    element.find('.prev').addClass('disable');
                else
                    element.find('.prev').removeClass('disable');

                if (scope.page === scope.numPages)
                    element.find('.next').addClass('disable');
                else
                    element.find('.next').removeClass('disable');
            }


            scope.goToTopic = function (index) {
                let topic = scope.questions[scope.page][index];
                $state.go('app.help', { s: 'topic', t: topic.id, topic: topic });
                // scope.$emit('openTopic', topic);
            }

            scope.goToArea = function (area) {
                $state.go('app.help', {s: area});
            };
        }

        return {
            restrict: 'E',
            templateUrl: 'app/help/siteHelp/siteHelp.template.html',
            controller: 'siteHelpController',
            link: link,
            scope: scope
        }
    }
]);
