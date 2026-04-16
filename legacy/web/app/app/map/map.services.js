'use strict'

angular.module('map').
service('mapService', ['API',
    function (API) {


        this.getData = function (results) {
            return getBigData(results);
        }
    }
]);

function getBigData(results) {

    let ret = {
        district: 'none',
        city: 'none',
        country: 'none'
    };

    for (let i = 0; i < results.length; i++) {
        if (results[i].types.indexOf('neighborhood') === -1)
            continue;

        let direction = results[i].address_components;
        for (let q = 0; q < direction.length; q++) {
            if (direction[q].types.indexOf('neighborhood') !== -1)
                ret.district = direction[q].long_name;

                if (direction[q].types.indexOf("country") !== -1)
                    ret.country = direction[q].long_name;

                if (direction[q].types.indexOf('locality') !== -1)
                    ret.city = direction[q].long_name;
        }
    }

    return ret;
}


function getData(results, data) {
    for (let i = 0; i < results.length; i++) {
        if (results[i].types.indexOf(data) === -1)
            continue;

        let direction = results[i].address_components;
        for (let q = 0; q < direction.length; q++) {
            if (direction[i].types.indexOf(data) === -1)
                continue;

            return direction[i].long_name;
        }
    }

    return 'none';
}
