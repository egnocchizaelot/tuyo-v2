angular.module('creation')
.directive('appFilereader', ['$q', 'appService', 'growl', '$timeout',
    function($q, appService, growl, $timeout) {
        var slice = Array.prototype.slice;

        return {
            restrict: 'A',
            require: '?ngModel',
            scope: { loading: "=loading"},
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    if (scope.loading)  scope.loading();

                    var tooSmall = 0;

                    var element = e.target;

                    for (let i = 0; i < element.files.length; i++) {
                        if (element.files[i].type !== "image/jpeg" && element.files[i].type !== "image/jpg"  && element.files[i].type !== "image/png" ) {
                            growl.info("No se pueden subir imágenes que no sean .jpg, .jpeg o .png");
                            if (scope.loading) scope.loading();
                            return;
                        }
                    }

                    let currentValue = ngModel.$viewValue || [];
                    if (!Array.isArray(currentValue)) {
                        currentValue = [currentValue].filter(Boolean);
                    }

                    let maxPhotos = 3 - currentValue.length;

                    if (maxPhotos <= 0) {
                        if (scope.loading) scope.loading();
                        return;
                    }

                    $q.all(slice.call(element.files, 0, maxPhotos).map(readFile))
                    .then(function(values) {
                        let newValues = values.filter(Boolean).map(function(i) {
                            return {img: i, id: -1};
                        });

                        let updatedValue;
                        if (element.multiple) {
                            updatedValue = currentValue.concat(newValues);
                        } else {
                            updatedValue = newValues.length ? newValues[0] : null;
                        }

                        ngModel.$setViewValue(updatedValue);

                        if (tooSmall === 1)
                            growl.info('Una imagen es muy pequeña. El tamaño mínimo es de 500px de ancho');
                        else if (tooSmall > 1)
                            growl.info(tooSmall + ' imágenes son más pequeñas de lo que pueden ser. El tamaño mínimo es de 500px de ancho');

                        if (scope.loading) {
                            scope.loading();
                        }
                    });

                    function setRotation(rotation) {
                        element.css('-ms-transform', rotation);
                        element.css('-webkit-transform', rotation);
                        element.css('-moz-transform', rotation);
                        element.css('transform', rotation);
                    }

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();

                        reader.onload = function(e) {
                            let img = new Image();
                            img.onload = function () {
                                if (this.width >= appService.imgMinWidth){
                                    EXIF.getData(img, function() {
                                        var orientation = EXIF.getTag(img, 'Orientation');
                                        if (orientation && orientation !== 1) {
                                            switch (orientation) {
                                              case 2:
                                                setRotation('rotateY(180deg)');
                                                break;
                                              case 3:
                                                setRotation('rotate(180deg)');
                                                break;
                                              case 4:
                                                setRotation('rotateX(180deg)');
                                                break;
                                            }
                                        }
                                    });
                                    deferred.resolve(e.target.result);
                                }
                                else {
                                    tooSmall++;
                                    deferred.resolve(null);
                                }
                            };
                            img.src = e.target.result;
                        };

                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };

                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }
                });
            }
        };
    }
]);