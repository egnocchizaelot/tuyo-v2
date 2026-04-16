'use strict';

angular.module('TuyoTools')
  .directive('donationsHeader', ['$rootScope', '$window','$document', '$templateRequest', '$compile', '$state', 'growl', 'Auth', 'API','FilterFields',
  function ($rootScope, $window, $document, $templateRequest, $compile, $state, growl, Auth, API, FilterFields) {
    return {
      templateUrl: 'app/views/directives/donations_header.template.html',
      restrict: 'E',
      link: function postLink(scope) {
        document.addEventListener("click", function(e){
            if(e.button == 2){
              e.preventDefault();
              alert(e.button);
            }
          }, true);

        scope.navCollapsed = true;
        scope.forum = undefined;

        $rootScope.current_section = $window.sessionStorage.current_section;
        $rootScope.side_menu = ($window.sessionStorage.side_menu === 'true');
        var mcontainer = angular.element(document.getElementsByClassName("main-container"));
        if(!$rootScope.side_menu){
          mcontainer.addClass('no-sidemenu');
        }
        else{
          mcontainer.removeClass('no-sidemenu');
        }
        scope.email_sender = API.emailURL;
        var reportURLBase = API.baseURL;
        scope.reportURL = reportURLBase.substr(0,reportURLBase.length-4);

        scope.userData = Auth.userData;
        $rootScope.userData = scope.userData;
        scope.MEDIAURL = API.mediaURL;

        scope.changeSection = function(current_section){
          //Auth.current_section = current_section;
          $rootScope.current_section = current_section;
          $window.sessionStorage.current_section = current_section;
          var mcontainer = angular.element(document.getElementsByClassName("main-container"));
          if ((current_section === 'dashboard') || (current_section === 'donar') || (current_section === 'perfil')|| (current_section === 'datos_donacion')){
            mcontainer.addClass('no-sidemenu');
            $rootScope.side_menu = false;
          }
          else{
            mcontainer.removeClass('no-sidemenu');
            $rootScope.side_menu = true;
          }
          $window.sessionStorage.side_menu = $rootScope.side_menu;
        };

        if (!$rootScope.$$listeners['changeSection']){
          $rootScope.$on('changeSection', function(response, args) {
            response.stopPropagation();
            scope.changeSection(args[0]);
          });
        }

        scope.open_mobile_profile_list = function(){
          var element = document.getElementById('menu-user-mobile');
          scope.navCollapsed = true;
          if(element.classList.contains("hidden")){
            element.classList.remove("hidden");
            $window.onclick = function (event) {
              closeSearchWhenClickingElsewhere(event, scope.open_mobile_profile_list);
            };
          }
          else{
            element.classList.add("hidden");
            $window.onclick = null;
            //scope.$apply();
          }
        };

        function closeSearchWhenClickingElsewhere(event, callbackOnClose) {
            var clickedElement = event.target;
            if (!clickedElement) return;

            var elementClasses = clickedElement.classList;
            var clickedOnMenuDrawer = elementClasses.contains('menu-user-mobile-ul') ||
                (clickedElement.parentElement !== null && (clickedElement.parentElement.classList.contains('menu-user-mobile-ul')) ||
                (clickedElement.parentElement.parentElement !== null && clickedElement.parentElement.parentElement.classList.contains('menu-user-mobile-ul')) ||
                (clickedElement.parentElement.parentElement.parentElement !== null && (clickedElement.parentElement.parentElement.parentElement.classList.contains('menu-user-mobile-ul'))));
            if (!clickedOnMenuDrawer) {
                callbackOnClose();
            }
        }

        scope.open_mobile_options_list = function(){
          scope.navCollapsed = true;
          var element = document.getElementsByClassName('submenu-wrapper')[0];
          if(element.style.display == ''){
            element.style.display = 'block';
            $window.onclick = function (event) {
              closeMobileMenuListWhenClickingElsewhere(event, scope.open_mobile_options_list);
            };
          }
          else{
            element.style.display = '';
            $window.onclick = null;
            //scope.$apply();
          }
        };

        function closeMobileMenuListWhenClickingElsewhere(event, callbackOnClose) {
            var clickedElement = event.target;
            if (!clickedElement) return;

            var elementClasses = clickedElement.classList;
            var clickedOnMenuList = elementClasses.contains('submenu-wrapper');
            if (clickedOnMenuList) {
                callbackOnClose();
            }
        }

        scope.open_mobile_menu = function(){
          document.getElementById('menu-user-mobile').classList.add("hidden");
          if(scope.navCollapsed){
            scope.navCollapsed = !scope.navCollapsed;
            $window.onclick = function (event) {
              closeMobileMenu(event, scope.open_mobile_menu);
            };
          }
          else{
            scope.navCollapsed = !scope.navCollapsed;
            $window.onclick = null;
            if(!scope.$$phase) {
              scope.$apply();
            }

          }
        };

        function closeMobileMenu(event, callbackOnClose) {
          callbackOnClose();
        }

        if (!$rootScope.$$listeners['DONATION_DETAILS']){
          $rootScope.$on('DONATION_DETAILS', function(response, args) {
            if (response.name === 'DONATION_DETAILS'){
              response.stopPropagation();
              $rootScope.donation = args['donation'];
              //scope.donation = args['donation'];
              $rootScope.forum = args['forum'];

              $rootScope.donations = undefined;
              $rootScope.appreciations = undefined;
            }
            else{
              $rootScope.donation = undefined;
              $rootScope.forum = undefined;
            }
          });
        }

        scope.resetFilters = function(){
          FilterFields.selectedFilters = [];
        }
      }
    };
  }]);
