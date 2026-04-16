'use strict'

angular.module('modal')
.service('modalServices', ['$modal', '$rootScope',
    function ($modal, $rootScope) {
        let modal = undefined;

        $rootScope.$on('$routeChangeStart', function(event, next, current){
          if (this.modal){
            modal.dismiss();
          }
        });

        this.BasicModal = function (title, text, callback) {
            this.modal = $modal.open({
                templateUrl: 'app/modals/basicModal/basicModal.template.html',
                controller: 'basicModalController',
                resolve: {
                    data: {
                        title: title,
                        text: text
                    }
                },
                backdrop: 'static',
                animation: true,
                windowClass: 'modal fade smaller-modal'
            });

            $rootScope.$emit('addToHistory');

            this.modal.result.then(
                function (res) {

                    if (callback)
                        callback(res);
                },

                function() {

                }
            );
        }

        this.CancelModal = function (title, text, callback) {
            this.modal = $modal.open({
                templateUrl: 'app/modals/cancelModal/cancelModal.template.html',
                controller: 'cancelModalController',
                resolve: {
                    data: {
                        title: title,
                        text: text
                    }
                },
                backdrop: 'static',
                animation: true,
                windowClass: 'modal fade smaller-modal'
            });

            $rootScope.$emit('addToHistory');

            this.modal.result.then(
                function (res) {

                    if (callback)
                        callback(res);
                },

                function() {

                }
            );
        }

        this.BasicSingleButtonModal = function (title, text, callback) {
            this.modal = $modal.open({
                templateUrl: 'app/modals/basicSingleButtonModal/basicSingleButtonModal.template.html',
                controller: 'basicSingleButtonModalController',
                resolve: {
                    data: {
                        title: title,
                        text: text
                    }
                },
                backdrop: 'static',
                animation: true,
                windowClass: 'modal fade smaller-modal'
            });

            $rootScope.$emit('addToHistory');

            this.modal.result.then(
                function (res) {

                    if (callback)
                        callback(res);
                }
            );
        }


        this.ReserveConfirmation = function (sender, callback) {
            this.modal = $modal.open({
                templateUrl: 'app/modals/reserveConfirmation/reserveConfirmation.template.html',
                controller: 'reserveConfirmationController',
                resolve: {
                    data: {
                        sender: sender
                    }
                },
                backdrop: 'static',
                animation: true,
                windowClass: 'modal fade smaller-modal'
            });

            $rootScope.$emit('addToHistory');

            this.modal.result.then(
                function (res) {

                    if (callback)
                        callback(res);
                }
            );
        }
    }
]);
