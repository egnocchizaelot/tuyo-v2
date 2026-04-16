// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-06-30 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-file-upload/angular-file-upload.min.js',
      'bower_components/angular-growl-v2/build/angular-growl.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/select2/select2.js',
      'bower_components/ui-select/src/select3.js',
      'bower_components/angular-permission/dist/angular-permission.js',
      'bower_components/angular-sortable-view/src/angular-sortable-view.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/ngmap/build/scripts/ng-map.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/jquery-file-download/src/Scripts/jquery.fileDownload.js',
      'bower_components/ng-facebook/ngFacebook.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-modal-service/dst/angular-modal-service.js',
      'bower_components/angular-socialshare/dist/angular-socialshare.min.js',
      'bower_components/gsap/src/uncompressed/TweenMax.js',
      'bower_components/clipboard/dist/clipboard.js',
      'bower_components/ngclipboard/dist/ngclipboard.js',
      'bower_components/angular-inview/angular-inview.js',
      'bower_components/parallax.js/parallax.min.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/angular-tooltips/dist/angular-tooltips.min.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/lodash/lodash.js',
      'bower_components/exif-js/exif.js',
      'bower_components/slick-carousel/slick/slick.min.js',
      'bower_components/angular-slick-carousel/dist/angular-slick.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
