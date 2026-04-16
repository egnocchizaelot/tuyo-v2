'use strict'

angular.module('loadingModule').
service('loadingService', ['$modal',
    function ($modal) {

        this.modal;

        this.Show = function (text) {
            this.modal = $modal.open({
                templateUrl: 'app/modals/loading/loading.template.html',
                controller: 'loadingModalController',
                resolve: {
                    data: {
                        text: text
                    }
                },
                backdrop: 'static',
                animation: true
            });
        }

        this.Close = function () {
            if (!this.modal)
                return;

            this.modal.close();
            this.modal = undefined;
        }
    }
]);
