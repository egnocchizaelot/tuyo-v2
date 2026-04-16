'use strict';

angular.module('TuyoTools')
  .directive('filters', ['$state', '$stateParams', 'API', 'Auth', 'FilterFields', function ($state, $stateParams, API, Auth, FilterFields) {
    return {
      templateUrl: 'app/views/directives/filters.template.html',
      restrict: 'E',
      scope: {
        'templateUrl': '=?',
        'loadingTemplateUrl': '=?',
        'filtersOptions': '=?',
        'availableFilters': '=?',
        'selectedFilters': '=?',
        'onChangeFilters': '=?'
      },
      link: function postLink(scope,state) {
        scope.showFilters = false;
        scope.filters = [];
        //scope.selectedFilters = scope.selectedFilters || [];
        scope.selectedFilters = scope.selectedFilters || FilterFields.selectedFilters;
        scope.formSelectedFilters = {};
        scope.defaultFormSelectedFilters = {};

        //Id del corredor seleccionado en el momento de crear una solicitud application_new y se filtra el listado de clientes de ese corredor.
        scope.actual_agent_id = 1;
        scope.update_agentId = function(agentId){
          scope.actual_agent_id = agentId;
        }

        //API.get_filters('applications')
        API.get_filters(scope.filtersOptions)
            .then(function(data){
              scope.availableFilters = data;
                scope.loading = false;
                var filter,
                  dataOptions,
                  options;
                angular.forEach(data,function(value){
                  filter = value;
                 if(filter.type==='select'){
                    dataOptions = filter.options;
                    options = [{
                      'id': '0',
                      'dummy': true
                    }];
                    //console.log(filter);
                    options[0][filter.label] = filter.label;
                    //filter.options = options.concat(dataOptions);
                  }
                  filtersByName[value.id] = filter;
                });
            });

        var filtersByName = {};

//Add a comment to this line
        scope.selectFilter = function(filter, value){
          var labelField = filter.label || 'label';
          var valueField = value || 'value';
          var selectedFilter = {
            'filter': filter,
            'value': {
              'label': filter.label,
              'value': value
            }
          };
          var x, isAlreadySelected = false;
          if(filter.type==='select'){
            for(x=0; x<filter.options.length; x++){
              if(filter.options[x].toString()===value.toString()){
                //selectedFilter.value.label = filter.options[x];
                selectedFilter.value.value = filter.options[x];
              }
            }
          }
          if(filter.type==='subselect'){
            var options = filter.options[scope.formSelectedFilters[filter.parent].value],
              optionsLength = options.length;
            for(x=0; x<optionsLength; x++){
              if(options[x][valueField].toString()===value.toString()){
                selectedFilter.value.label = options[x][labelField];
              }
            }
          }
          for(x=0; x<scope.selectedFilters.length; x++){
            if(scope.selectedFilters[x].filter.id === filter.id && scope.selectedFilters[x].value.value === value){
              isAlreadySelected = true;
            }
          }
          if(!isAlreadySelected){
            scope.selectedFilters.push(selectedFilter);
          }
        };

        scope.removeSelectedFilter = function(selectedFilter){
          scope.selectedFilters.splice(scope.selectedFilters.indexOf(selectedFilter),1);
          scope.$emit('FILTERS:CHANGED', scope.selectedFilters);
          FilterFields.selectedFilters = scope.selectedFilters;
          update_filters();
        };

        scope.submitFiltersForm = function($event){
          var filter,
            value;
          angular.forEach(scope.formSelectedFilters, function(formFilter, filterId){
            filter = filtersByName[filterId];
            if(formFilter){
              if(formFilter && formFilter[filter.valueField]){
                if(formFilter.dummy){
                  return;
                }
                value = formFilter[filter.valueField];
              }else{
                value = formFilter;
              }
              scope.selectFilter(filter, value);
            }
          });
          angular.forEach(scope.formSelectedFilters, function(formFilter, filterId){
            filter = filtersByName[filterId];

            /*if(formFilter){
              if(formFilter[filter.valueField]){
                scope.formSelectedFilters[filterId] = filter.options[0];
              }else{
                delete scope.formSelectedFilters[filterId];
              }
            }*/
            if(formFilter){
                scope.formSelectedFilters[filterId] = formFilter;
	        }else{
	          delete scope.formSelectedFilters[filterId];
	        }
          });
          update_filters();

          scope.toggleFiltersForm();
          scope.$emit('FILTERS:CHANGED', scope.selectedFilters);
          $event.preventDefault();
        };

        function update_filters(){
          var status,product,date,client = '';
          var client_name,client_document,client_type,client_email,client_username,client_phone,already_processed = '';
          angular.forEach(scope.selectedFilters, function(formFilter){
            var filter_label = filtersByName[formFilter.filter.id].label;
            if(filter_label === 'Estado'){
              status = formFilter.value.value;
            }
            else if(filter_label === 'Producto'){
              product = formFilter.value.value;
            }
            else if(filter_label === 'Fecha ingreso'){
              var new_date = new Date(formFilter.value.value);
              date = new_date.getUTCFullYear() + '-' + (new_date.getUTCMonth() + 1) + '-' + new_date.getUTCDate();
            }
            else if(filter_label === 'Ver donaciones ya terminadas'){
              already_processed = formFilter.value.value;
            }
          });
          FilterFields.selectedFilters = scope.selectedFilters;
          if(scope.filtersOptions==='donations'){
            $state.go('app.donations.dashboard', {'page':null, 'donation_already_processed':already_processed, 'donation_creator':client, 'donation__state__name': status, 'product__name': product, 'insurance__creation_date': date});
          }
        }

        scope.cleanSelectedFilters = function(){
          scope.selectedFilters = [];
          scope.$emit('FILTERS:CHANGED', scope.selectedFilters);
        };
        scope.toggleFiltersForm = function(){
          scope.showFilters = !scope.showFilters;
        };

        scope.templateUrl = scope.templateUrl || 'app/views/directives/filters.template.html';
      }
    };
  }]);
