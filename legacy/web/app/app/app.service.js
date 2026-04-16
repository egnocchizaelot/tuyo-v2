'use strict'

angular.module('TuyoTools')
.service('appService', ['Facebook', 'Auth', '$localStorage', '$state', '$cookies', 'growl',
    function (Facebook, Auth, $localStorage, $state, $cookies, growl) {


        var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null)
            M.splice(1, 1, tem[1]);


        let text = ''
        switch (M[0].toUpperCase()) {
            case 'FIREFOX':
                if (parseInt(M[1]) < 52)
                    alert("Por favor actualice su navegador.\nEn la versión actual Tuyo puede no funcionar correctamente.\nGracias");
                    // alert("Por favor actualice Firefox.\nTuyo.uy sólo funcionará con Firefox 52 en adelante.\nPor favor actualice su navegador.")
            break;

            case 'CHROME':
                if (parseInt(M[1]) < 56)
                    alert("Por favor actualice su navegador.\nEn la versión actual Tuyo puede no funcionar correctamente.\nGracias");
                    // alert("Por favor actualice Chrome.\nTuyo.uy sólo funcionará con Chrome 56 en adelante.\nPor favor actualice su navegador.")
            break;

            case 'OPERA':
                if (parseInt(M[1]) < 48)
                    alert("Por favor actualice su navegador.\nEn la versión actual Tuyo puede no funcionar correctamente.\nGracias");
                    // alert("Por favor actualice Opera.\nTuyo.uy sólo funcionará con Opera 48 en adelante.\nPor favor actualice su navegador.")
            break;

            case 'SAFARI':
                if (parseFloat(M[1]) < 9)
                    alert("Por favor actualice su navegador.\nEn la versión actual Tuyo puede no funcionar correctamente.\nGracias");
                    // alert("Por favor actualice Safari.\nTuyo.uy sólo funcionará con Safari 10.1 en adelante.\nPor favor actualice su navegador.")

            break;

            case 'EDGE':
                if (parseInt(M[1]) < 15)
                    alert("Por favor actualice su navegador.\nEn la versión actual Tuyo puede no funcionar correctamente.\nGracias");
                    // alert("Por favor actualice Edge.\nTuyo.uy sólo funcionará con Edge 15 en adelante.\nPor favor actualice su navegador.")
            break;
        }

        this.DEVELOP = true;


        this.chatHeight = 600;
        this.modalHeight = 600;

        this.secondaryNavHeight = 56;

        this.donationsPagination = 5;
        this.defaultPagination = 3;
        this.notificationsPageSize = 10;
        this.helpTopicsPageSize = 6;


        this.navigationHeight = 82;
        this.titleHeight = 172;


        this.socketServer = SOCKET_SERVER
        this.appId = FACEBOOK_APP_ID


        this.usuariosTotales = "100.000"
        this.usuariosK = "100"
        this.articulosTotales = "194.342"
        this.articulosK = "194"
        this.adminMail = "administrador@silovenisabuscarestuyo.com"

        this.donationUpdateTime = 5000;

        this.imgMinWidth = 500;
        this.imgMaxSize;


        this.pickupDescription = "Día y hora a convenir";

        this.reserveTextLength = 130;

        this.isMobile = false;

        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) this.isMobile = true;


        if (this.isMobile) {
            angular.element(document).find('body').addClass("mobile-view");
        }

        // this.resizeInterval = setInterval(function() {
        //     $(window).trigger('resize');
        // }, 10000);


        this.AuthLogin = function (reqObj, callback, whitelistCallback) {
            $cookies.remove('Authorization');
            delete $localStorage.UserData;
            Auth.login(reqObj)
                .then(function (data) {
                    if (!data.user) {
                        console.log('No se devolvió ningún usuario');
                        $state.go('app.landing');
                        return
                    }

                    if (data.status === 406 || data.user.banned) {
                        console.log('Usuario en la blacklist');
                        Auth.logout();
                        let user = data.user || {};
                        user.banned = true;
                        if (callback) callback(user);
                        return
                    }

                    if (data.status === 409) {
                        console.log('Usuario no registrado');
                        $state.go('app.landing');
                        return
                    }

                    if (data.is_new || !data.user.reg_comp) {
                        if (callback)
                            callback(data.user);
                        return
                    }

                    if (whitelistCallback ) {
                        whitelistCallback(data.user.enabled);
                    }

                    if (!data.user.enabled) {
                        Auth.logout();
                        if (callback) callback(data.user);
                        return;
                    }

                    if ($state.$current.self.name === 'app.donation')
                        $state.go('app.donation', {}, { reload: true, inherit: false, notify: true } );
                    else {
                        $('#espere').modal('hide');
                        $('#iniciar-sesion').modal('hide');
                        $state.go('app.donations.dashboard', {}, { reload: true, inherit: false, notify: true });
                    }

                }, function (e) {
                    console.log(e)
                    if (callback) callback();
                    return;
                    // growl.error('Datos no válidos, compruebe su nombre de usuario y/o contraseña.');
                });
        }

        this.facebookLogin = function(login, callback, whitelistCallback) {
            var reqObj = {
                "backend": "facebook",
                'action': login ? 'login' : 'register'
            }

            var self = this
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    reqObj.access_token = response.authResponse.accessToken;
                    self.AuthLogin(reqObj, callback, whitelistCallback);
                    return
                }

                FB.login(function(response) {
                    if (response.status !== 'connected') {
                        growl.error('Pasó algo con Facebook al querer iniciar sesión. Por favor pruebe más tarde.');
                        if(callback) callback();
                        return
                    }
                    reqObj.access_token = response.authResponse.accessToken;
                    self.AuthLogin(reqObj, callback, whitelistCallback);

                }, {scope: 'email,'})

            }, true);
        }

        this.login  = function (login, callback, whitelistCallback) {

            if (facebookIsLoaded){
                this.facebookLogin(login,callback,whitelistCallback);
            }else {
                growl.error("Estamos teniendo problemas para comunicarnos con facebook desde tu navegador. \nTal vez tengas activada la función de anonimato (anti-tracking)")
                if(callback)
                    callback()
            }

        }

        this.AuthRegister = function (reqObj, callback, whitelistCallback) {
            $cookies.remove('Authorization');
            delete $localStorage.UserData;
            Auth.register(reqObj)
                .then(function (data) {
                    if (!data.user) {
                        console.log('No se devolvió ningún usuario');
                        $state.go('app.landing');
                        return;
                    }

                    if (data.status === 406 || data.user.banned) {
                        console.log('Usuario en la blacklist');
                        Auth.logout();
                        let user = data.user || {};
                        user.banned = true;
                        if (callback) callback(user);
                        return;
                    }

                    if (data.status === 409) {
                        console.log('Usuario ya registrado');
                        growl.error('Este correo electrónico ya está registrado.');
                        $state.go('app.landing');
                        return;
                    }

                    if (whitelistCallback) {
                        whitelistCallback(data.user.enabled);
                    }

                    if (callback) callback(data.user);
                }, function (e) {
                    growl.error('Error en el registro. Por favor, inténtelo de nuevo más tarde.');
                    if (callback) callback();
                });
        };

    }

]);

