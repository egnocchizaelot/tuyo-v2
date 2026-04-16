'use strict'

angular.module('user').
controller('userPrivateController', ['$scope', 'Auth', 'API', 'growl', '$stateParams', 'FileUploader', '$timeout', '$cookies',
    function ($scope, Auth, API, growl, $stateParams, FileUploader, $timeout, $cookies) {
        $scope.userData = Auth.userData;
        $scope.mediaURL = API.mediaURL;

        $scope.state = { ACTIVITY: 0, HISTORY: 1, PROFILE: 2 };

        $scope.active = $stateParams.state;

        var clickBlock = angular.element('<div if="clickBlock" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>');
        angular.element('body').append(clickBlock);

        $timeout(function() {
        	clickBlock.remove();
        }, 700);


        $scope.profileImage = null;
        $scope.loadingImgs = false;

        $scope.triggerFileInput = function() {
            document.getElementById('fileInput').click();
        };

        $scope.$watch('profileImage', function(newVal, oldVal) {
            if (newVal) {
                console.log(newVal)
                $scope.uploadProfilePicture(newVal.img);
            } else if (oldVal && !newVal) {
                // Image was removed
                $scope.userData.picture_url = null;
            }
        });

        $scope.uploadProfilePicture = function(base64Image) {
            $scope.loadingImgs = true;

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

            const imageFile = base64ToFile(base64Image, `u_${$scope.userData.id}_social.jpg`);

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
        };
    }
]);
