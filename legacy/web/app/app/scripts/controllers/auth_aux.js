'use strict';


/**
 * Show/hide elements based on provided permissions/roles.
 * Modified from original to help with special conditions.
 *
 * @example
 * <div permissions only="'USER'"></div>
 * <div permissions only="['USER','ADMIN']" except="'MANAGER'"></div>
 * <div permissions except="'MANAGER'"></div>
 */
angular
  .module('TuyoTools')
  .directive('permissions', ['$log', 'Authorization', 'PermissionMap', function ($log, Authorization, PermissionMap) {
    return {
      restrict: 'A',
      scope: true,
      bindToController: {
        only: '=',
        except: '='
      },
      controllerAs: 'permission',
      controller: ['$scope', '$element', function ($scope, $element) {
        var permission = this;

        $scope.$watchGroup(['permission.only', 'permission.except'],
          function () {
            var origin = {
              source: $element.attr('origin') || null,
              target: $element.children(':first').attr('ui-sref') || $element.children(':first').attr('href')
            };
            try {
              Authorization
                .authorize(new PermissionMap({
                  only: permission.only,
                  except: permission.except
                }), origin)
                .then(function () {
                  $element.removeClass('ng-hide');
                })
                .catch(function () {
                  $element.addClass('ng-hide');
                });
            } catch (e) {
              $element.addClass('ng-hide');
              $log.error(e.message);
            }
          });
      }]
    };
  }]);
