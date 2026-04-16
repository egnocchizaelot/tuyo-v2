'use strict'

angular.module('createAppreciation')
.directive('createAppreciation', ['Auth', 'appService', 'API', 'growl', 'modalServices', 'loadingService', '$rootScope',
    function (Auth, appService, API, growl, modalServices, loadingService, $rootScope) {
        var scope = {
            donation: '=',
            close: '&'
        }

        const link = function (scope, element, attr) {

            scope.isMobile = appService.isMobile;
            scope.loadingImgs = false;
            scope.maxLength = 800;

            scope.editing = true;

            scope.userData = Auth.userData

            scope.mine = scope.userData.id === scope.donation.creator.id

            scope.leftPath = API.mediaURL + scope.donation.creator.picture_url;
            scope.rightPath =  API.mediaURL + scope.donation.selected_user.picture_url;

            scope.showPreview = function () {
                if (!scope.description || scope.description === ''){
                    growl.info('La descripción no puede quedar vacía');
                    return;
                }

                if (scope.description.length > scope.maxLength) {
                    growl.info('La descripción no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                scope.editing = !scope.editing;
            }

            scope.$on('editAppreciation', function() {
                scope.editing = true;
            });

            scope.removeImage = function(index) {
                if (index < 0 || index >= scope.appreciationImages.length)
                    return;

                scope.appreciationImages.splice(index, 1);
            }

            scope.$on('back', function() {
                scope.Back();
            })

            scope.Back = function () {

                let title = '¿Seguro deseas salir?';
                let text = 'Toda la información de este agradecimiento se va a perder si sales ahora';
                modalServices.BasicModal(title, text, function (res) {
                    if (!res)
                        return;

                    scope.close({ result: false });
                })
            }

            // region  --  PUBLISH  --
            scope.$on('publishAppreciation', function() {

                if (!scope.description || scope.description === ''){
                    growl.info('La descripción no puede quedar vacía');
                    return;
                }

                if (scope.description.length > scope.maxLength) {
                    growl.info('La descripción no puede tener más de ' + scope.maxLength + ' caracteres')
                    return;
                }

                let images = scope.appreciationImages.map(f => f.img);

                let data = {
                    message: scope.description,
                    images: images,
                    donation_id: scope.donation.id
                };

                let loadingText = 'Subiendo imágenes';
                scope.publishing = true;
                loadingService.Show(loadingText);

                API.newAppreciation(data).then(
                    function(appreciation)  {

                        loadingService.Close();

                        if (typeof appreciation === 'string') {
                            growl.error(appreciation);
                            scope.close({result: false});
                            return;
                        }

                        scope.donation.appreciation = appreciation;

                        $rootScope.$broadcast('newAppreciationCreated');

                        growl.success("Tu agradecimiento quedó publicado")

                        scope.close({result: true});
                    },

                    function (e) {
                        loadingService.Close();

                        growl.error(e);
                        scope.close({result: false});
                    }
                )
            });
            // endregion

            scope.loading = function () {
                scope.loadingImgs = !scope.loadingImgs;
            }

        }

        return {
            restrict: 'E',
            templateUrl: 'app/create/createAppreciation/createAppreciation.template.html',
            controller: 'createAppreciationController',
            link: link,
            scope: scope
        }
    }
]);
