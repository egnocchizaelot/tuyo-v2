'use strict';

angular.module('TuyoTools')
  .service('Config', function () {
    this.mockBaseURL = '_data/';
    // TEST
    // this.baseURL = '//tuyoapi.shaman.uy/api/';
    // this.helpURL = '//tuyoapi.shaman.uy/help/';

    // PRODUCCION
    //this.baseURL = 'https://testapi.tuyo.uy/api/';
    //this.helpURL = 'https://testapi.tuyo.uy/help/';


    // LOCAL
    //this.baseURL = '//localhost:8000/api/';
    //this.helpURL = '//localhost:8000/help/';
    //this.baseURL = '//192.168.2.117:8000/api/';
    //this.helpURL = '//192.168.2.117:8000/help/';


    this.baseURL = BASE_URL;
    this.helpURL = HELP_URL;
    this.mediaURL = MEDIA_URL;

    //this.baseURL = '//192.168.2.115:8000/api/';
    //this.mediaURL = 'https:' + this.baseURL.substr(0, this.baseURL.length-5);

  });
