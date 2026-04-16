'use strict';

angular.module('post')
.directive('onImageLoad', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.bind('load', function() {
                    scope.$emit('imageHasLoaded');
                });
            }
        };
    });
