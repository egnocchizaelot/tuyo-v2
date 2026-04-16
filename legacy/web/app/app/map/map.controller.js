'use strict'

angular.module('map')
.controller('mapController', ['$scope', '$timeout', '$element', '$window',
    function($scope, $timeout, $element, $window) {

        $scope.textIDs = {ZONA: 'zona', DESCRIPCION: 'descripcion', LUGAR: 'lugar', BUSCANDO: 'buscando'}

        // if($("body").hasClass("mobile-view")){
    	// 	let height = $window.innerHeight;
    	// 	let p = 0.5;
        //
    	// 	let h = (height*p) + 'px';
        //
    	// 	angular.element('#map').css('height', h);
    	// }

        // $timeout(function () {
        //     if($("body").hasClass("mobile-view")){
        //
        //             var windowHeight = $(window).height();
        //             var cardMapMP = parseInt($("#mapContainer").css("margin-top")) +  parseInt($("#mapContainer").css("padding-top"));
        //             var cardMapHeaderHeight = $("#mapContainer > .container").height() + parseInt($("#mapContainer > .container").css("margin-bottom"));
        //             var staticCardFooter = $(".static-card-footer").outerHeight();
        //
        //             var cardMapHeight = windowHeight - (cardMapMP + cardMapHeaderHeight + staticCardFooter);
        //             $("#mapContainer #map").height(cardMapHeight);
        //
        //             var stepsContainerHeight = $(".modal-landing-registrarse .steps-container").height();
        //             var actionRowButtonsHeight = $(".action-row-buttons").height() + parseInt($(".action-row-buttons").css("margin-top"));
        //             var modalMapHeight = windowHeight - (stepsContainerHeight + cardMapHeaderHeight + actionRowButtonsHeight);
        //             $(".modal-content #mapContainer #map").height(modalMapHeight);
        //
        //
        //     };
        // })



    }
]);
