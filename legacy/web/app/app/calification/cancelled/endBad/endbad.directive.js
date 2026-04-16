'use strict'

angular.module('calification')
.directive('endBadCancel', ['Auth', 'growl',
    function (Auth, growl) {
        var scope = {
            donation: '=',
            close: '&'
        }

        const link = function (scope, element, attr) {

            scope.maxLength = 800;

            let creator = scope.donation.creator.id === Auth.userData.id;
            scope.options =[]
            scope.options[0] = 'No responde mis mensajes';
            scope.options[1] = 'Fue muy difícil de coordinar';
            scope.options[2] = creator ? 'No vino a buscarlo' : 'No cumplió con la entrega';
            scope.options[3] = creator ? 'Me generó desconfianza' : 'Me pidió dinero/trueque a cambio de su artículo';
            scope.options[4] = 'Otra razón';


            scope.clean = function () {
                scope.badCheckbox.one = false;
                scope.badCheckbox.two = false;
                scope.badCheckbox.three = false;
                scope.badCheckbox.four = false;
                scope.badCheckbox.other = false;

                scope.content = undefined;
            }

            scope.selectOption = function (option) {
                if (option !== 1) scope.badCheckbox.one = false;
                if (option !== 2) scope.badCheckbox.two = false;
                if (option !== 3) scope.badCheckbox.three = false;
                if (option !== 4) scope.badCheckbox.four = false;
                if (option !== 5) scope.badCheckbox.other = false;
            }


            scope.send = function () {

                let textArray = [];
                if (scope.badCheckbox.one)      textArray.push(scope.options[0]);
                if (scope.badCheckbox.two)      textArray.push(scope.options[1]);
                if (scope.badCheckbox.three)    textArray.push(scope.options[2]);
                if (scope.badCheckbox.four)     textArray.push(scope.options[3]);
                if (scope.badCheckbox.other) {
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

                scope.$emit('close', data)
            }

            scope.otherClick = function () {
                $('#otherText').prop('disabled', !scope.badCheckbox.otra)
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'app/calification/cancelled/endBad/endbad.template.html',
            controller: 'endBadCancelController',
            link: link,
            scope: scope
        }
    }
]);
