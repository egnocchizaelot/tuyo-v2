'use strict'

var listeningToLogin = false

angular.module('landing')
.controller('landingController', ['$scope', 'Facebook', 'Auth', 'API', 'growl', '$state', '$cookies', '$stateParams', 'modalServices', 'appService', '$timeout', '$window', '$location', 'FileUploader', 'postServices',
    function ($scope, Facebook, Auth, API, growl, $state, $cookies, $stateParams ,modalServices, appService, $timeout, $window, $location, FileUploader, postServices) {

$scope.url = "https://www.facebook.com/dialog/oauth/?client_id=" + FACEBOOK_APP_ID + "&redirect_uri=" + FACEBOOK_LOG_IN_URL + "&response_type=code"

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        $scope.rulesPath = $state.href('app.reglamento');
        $scope.projectPath = $state.href('app.proyecto');
        $scope.startPath = $state.href('app.donations.dashboard');

        $scope.adminMail = appService.adminMail
        $scope.usuariosT = appService.usuariosTotales
        $scope.usuariosK = appService.usuariosK
        $scope.articulosT = appService.articulosTotales
        $scope.articulosK = appService.articulosK
        $scope.logginIn = false

        // region -- FACEBOOK --
        $scope.checkbox = {terms: false};

        $scope.termsContinue = function () {
            if (!$scope.checkbox.terms) {
                $scope.showErrorDiag = true;
                return;
            }

            $('#registrarse1').modal('hide');



            $('#espere').modal('show');
            var address = {
                city: "Montevideo",
            	country: "Uruguay",
            	district: "Centro",
            	lat: -34.906163,
            	lng: -56.18612200000001,
            	zoom: 4.549867747030993
            }

            API.createAddress(address).then(
                function (result) {
                    Auth.changeData({ addresses: [result] });
                    $('#espere').modal('hide');
                    $('#registrarse3').modal('show');
                }
            );

            //  **  ORIGINAL STUFF  **  //
            // $('#registrarse2').modal('show');
            // $scope.showMap = true

        }

        // endregion


        // region  --  MAP  --
        $scope.continueMap = function () {
            $scope.$broadcast('giveMeTheAddress', function(address) {
                $('#registrarse2').modal('hide');
                $('#registrarse3').modal('show');

                API.createAddress(address).then(
                    function (result) {
                        Auth.changeData({ addresses: [result] });
                    }
                );

            });
        }

        // endregion

        // region  --  E-MAIL  --
        // $scope.originalMail = false;
        $scope.otherMail = function () {
            $scope.originalMail = false;

            $scope.newMail = {
                mail1: $scope.email,
                mail2: $scope.email
            }

            $scope.validEmail = {
                mail1: true,
                mail2: true
            }
        }


        $scope.mailContText = "Continuar";
        $scope.processingMail = false;
        $scope.changeMail = function () {
            if (!$scope.validEmail.mail1 || !$scope.validEmail.mail2)
                return;

            if (!$scope.originalMail && $scope.newMail.mail1 !== $scope.newMail.mail2)
                return;


            if ($scope.processingMail)
                return;

            $scope.processingMail = true;
            $scope.mailContText = "Procesando...";

            $("#changeMailButton").attr('disabled', true);

            $scope.email = $scope.newMail.mail1
            var data = {
                email: $scope.email,
                isLogin: true
            };

            API.updateUser(data, $scope.userId).then(
                function(result){

                    $scope.processingMail = false;

                    if (!result.status) {
                        growl.error(result.message);
                        return;
                    }

                    Auth.changeData(data);
                    $('#registrarse3').modal('hide');
                    $('#espere').modal('show');

                    $scope.endingLogin();

                },
                function(e) {
                    growl.error('Tuvimos un problema. Por favor vuelva a intentar más tarde');
                }

            );
        }

        $scope.continueMail = function () {

            $('#registrarse3').modal('hide');
            $('#espere').modal('show');

            $scope.endingLogin()

        }

        $scope.mailChanged = function (mail) {
            $scope.validEmail[mail] = this.newEmails[mail].$valid

            if (this.newEmails.mail1.$viewValue !== this.newEmails.mail2.$viewValue)
                $scope.validEmail.mail2 = false;

        }


        // endregion

        $scope.endingLogin = function () {
            var tout = $timeout(function () {
                $('#espere').modal('hide');
                $window.location.reload();
            }, 45000);

            API.resendEmail().then(
                function(res) {
                    appService.login(undefined, undefined, function (enabled) {
                        $timeout.cancel(tout);
                        $('#espere').modal('hide');
                        if (!enabled)
                            $('#gracias').modal('show');

                    });
                },
                function(err) {
                    $timeout.cancel(tout);
                    $('#espere').modal('hide');
                    growl.error('Tuvimos un problema. Por favor vuelva a intentar más tarde');
                }
            );


        }

        
        $scope.theEnd = function () {
            $('#gracias').modal('hide');
            // appService.login(undefined);
        }

        // region - EN REPARACIONES
        // Cuando hay un problema con el login de Facebook debe cambiarse solo esta variable a true
        $scope.inMaintenance = false
        if ($scope.inMaintenance) {
            $('#repair').modal('show');
        }
        // funcion cerrar modal en reparaciones
        $scope.closeRepairModal = function () {
            $('#repair').modal('hide');
        }


        // region  --  LOGIN  --

        $scope.$on('navBarLogin', function() {
            $scope.login();
        })

        $scope.$on('footerLogin', function(e) {
            e.preventDefault()
            e.stopPropagation()
            $scope.login();
        })

        $scope.$on('footerDecideLogIn', function(){
            $scope.decideLogIn();
        })

        $scope.loginCallBack = function (user){
                $scope.logginIn = false;
                //$scope.popupWarning = false;
                $('#espere').modal('hide');

                if (!user)
                    return;

                $scope.fullName = user.full_name;

                if (user.banned) {
                    $scope.blacklisted = true;
                    $('#blacklisted').modal('show');

                    return;
                }

                if (!user.enabled && user.reg_comp) {
                    $('#notEnabled').modal('show');
                    return;
                }

                $scope.userId = user.id;
                $scope.fullName = user.full_name;

                $scope.email = $scope.validateEmail(user.email) ? user.email : undefined;

                if (!$scope.email) {
                    $scope.originalMail = false;
                    $scope.newMail = {
                        mail1: undefined,
                        mail2: undefined
                    }

                    $scope.validEmail = {
                        mail1: false,
                        mail2: false
                    }
                }
                else {
                    $scope.originalMail = true;
                    $scope.newMail = {
                        mail1: $scope.email,
                        mail2: $scope.email
                    }

                    $scope.validEmail = {
                        mail1: true,
                        mail2: true
                    }
                }
                $('#registrarse1').modal('show');
        };
        $scope.login = function (reqObj) {

            // $scope.popupWarning = true;

            $('#espere').modal('show');
            appService.AuthLogin(reqObj, function(user) {$scope.loginCallBack(user)});
        }

        $scope.canvasLogin = function () {

            // $scope.popupWarning = true;

            $('#espere').modal('show');
            appService.login(undefined, function(user) {$scope.loginCallBack(user)});
        }

        $scope.validateName = function(name) {
            return name && name.length >= 3 && /^[a-zA-Z\s]*$/.test(name);
        }

        $scope.validateEmail = function (email) {
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }    

        $scope.sanitizeName = function (name) {
            return name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚ\s]/g, '').trim();
        }

        $scope.cancel = function () {
            $('#registrarse1').modal('hide');
            $('#registrarse2').modal('hide');
            $('#registrarse3').modal('hide');
        }

        $scope.showModal = function (id) {

        }

        $scope.logout = function () {
          Auth.logout(true);
        };
        // endregion

        $scope.goToTerms = function () {
            $scope.cancel()
            $timeout(function () {
                var url = $state.href('app.terycon');
                window.open(url, '_blank');
            });
        }

        $scope.$on('$destroy', function() {
            $('.parallax-mirror').remove()
        });

        // $timeout(function () { $scope.userStatus(); });

        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
            clickBlock.remove();
        }, 700);


        let h = $(window).height() * 3/5;
        angular.element('#map-container').css({'height': h + 'px'})



        $window.addEventListener("facebookLoggedIn", $scope.facebookLogin);


        $scope.facebookLogin = function (token){
            var reqObj = {
                "backend": "facebook",
                "action": "register",
                "access_token": token,
            }
            $scope.login(reqObj)
        }

        $scope.getCodeParameter = function(){
            if(!listeningToLogin){
                listeningToLogin = true;
                var path = $location.absUrl();
                var small = path.substring(path.indexOf('?')+1, path.lastIndexOf('#/'));
                var paramsList = small.split('&');
                var params = {};
                paramsList.map((c) => { params[c.split('=')[0]] = c. split('=')[1] });
                if(params.code){
                    API.sendFacebookCode(params.code).then(function(response){
                        if(response.status){
                            if(response.error){
                                //El código es incorrecto o ha expirado
                                growl.error("Ha ocurrido un error al iniciar sesión con facebook, vuelva a intentarlo.");
                            }else{
                                $scope.facebookLogin(response.access_token);
                            }
                        }else{
                            //Error al consultar facebook
                            growl.error("No se pudo iniciar sesión con facebook, intentelo de nuevo más tarde.");
                        }
                    })
                }else if(params.error){
                    growl.error("Inicio de sesión cancelado.")
                }
            }
        }
        $scope.getCodeParameter()

        $scope.decideLogIn = function(){
            if(window.top !== window.self){
                if(!$scope.logginIn){
                    $scope.logginIn = true  //Si estoy en un iframe o canvas
                    $scope.canvasLogin();
                }
            }else{
                window.location.replace($scope.url);
            }
        }

        // region -- Tuyo Register --

        // Mostrar el modal de registro
        $scope.registerWithTuyo = function() {
            $scope.user = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            };
            $scope.validEmail = {};
            $scope.validPassword = {};
            $scope.checkbox = {terms: false};
            $scope.errorMessage = '';
            $scope.isLoading = false;
            $('#registrarse-tuyo0').modal('show');
        };

        // Texto del botón de registro
        $scope.registerButtonText = 'Crear Cuenta';

        // Función que se ejecuta al cambiar el email
        $scope.emailChanged = function() {
            $scope.validEmail = $scope.validEmail || {};  // Ensure validEmail is defined
            $scope.validEmail.email = $scope.validateEmail($scope.user.email);
        };

        // Validación de contraseña
        $scope.passwordChanged = function() {
            $scope.validPassword = $scope.validPassword || {};
            $scope.validPassword.password = $scope.user.password?.length >= 8;
            $scope.validPassword.confirmPassword = $scope.user.password === $scope.user.confirmPassword;
        };

        $scope.checkEmailAvailable = function() {
            $scope.errorMessage = '';

            if (!$scope.validEmail?.email) {
                $scope.errorMessage = 'El formato del correo es incorrecto.';
                return;
            }

            var request = {
                email: $scope.user.email
            }

            $scope.isLoading = true;
            $scope.registerButtonText = 'Validando...';
            // Code for API validate
            API.checkEmail(request).then(function(response){
                $scope.registerButtonText = 'Crear Cuenta';
                $scope.isLoading = false;
                
                if (response.exists) {
                    $('#registrarse-tuyo0').modal('hide');
                    $('#email-existente').modal('show');
                } else {
                    $scope.registerButtonText = 'Siguiente';
                    $('#registrarse-tuyo0').modal('hide');
                    $('#registrarse-tuyo1').modal('show');
                }

            })
        }

        // Recuperar contraseña
        $scope.recoverPassword = function() {
            if (!$scope.validEmail?.email) {
                $scope.errorMessage = 'El formato del correo es incorrecto.';
                return;
            }

            $('#espere').modal('show');

            var forgotPasswordRequest = {
                email: $scope.user.email
            }

            // API Call
            API.forgotPassword(forgotPasswordRequest).then(function(response) {
                if (response) {
                    $('#espere').modal('hide');
                    growl.success('Se ha enviado un e-mail de recuperación')
                }
            }, function(err) {
                $('#espere').modal('hide');
                growl.error('Tuvimos un problema. Por favor vuelva a intentar más tarde');
            })

        }

        // Confirmación de registro
        $scope.register = function() {
            $scope.errorMessage = '';
            $scope.invalidNameMessage = '';
            $scope.invalidPasswordMessage = '';

            // Validate name
            if (!$scope.validateName($scope.user?.firstName) || !$scope.validateName($scope.user?.lastName)) {
                $scope.invalidNameMessage = 'Contiene caracteres inválidos.';
            }

            if (!$scope.validPassword?.confirmPassword) {
                $scope.invalidPasswordMessage = 'La contraseña no coincide con la confirmación.';
            }

            // Validate password
            if (!$scope.validPassword?.password) {
                $scope.invalidPasswordMessage = 'La contraseña debe tener 8 caracteres mínimo.';
            }

            // Validate other fields
            if (!$scope.checkbox.terms) {
                $scope.errorMessage = 'Debes aceptar los términos y condiciones.';
            }

            // Only proceed if all validations pass
            if (!$scope.errorMessage && !$scope.invalidNameMessage && !$scope.invalidPasswordMessage) {
                $scope.confirmRegistration();
            }
        };
        
        // Función para ocultar el modal al confirmar registro
        $scope.confirmRegistration = function() {
            $('#registrarse-tuyo1').modal('hide');
            $('#espere').modal('show');

            var reqObj = {
                email: $scope.user.email,
                first_name: $scope.user.firstName,
                last_name: $scope.user.lastName,
                password: $scope.user.password
            }

            appService.AuthRegister(reqObj, function(user) {$scope.registrationCallBack(user)});     
        };

        $scope.registrationCallBack = function (user) {
            $('#espere').modal('hide');

            if (!user) {
                $scope.errorMessage = 'No se pudo completar el registro. Por favor, inténtelo de nuevo más tarde.';
                return;
            }

            if (user.banned) {
                $scope.errorMessage = 'Lo sentimos, este usuario está bloqueado.';
                return;
            }

            var address = {
                city: "Montevideo",
            	country: "Uruguay",
            	district: "Centro",
            	lat: -34.906163,
            	lng: -56.18612200000001,
            	zoom: 4.549867747030993
            }

            API.createAddress(address).then(
                function (result) {
                    Auth.changeData({ addresses: [result] });
                }
            );

            $scope.$broadcast('giveMeTheAddress', function(address) {
                API.createAddress(address).then(
                    function (result) {
                        Auth.changeData({ addresses: [result] });
                    }
                );
            });
        
            $('#registrarse-tuyo2').modal('show');
        }

        $scope.$on('back', function () { $scope.goToDashboard() });

        $scope.goToDashboard = function () {
            $state.go('app.donations.dashboard', {}, { reload: true, inherit: false, notify: true });
        }

        $scope.completeProfile = function () {
            $scope.registerButtonText = 'Finalizar';
            $('#registrarse-tuyo2').modal('hide');
            $('#registrarse-tuyo3').modal('show');
        }
        
        $scope.loadingImgs = false;

        $scope.triggerFileInput = function() {
            document.getElementById('fileInput').click();
        };
        
        $scope.loading = function () {
            $scope.loadingImgs = !$scope.loadingImgs;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        
        $scope.$watch('profileImage', function(newVal, oldVal) {
            if (newVal) {
                $scope.user.picture_url = newVal.img;
            } else if (oldVal && !newVal) {
                // Image was removed
                $scope.user.picture_url = null;
            }
        });
        
        $scope.finishRegistration = function() {
            if ($scope.user.picture_url) {
                $scope.isLoading = true;
                $scope.registerButtonText = 'Subiendo...';

                function base64ToFile(dataUrl, filename) {
                    var arr = dataUrl.split(',');
                    var mime = arr[0].match(/:(.*?);/)[1];
                    var bstr = atob(arr[1]);
                    var n = bstr.length;
                    var u8arr = new Uint8Array(n);
                
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                
                    return new File([u8arr], filename, { type: mime });
                }
                
                const formData = new FormData();

                const userId = Auth.userData?.id
    
                const imageFile = base64ToFile($scope.user.picture_url, `u_${userId}_social.jpg`);
    
                formData.append('profile_picture', imageFile);
    
                var token = $cookies.get('Authorization');
    
                fetch(`${API.baseURL}upload_profile_picture/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token, // Incluye tu token de autenticación
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    Auth.changeData({ picture_url: data.picture_url });
                    growl.success('Foto de perfil actualizada exitosamente');
                })
                .catch(error => {
                    growl.error('Tuvimos un problema. Por favor vuelva a intentar más tarde');
                });

                $scope.registerButtonText = 'Finalizar';
                $scope.isLoading = false;
            }
        
            // Move to the next step
            $('#registrarse-tuyo3').modal('hide');
            $('#registrarse-tuyo4').modal('show');
        };

        $scope.navigateTo = function(area) {
            switch (area) {
                case 'inicio':
                    $state.go('app.donations.dashboard', {}, { reload: true, inherit: false, notify: true });
                break;

                case 'donar':
                    $state.go('app.donations.dashboard').then(function() {
                        // Use $timeout to ensure the navigation is complete before opening the modal
                        $timeout(function() {
                            postServices.NewDonation();
                        });
                    });
                break;
            }

            $('#registrarse-tuyo4').modal('hide');
        };

        // endregion

        // region -- Tuyo Login --
    
        $scope.openLoginModal = function() {
            $scope.user = {
                email: '',
                password: '',
            };
            $scope.validEmail = {};
            $scope.validPassword = {};
            $scope.errorMessage = '';
            $('#iniciar-sesion').modal('show');
        };

        $scope.loginButtonText = "Iniciar Sesión";

        $scope.tuyoLogin = function() {
            $scope.errorMessage = '';
            if ($scope.validEmail.email) {
                $scope.loginButtonText = "Iniciando sesión...";
                
                var reqObj = {
                    backend: "tuyo",
                    data: {
                        email: $scope.user.email,
                        password: $scope.user.password
                    }
                };
        
                $('#espere').modal('show');
                appService.AuthLogin(reqObj, function(user) {$scope.tuyoLoginCallBack(user)});
            } else {
                $scope.errorMessage = 'Completa todos los campos.';
                return;
            }
        };
        
        $scope.tuyoLoginCallBack = function(user) {
            $('#espere').modal('hide');
            $scope.loginButtonText = "Iniciar Sesión";

            if (!user) {
                $scope.errorMessage = 'Usuario y/o contraseña incorrecto.';
                return;
            }
        
            $scope.fullName = user.full_name;

            if (user.banned) {
                $scope.blacklisted = true;
                $('#blacklisted').modal('show');

                return;
            }

            if (!user.enabled && user.reg_comp) {
                $('#notEnabled').modal('show');
                return;
            }

            $scope.userId = user.id;
            $scope.fullName = user.full_name;
        
            $scope.email = user.email;

            // Successful login
            $('#iniciar-sesion').modal('hide');
        };

        // endregion

        // region -- Password reset --

        // Check for password reset parameters
        if ($stateParams.uidb64 && $stateParams.token) {
            $scope.resetId = $stateParams.uidb64;
            $scope.resetToken = $stateParams.token;

            if ($stateParams.scope == 'reset-password') {
                // Use $timeout to ensure the DOM is ready
                $timeout(function() {
                    $('#reset-password').modal('show');
                });
            }
            
            if ($stateParams.scope == 'confirm-email') {
                $timeout(function() {
                    $('#espere').modal('show');

                    var confirmEmailRequest = {
                        uidb64: $scope.resetId,
                        token: $scope.resetToken
                    }
        
                    // API call
                    API.confirmEmail(confirmEmailRequest).then(function(response) {
                        if (response) {
                            $('#espere').modal('hide');
                            growl.success('Se ha confirmado el correo correctamente.')
                        }
                    }, function(err) {
                        $('#espere').modal('hide');
                        growl.error('Tuvimos un problema. Por favor vuelva a intentar más tarde');
                    })
                });
            }
        }

        $scope.forgotPassword = function() {
            $('#iniciar-sesion').modal('hide');
            $('#forgot-password').modal('show');
        }

        $scope.resetPassword = function() {
            $scope.invalidPasswordMessage = '';

            if (!$scope.validPassword?.confirmPassword) {
                $scope.invalidPasswordMessage = 'La contraseña no coincide con la confirmación.';
            }

            // Validate password
            if (!$scope.validPassword?.password) {
                $scope.invalidPasswordMessage = 'La contraseña debe tener 8 caracteres mínimo.';
            }

            if ($scope.invalidPasswordMessage) return;

            $('#espere').modal('show');

            var resetPasswordRequest = {
                uidb64: $scope.resetId,
                token: $scope.resetToken,
                new_password: $scope.user.password
            }

            // API call
            API.resetPassword(resetPasswordRequest).then(function(response) {
                if (response) {
                    $('#espere').modal('hide');
                    growl.success('Se ha cambiado la contraseña correctamente.')

                    $('#reset-password').modal('hide');
                    $state.go('app.landing', {}, {
                        notify: false,
                        reload: false,
                        location: 'replace',
                        inherit: false
                    });
                }
            }, function(err) {
                $('#espere').modal('hide');
                growl.error('Tuvimos un problema. Por favor vuelva a intentar más tarde');
            })
        }

        //endregion
    }
]);