// window.addEventListener('offline', function(e) { console.log('offline'); });
//
// window.addEventListener('online', function(e) { console.log('online'); });


var $allVideos = undefined
function CreateVideo (element) {
    if(YT){
        var player = new YT.Player($(element).attr('id'), {

          events: {
            'onReady': onPlayerReady
          }
        });
    }
    else{
        setTimeout(function () {
            CreateVideo (element);
        }, 1000);
    }
}

function onPlayerReady(){
    GetAllVideos();
    $(window).trigger('resize');
}

function GetAllVideos() {
    $allVideos = $("iframe[src^='https://www.youtube.com'], object, embed");

    $allVideos.each(function() {

        $(this)
            .attr('data-aspectRatio', this.height / this.width)
            .removeAttr('height')
            .removeAttr('width');
    });
}

$(window).resize(function() {
    if (!$allVideos)
        return;
    var newWidth = $(".contentHolder:first").width();

    $allVideos.each(function() {

        var $el = $(this);
        $el
        .width(newWidth)
        .height(newWidth * $el.attr('data-aspectRatio'));

    });

}).resize();




// $(document).on("YTAPIReady", function(){
//     console.log("MINGA")
// })

function onYouTubeIframeAPIReady() {
    console.log($("iframe[src^='https://www.youtube.com'], object, embed"))
}
