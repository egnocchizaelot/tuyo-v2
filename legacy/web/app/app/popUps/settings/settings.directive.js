'use strict'

angular.module('popUps').
directive('settingsPublication', ['$document', 'modalServices',
    function ($document, modalServices) {
        let scope = {
            showForum: '&',
            showChat: '&',
            deleteDonation: '&',
            editDonation: '&',
            reserved: '='
        }

        const link = function (scope, element, attr) {
            scope.showing = false;
            scope.menu = element.find('#settingsMenu');

            scope.Show = function () {
                scope.showing = !scope.showing;

                if (scope.showing) {
                    scope.menu.addClass('collapse');
                    scope.menu.addClass('in');
                }else{
                    scope.menu.removeClass('in');
                }
            }

            scope.Edit = function () {
                scope.Show();
                scope.editDonation();
            }

            scope.List = function () {
                scope.Show();
                scope.showForum();
            }

            scope.Chat = function () {
                scope.Show();
                scope.showChat();
            }

            scope.Republish = function () {
                scope.Show();
                scope.editDonation();
            }

            scope.Delete = function () {
                let title = '¿Seguro deseas eliminar esta publicación?';
                let text; // = 'Mirá que se borra del todo';
                modalServices.BasicModal(title, text, function (res) {
                    if (!res)
                        return;

                    scope.deleteDonation();
                });
            }

            $document.on('click', function (e) {
                if (!scope.showing)
                    return;

                if (element !== e.target && !element[0].contains(e.target))
                    scope.Show();

            });

        }

        return {
            restrict: 'E',
            templateUrl: 'app/popUps/settings/settings.template.html',
            controller: 'settingsPublicationController',
            link: link,
            scope: scope
        }
    }
]);
