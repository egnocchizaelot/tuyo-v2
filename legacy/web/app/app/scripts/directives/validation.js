'use strict';

angular.module('TuyoTools')
  .directive('validCi', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        scope.$watch(attrs.ngModel, function(value) {
          if(value!==undefined){
            var isValid = validateCi(value);            
            ctrl.$setValidity('validci', isValid);
          }else{
            ctrl.$setValidity('validci', true);
          }
        });  
      } 
    }
  }])

  .directive('validRut', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        scope.$watch(attrs.ngModel, function(value) {
          if(value!==undefined){
            if(value===""){
              ctrl.$setValidity('validrut', true);
            }
            else{
              if(value.indexOf(".") ===-1 && value.indexOf(",")===-1 && value.length===12){
                var isValid = validateRut(value);
                ctrl.$setValidity('validrut', isValid);
              }
              else{
                ctrl.$setValidity('validrut', false);              
              }
            }
          }else{
            ctrl.$setValidity('validrut', true);
          }
        });  
      } 
    };
  }])

  .directive("dropzone", function() {
      return {
          restrict : "A",
          link: function (scope, elem) {
              elem.bind('drop', function(evt) {
                  evt.stopPropagation();
                  evt.preventDefault();

                  var files = evt.dataTransfer.files;
                  for (var i = 0, f; f = files[i]; i++) {
                      var reader = new FileReader();
                      reader.readAsArrayBuffer(f);

                      reader.onload = (function(theFile) {
                          return function(e) {
                              var newFile = { name : theFile.name,
                                  type : theFile.type,
                                  size : theFile.size,
                                  lastModifiedDate : theFile.lastModifiedDate
                              }

                              scope.addfile(newFile);
                          };
                      })(f);
                  }
              });
          }
      }
  });


  function validateCi(ci){
    var isValid = false;
    var arrCoefs = [2,9,8,7,6,3,4,1];
    var suma = 0;
    var difCoef = parseInt(arrCoefs.length - ci.length);
    for (var i = ci.length - 1; i > -1; i--) {
      //Obtengo el digito correspondiente de la ci recibida
      var dig = ci.substring(i, i+1);
      //Lo tenía como caracter, lo transformo a int para poder operar
      var digInt = parseInt(dig);
      //Obtengo el coeficiente correspondiente al ésta posición del digito
      var coef = arrCoefs[i+difCoef];
      //Multiplico dígito por coeficiente y lo acumulo a la suma total
      suma = suma + digInt * coef;
    }
    if ( (suma % 10) == 0 ) {
      isValid = true;
    }
    return isValid;
  }

  function validateRut(rut){
    var isValid = false;
    var multiplicador = "43298765432";
    var digitoVerificador = parseInt(rut.charAt(11));
    var suma = 0;
    for (var i = 0; i <= 10; i++) {
      var digitoMultiplicador = multiplicador.charAt(i);
      var digitoDocumento = rut.charAt(i);
      suma = suma + digitoMultiplicador * digitoDocumento;                
    }
    var digitoObtenido = 11 - (suma%11);
    if ( digitoVerificador === digitoObtenido) {
      isValid = true;
    }
    return isValid;
  }