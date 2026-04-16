'use strict'

angular.module('map').
directive('addressMap', ['$timeout', 'mapService', '$state', 'growl', 'modalServices',
    function($timeout, mapService, $state, growl, modalServices) {
        var scope = {
            lat: '=',
            lng: '=',
            delete: '&',
            cancel: '&',
            accept: '&',
            isfilter: '=',
            width: '=',
            height: '=',
            description: "="
        };

        const link = function (scope, element, attr) {

            if (scope.accept() === "none" && scope.cancel() === "none")
                $state.go('app.donations.dashboard');

            let myLatLng;
            if (!scope.lat || scope.lat === 'none' || !scope.lng || scope.lng === 'none') {
                myLatLng = new google.maps.LatLng(-34.906163, -56.186122);
                scope.new = true;

                navigator.geolocation.getCurrentPosition(function(pos){
                    myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    scope.map.panTo(myLatLng);
                });
            } else {
                myLatLng = new google.maps.LatLng(scope.lat, scope.lng);
                scope.editing = true;
            }

            scope.geocoder = new google.maps.Geocoder();

            /*  MAP AND MARKER  */
            scope.map = new google.maps.Map(element.find('#map')[0], {
                center: myLatLng,
                zoom: 14,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: 'greedy'
            });

            $timeout(function () {
                if ($("body").hasClass("mobile-view")){

                        var windowHeight = $(window).height();
                        var cardMapMP = parseInt($("#mapContainer").css("margin-top")) +  parseInt($("#mapContainer").css("padding-top"));
                        var cardMapHeaderHeight = $("#mapContainer > .container").height() + parseInt($("#mapContainer > .container").css("margin-bottom"));
                        var staticCardFooter = $(".static-card-footer").outerHeight();
                        var footerHeight = $(".footer").outerHeight();

                        var cardMapHeight = windowHeight - (cardMapMP + cardMapHeaderHeight + footerHeight + 10);
                        $("#mapContainer #map").height(cardMapHeight);

                        var stepsContainerHeight = $(".steps-container").height();
                        stepsContainerHeight = 109;

                        var actionRowButtonsHeight = $(".action-row-buttons").height() + parseInt($(".action-row-buttons").css("margin-top")) + parseInt($(".action-row-buttons").css("margin-bottom"));
                        var modalMapHeight = windowHeight - (stepsContainerHeight + cardMapHeaderHeight + actionRowButtonsHeight + 20);


                        $(".modal-content #mapContainer #map").height(modalMapHeight);

                        // Fix modal ofrecer map
                        if( $("#creationNavBar").hasClass("modal-navbar") ){ //chequeo que sea solo en el modal de ofrecimiento

                            $("#mapContainer").css("position", "relative");
                            $("#mapContainer").css("top", "-55px");

                            var totalDif = $(".modal-navbar").height()
                                            + 41 //altura del "zona de retiro"
                                            + parseInt($("#mapContainer").css("padding-top"))
                                            + $("#mapContainer > .container").height()
                                            + parseInt($("#mapContainer > .container").css("margin-bottom"))
                                            + $(".footer").height()
                                            + parseInt($(".footer").css("padding-top"))
                                            + parseInt($(".footer").css("padding-bottom"));

                            var mapCreationCardH = windowHeight - totalDif;
                            $("#map").height(mapCreationCardH);
                        };
                }
                google.maps.event.trigger(scope.map, 'resize');

                let circleSize = angular.element('#map').height() < angular.element('#map').width() ? angular.element('#map').height() : angular.element('#map').width();
                let cw = angular.element('#mapContainer').outerWidth();
                let ch = angular.element('#map').innerHeight();

                let cx = cw/2 - circleSize/2;
                let cy = ch/2 - circleSize/2;

                angular.element('#circle').css({
                        'position': 'absolute',
                        'background': 'url(assets/images/circulo_zona__mapa.png) no-repeat',
                        'background-size': circleSize + 'px',
                        'z-index': '1',
                        'height': circleSize + 'px',
                        'width': circleSize + 'px',
                        'top': cy + 'px',
                        'left': cx + 'px',
                        'pointer-events': 'none'
                    });


                element.find("#map").append(angular.element('#circle'));
            })

            // region  --  STYLES  --
            // if (scope.width && scope.height) {
            //     $('#map').height(scope.height);
            //     $('#map').width(scope.width);
            // }


            google.maps.event.trigger(map, 'resize');

            let marker = element.find('#marker');
            marker.css('position', 'absolute');
            marker.css('background', 'url(assets/images/marker.png) no-repeat');
            marker.css('top', '50%');
            marker.css('z-index', '1');
            marker.css('left', '50%');
            marker.css('margin-left', '-10px');
            marker.css('margin-top', '-34px');
            marker.css('height', '34px');
            marker.css('width', '20px');

            element.find("#map").append(marker);

            scope.goodLocation = false;

            if (scope.description)  scope.info = scope.description;
            else                    scope.info = 'Buscando...';

            scope.inputData = {info: scope.info};

            google.maps.event.addListener(scope.map, 'drag', function() {
                scope.dragging = true;
                scope.goodLocation = false
                scope.info = ""

                if (!scope.isfilter) {
                    scope.showText(scope.textIDs.BUSCANDO);

                    if (scope.editingText) {
                        scope.goodLocation = false;
                        scope.editingText = false;

                        scope.info = "";

                        $timeout( function() {
                            scope.showText(scope.textIDs.BUSCANDO);
                        })
                    }

                    $("#descText").hide()
                    $("#editDesc").hide()
                    $("#accDesc").hide()
                }

            });

            google.maps.event.addListener(scope.map, 'dragend', function() {
                scope.dragging = false;
            });

            google.maps.event.addListener(scope.map, 'center_changed', function() {
                scope.d();
            });

            scope.d = _.debounce(function () {
                let center = scope.map.getCenter();
                scope.geocoder.geocode({latLng: center}, scope.getLocation);
            }, 1000);


            /* LOCATION AND NAME OF PLACE */
            scope.getLocation = function(result, status) {
                if (status !== google.maps.GeocoderStatus.OK || result.length === 0)
                    return;

                let things = mapService.getData(result);

                scope.country = things.country;
                scope.departamento = things.city;
                scope.barrio = things.district;

                let data = [];

                if (scope.departamento !== 'none') data.push(scope.departamento);
                if (scope.barrio !== 'none') data.push(scope.barrio);

                var info = data.join(', ');

                $timeout(function() {
                    scope.goodLocation = info !== '';
                    scope.info = info;
                    scope.inputData.info = info;

                    if (!scope.isfilter){
                        if (scope.goodLocation)
                            scope.showText(scope.textIDs.LUGAR);
                        else {
                            scope.showText(scope.textIDs.DESCRIPCION);
                            $("#editDesc").show()
                        }
                    }
                });

            }

            scope.country = 'Uruguay';
            scope.departamento = 'Montevideo'
            scope.barrio = 'Cordón'

            scope.geocoder.geocode({latLng: myLatLng}, scope.getLocation)


            /* ACEPTAR Y CANCELAR */
            scope.Accept = function () {

                if (scope.dragging)
                    return;

                if (scope.editingText)
                    scope.stopEditingText(scope.inputData.info, true);

                if (!scope.isfilter && !scope.goodLocation) {
                    growl.info('Para continuar agrega un nombre a tu ubicación.');
                    return
                }


              scope.toggleButton('map-accept');


              let data = scope.GetMapData();
              if (data) {
                  scope.accept()(data, scope.lat, scope.lng);
              }
              else {
                  let title = 'Datos incompletos';
                  let text = 'Para continuar tiene que completar el cuadro con su ubicacion';
                  modalServices.BasicSingleButtonModal(title, text,
                      function (res) {
                          if (res){
                              scope.toggleButton('map-accept');
                          return;
                          }
                      }
                  )
              }
            };

            scope.GetMapData = function() {
                if (!(scope.info === '' || scope.info === ' ' || scope.info === '\n' || scope.info === '\t' || scope.info === null || scope.info === undefined) || $state.params.filterLocation) {
                    let center = scope.map.getCenter();
                    let data = {
                        lat: center.lat(),
                        lng: center.lng()
                    };

                    data.district = scope.barrio;
                    data.city = scope.departamento;
                    data.country = scope.country;

                    let temp = [];
                    if (scope.departamento !== 'none') temp.push(scope.departamento);
                    if (scope.barrio !== 'none') temp.push(scope.barrio);

                    temp = temp.join(', ');
                    if (temp !== scope.info){
                        data.district = scope.info;
                        data.city = '';
                    }


                    let bounds = scope.map.getBounds();
                    const top = {
                        lat: bounds.getNorthEast().lat(),
                        lng: data.lng
                    }

                    const bottom = {
                        lat: bounds.getSouthWest().lat(),
                        lng: data.lng
                    }

                    data.zoom = getDistanceFromLatLonInKm(top.lat, top.lng, bottom.lat, bottom.lng);

                    return data;

                }
                return undefined;

            }

            scope.Cancel = function() {
              scope.cancel()();
            }

            scope.Delete = function () {
                scope.toggleButton('map-delete');
                let title = '¿Seguro deseas eliminar esta dirección?';
                let text; // = 'Mirá que se borra del todo';
                modalServices.BasicModal(title, text, function (res) {
                    if (!res){
                      scope.toggleButton('map-delete');
                        return;
                    }

                    scope.delete()(scope.lat, scope.lng);
                })
            }


            // endregion

            scope.$on('giveMeTheAddress', function(s, callback) {

                if (!scope.goodLocation) {
                    growl.error("La ubicación debe tener una descripción");
                    return
                }

                let data = scope.GetMapData()
                if (data)
                    callback(data);
                else
                    growl.error("La ubicación debe tener una descripción");

            });

            scope.toggleButton = function (buttonId) {
              var elem = element.find('#' + buttonId);
              if (elem.hasClass('button-pressed')){
                elem.removeClass('button-pressed');
              }
              else{
                elem.addClass('button-pressed');
              }
            };


            /*  -- EDITING  --  */
            scope.editingText = false;
            scope.startEditingText = function () {
                scope.editingText = true;

                if (!scope.isfilter) {
                    scope.showText();

                    $("#editDesc").hide()
                    $("#accDesc").show()
                    $("#descText").show()
                }
            };

            scope.stopEditingText = function (data, fromWholeAccept) {
                if (data === '') {
                    scope.goodLocation = false;
                    return;
                }

                scope.goodLocation = true;
                scope.editingText = false;

                scope.info = data;

                $timeout(function () {

                    $("#accDesc").hide()
                    $("#descText").hide()

                    if (fromWholeAccept) {
                        scope.showText();
                        return;
                    }

                    if (!scope.isfilter)
                        scope.showText(scope.textIDs.LUGAR);

                })

            }

            scope.showText = function (id) {

                switch (id) {
                    case scope.textIDs.ZONA:
                        $("#zona").show();
                        $("#descripcion").hide()
                        $("#lugar").hide()
                        $("#buscando").hide()
                        break;

                    case scope.textIDs.DESCRIPCION:
                        $("#zona").hide();
                        $("#descripcion").show()
                        $("#lugar").hide()
                        $("#buscando").hide()
                        break;

                    case scope.textIDs.LUGAR:
                        $("#zona").hide();
                        $("#descripcion").hide()
                        $("#lugar").show()
                        $("#buscando").hide()
                        break;

                    case scope.textIDs.BUSCANDO:
                        $("#zona").hide();
                        $("#descripcion").hide()
                        $("#lugar").hide()
                        $("#buscando").show()
                        break;

                    default:
                        $("#zona").hide();
                        $("#descripcion").hide()
                        $("#lugar").hide()
                        $("#buscando").hide()
                        break;
                }
            }

            $timeout(function(){
                if (scope.isfilter)
                    scope.showText(scope.textIDs.ZONA);
                else
                    scope.showText(scope.textIDs.BUSCANDO);

                $("#descText").hide()
                $("#editDesc").hide()
                $("#accDesc").hide()

            })
        }

        return {
            restrict: 'E',
            templateUrl: 'app/map/map.template.html',
            controller: 'mapController',
            link: link,
            scope: scope
        }
    }
]);


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
