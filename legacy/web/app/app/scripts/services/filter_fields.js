'use strict';

angular.module('TuyoTools')
  .service('FilterFields', function ($stateParams) {
    this.selectedFilters = [];

    this.sorttype = 'insurance__internal_code';
    this.sortreverse = false;
    if($stateParams.ordering){
    	if($stateParams.ordering.substr(0,1)=='-'){
    		this.sorttype = $stateParams.ordering.substr(1,$stateParams.ordering.length);
    		this.sortreverse = true;
    	}else{
    		this.sorttype = $stateParams.ordering;
    	}
    }
  });