'use strict';

angular.module('TuyoTools')
  .controller('DonationsNewPage', ['$scope', '$document', '$modal', 'API','Auth', 'FileUploader', function ($scope, $document, $modal, API, Auth, FileUploader) {
    $scope.$emit('changeSection', ['donar']);
    $scope.userData = Auth.userData;
    $scope.formData = {
    	'address' : {
    		'addresses' : []
    	},
    	'files': []
    };

    $scope.not_required = false;

    $scope.addressFormData = {};
    var geocoder = new google.maps.Geocoder();

    $scope.dynamicList_selectedItems = {};
	$scope.newAddress = function(){
	    $scope.new_address_modal = $modal.open({
	        animation: true,
	        templateUrl: '/views/modals/new_address.template.html', 
	        scope: $scope
	    });
	};

	$scope.createAddress = function(new_address){
		new_address.street = document.getElementById('newaddress_street').value.split(',')[0];
        new_address.corner = document.getElementById('newaddress_corner').value.split(',')[0];
        new_address.city = document.getElementById('newaddress_city').value.split(',')[0]; 
		var address = document.getElementById('newaddress_street').value;
        var corner = document.getElementById('newaddress_corner').value;
	    geocoder.geocode( { 'address' : address.concat(' & ', corner) }, function( results, status ) {
	        if( status == google.maps.GeocoderStatus.OK ) {
	        	var position = results[0].geometry.location;
	        	new_address.lat = position.lat();
	        	new_address.lng = position.lng();
	        	API.createAddress(new_address)
					.then(function(data){
						$scope.formData.address.addresses.push(data);
						$scope.new_address_modal.close();
					}, function(){
		            	$scope.SiteController.showError('Error al agregar nueva direccion.');
		            });
	        } else {
	            alert( 'Geocode was not successful for the following reason: ' + status );
	        }
	    });
    };

    var autocompleteTot;
    $scope.$watch('addressFormData.street', function(newValue, oldValue) {
	    if(!newValue){
	      return;
	    }
	    if(!oldValue){
	    	var options = {
				types: ['geocode'],
                componentRestrictions: {country: 'uy'}
			};
	      	var input = document.getElementById('newaddress_street');
	      	autocompleteTot = new google.maps.places.Autocomplete(input, options);
            
            autocompleteTot.addListener('place_changed', fillInAddress);
	    }
    });
      
    $scope.$watch('addressFormData.corner', function(newValue, oldValue) {
	    if(!newValue){
	      return;
	    }
	    if(!oldValue){
	    	var options = {
				types: ['geocode'],
                componentRestrictions: {country: 'uy'}
			};
	      	var input = document.getElementById('newaddress_corner');
	      	var autocomplete = new google.maps.places.Autocomplete(input, options);
	    }
    });
    $scope.$watch('addressFormData.city', function(newValue, oldValue) {
	    if(!newValue){
	      return;
	    }
	    if(!oldValue){
	    	var options = {
				types: ['(cities)'],
		   		componentRestrictions: {country: 'uy'}//uruguay only
			};
	      	var input = document.getElementById('newaddress_city');
	      	var autocomplete = new google.maps.places.Autocomplete(input, options);
	    }
    });

    var errors = '';
    $scope.createDonation = function(formData){
		if(validateDonation(formData)){
			API.createAddress(new_address)
			.then(function(data){
				$scope.formData.address.addresses.push(data);
				$scope.new_address_modal.close();
			}, function(){
	        	$scope.SiteController.showError('Error al agregar nueva direccion.');
	        });
		}else{
			$scope.SiteController.showWarning(errors);
		}
		
    };

    function validateDonation(formData){
    	if(formData.title && formData.description && formData.max_applicants && formData.type_name){
    		if(formData.address.addresses.length >= 1){
    			if(formData.files.length >= 1){
    				return true;
	    		}else{
	    			errors = 'Debe cargar al menos una imagen del articulo a regalar';		
	    		}
    		}else{
    			errors = 'Debe cargar al menos una direccion de retiro';	
    		}
    	}else{
    		$scope.not_required = true;
    		errors = 'Complete los campos obligatorios';	
		}
		return false;
    }

    function fillInAddress(){
        
        var place = autocompleteTot.getPlace();
        
        var street , city , district;
        for (var i = 0; i < place.address_components.length; i++) {    
            switch(place.address_components[i].types[0]){
                case 'route':
                    street =  place.address_components[i]['long_name']
                    break;
                case 'locality':
                    city =  place.address_components[i]['long_name']
                    break; 
            } 
        }
        
        document.getElementById('newaddress_street').value = street;
        document.getElementById('newaddress_city').value = city;
    }

      /*$scope.uploader = new FileUploader({
        url: API.baseURL+'donation_files/',
        headers: {
          'Authorization': $cookies.get('Authorization')
        },
        removeAfterUpload: true,
        queueLimit: 1
      });

      $scope.uploader.onBeforeUploadItem = function (item) {
        var stuff = {
            description: $scope.fileForm.file_description,
            global: $scope.fileForm.global,
        }
        if($scope.fileForm.as_client){
          stuff['client'] = data.insurance_client.id;
        }
        item.formData.push(stuff);
      };

      $scope.uploader.onSuccessItem = function(item, response, status, headers){
        if(response.id){
          $scope.SiteController.showSuccess('Archivo subido');
          response.url = response.url;
          $scope.sinister.files.push(response);
        }
        else{
          $scope.SiteController.showError(response);
          angular.element("input[type='file']").val(null);
        }
        $scope.fileForm.file_description = '';
        $scope.fileForm.file = null;
        $scope.fileForm.global = false;
        $scope.fileForm.as_client = false;
      };
      $scope.uploader.onErrorItem = function(item, response, status, headers){
        $scope.SiteController.showError('Error al subir archivo');
        angular.element("input[type='file']").val(null);
      };*/

    

  }]);


angular.module('TuyoTools')
	.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
});