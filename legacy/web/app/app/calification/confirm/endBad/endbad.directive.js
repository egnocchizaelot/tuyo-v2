'use strict'

angular.module('calification')
.directive('endBadConfirm', ['Auth',
    function (Auth) {
        var scope = {
            donation: '=',
            close: '&'
        };

        const link = function (scope, element, attr) {

            let creator = scope.donation.creator.id === Auth.userData.id;

            scope.options = []
            scope.options[0] = 'Fue muy difícil de coordinar';
            scope.options[1] = 'No fue amable';
            scope.options[2] = creator ? 'Me generó desconfianza' : 'El artículo estaba en muy mal estado';
            scope.options[3] = 'Otra razón';

            scope.clean = function () {
                scope.badCheckbox.one = false;
                scope.badCheckbox.two = false;
                scope.badCheckbox.three = false;
                scope.badCheckbox.other = false;

                scope.content = undefined;
            }

            scope.selectOption = function (option) {
                if (option !== 1) scope.badCheckbox.one = false;
                if (option !== 2) scope.badCheckbox.two = false;
                if (option !== 3) scope.badCheckbox.three = false;
                if (option !== 4) scope.badCheckbox.other = false;
            }

            scope.send = function () {

                let textArray = [];
                if (scope.badCheckbox.one)      textArray.push(scope.options[0]);
                if (scope.badCheckbox.two)      textArray.push(scope.options[1]);
                if (scope.badCheckbox.three)    textArray.push(scope.options[2]);
                if (scope.badCheckbox.otra) {
                    textArray.push(scope.content);

                    if (!scope.content || scope.content.length === 0) {
                        growl.info('Tienens que enviar un mensaje')
                        return;
                    }

                    if (scope.content.length > scope.maxLength) {
                        growl.info('El mensaje no puede tener más de ' + scope.maxLength + ' caracteres')
                        return;
                    }
                }

                let text = textArray.join('|| ');


                let data = {
                    text: text,
                    case: 'report'
                }

                if (data.otra)
                    data.otraText = scope.content;

                scope.$emit('close', data)
            }

        }

        return {
            restrict: 'E',
            templateUrl: 'app/calification/confirm/endBad/endbad.template.html',
            controller: 'endBadConfirmController',
            link: link,
            scope: scope
        }
    }
]);
