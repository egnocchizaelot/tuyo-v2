'use strict'

angular.module('popUps').
directive('reportPublication', ['$document', '$modal', '$timeout',
    function ($document, $modal, $timeout) {
        let scope = {
            entityId: '=',
            type: '@type'
        };

        const link = function (scope, element, attr) {

            scope.element = element;

            scope.showing = false;
            scope.menu = element.find('#reportMenu');

            $document.on('click', function (e) {
                if (!scope.showing)
                    return;

                if (element !== e.target && !element[0].contains(e.target))
                    scope.Show();
            });

            scope.Show = function () {
                scope.showing = !scope.showing;

                if (scope.showing) {
                    scope.menu.addClass('collapse');
                    scope.menu.addClass('in');
                    if (scope.type === 'A'){
                      scope.menu.addClass('report-appreciation');
                    }
                }else{
                    scope.menu.removeClass('in');
                    if (scope.type === 'A'){
                      scope.menu.removeClass('report-appreciation');
                    }
                }
            }

            scope.$on('hide', function (e, text) {
                scope.Show();
                scope.text = text;
                $modal.open({
                    animation: true,
                    templateUrl: 'app/popUps/reportPublication/reportModal.template.html',
                    scope: scope
                })
                //scope.element.find('#reportarGracias').modal('show');
                // scope.element.find('#reportarGracias').modal('toggle');
            });

            scope.element.find('#reportarGracias').on('hidden.bs.modal', function () {
                scope.$emit('reporting', false);

            })


        }

        return {
            restrict: 'E',
            templateUrl: 'app/popUps/reportPublication/report.template.html',
            controller: 'reportPublicationController',
            link: link,
            scope: scope
        }
    }
]);
