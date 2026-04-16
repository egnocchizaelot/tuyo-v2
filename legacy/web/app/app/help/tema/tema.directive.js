'use strict'

angular.module('help')
.directive('tema', ['API', '$state', '$window', '$sanitize', '$sce',
    function (API, $state, $window, $sanitize, $sce) {
        const scope = {
        }

        const link = function (scope, element, attr) {
            $window.scrollTo(0,0);
            scope.backPath = $state.href('app.help', {s: 'faq'});

            scope.loadData = function () {
                if (scope.tema.topic_video){
                  scope.video = true;
                  let vidUrl = scope.tema.topic_video;
                  if (vidUrl.indexOf('watch?v=') !== -1){
                    vidUrl = vidUrl.replace('watch?v=', 'embed/');
                  }
                  scope.videoUrl = $sce.trustAsResourceUrl(vidUrl);
                }
                if (scope.tema.topic_text) {
                  scope.topictext = true;
                }
                if (scope.tema.topic_steps) {
                    scope.steps = [];
                    let text = scope.tema.topic_steps;

                    let q = text.split('1.');
                    text = q[1];

                    let c = 2;
                    while (text) {
                        q = text.split(c + '.');
                        scope.steps.push((c-1) + '. ' + q[0]);
                        text = q[1];
                        c++
                    }
                }

                if (scope.tema.topic_qa) {
                    scope.qa = [];
                    let q = scope.tema.topic_qa.split('<t>');
                    for (let i = 0; i < q.length; i++) {
                        let s = q[i].split('</t>');

                        let title = s[0];
                        let text = s[1];

                        if (!title || title === '' && !text || text === '')
                            continue;

                        if (!text || text === '' && title && title !== ''){
                            text = title;
                            title = '';
                        }

                        scope.qa.push({
                            title: title,
                            text: text
                        })
                    }
                }
            }

            // if (scope.tema !== 'none')
            //     scope.loadData()
            // else{
                API.getTopic(scope.temaId).then(function(topic){
                    scope.tema = topic;
                    scope.loadData()
                });
            // }


            scope.goToTopic = function (index) {
                let id = scope.tema.related_topics[index].id
                $state.go('app.help', { s: 'topic', t: id });
            };

            scope.goToArea = function (area) {
                $state.go('app.help', {s: area});
            };

        };


        return {
            restrict: 'E',
            templateUrl: 'app/help/tema/tema.template.html',
            controller: 'temaController',
            link: link,
            scope: scope
        }
    }
]);
