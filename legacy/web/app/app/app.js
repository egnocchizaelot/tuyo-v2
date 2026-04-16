'use strict';

// var angular = require('angular');
// import angular from 'angular';

/**
 * @ngdoc overview
 * @name T1
 * @description
 * # TuyoTools
 *
 * Main module of the application.
 */
angular
  .module('TuyoTools', [
    'angular-growl',
    'ngAnimate',
    'ui.router',
    'angular-loading-bar',
    'ngCookies',
    'ui.select',
    'ui.bootstrap',
    'angularFileUpload',
    'permission',
    'angular-sortable-view',
    'ngMap',
    'ngStorage',
    // 'ngFacebook',
    'angularMoment',
    'angularModalService',
    '720kb.socialshare',

    'tuyoAux',
    'navigationBar',
    'footer',
    'landing',
    'dashboard',
    'user',
    'creation',
    'createAppreciation',
    'calification',
    'map',
    'loadingModule',
    'modal',
    'staticPagesModule',
    'help',
    'ngSanitize'

  ])
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })

  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    user: 'user'
  });
