//No se esta utilizando actualmente
angular.module('TuyoTools')
  .run(['$state', 'Permission', 'RoleStore', 'Auth', 'API', '$rootScope', function ($state, Permission, RoleStore, Auth, API, $rootScope) {
    Auth.access_modules = {};
    Auth.access_companies = { size: 0 };
    Auth.access_clients = { size: 0 };
    Auth.access_insurances = { size: 0 };
    Auth.access_sinisters = { size: 0 };
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
        // changing the toState name
        Auth.toState = toState;
        //alert('state changed!');
      });

    function setUserAccess(){
      //console.log(angular.toJson($state.get()));
      angular.forEach(Auth.userData.user_permissions.modules, function(value){
        Auth.access_modules[value.module.name] = {
          access: value.access_level.name,
          read_access: (value.access_level.name !== 'Denegado'),
          write_access: (value.access_level.name === 'Coordinador'),
          create_access: ((value.access_level.name !== 'Denegado') && value.can_create_new)
        };
      });
      angular.forEach(Auth.userData.user_permissions.objects, function(value){
        if (value.insurance !== null){
          if (!Auth.access_insurances[value.insurance]){
            Auth.access_insurances.size++;
          }
          Auth.access_insurances[value.insurance] = value.access_level.name;
        }
        else if (value.sinister !== null){
          if (!Auth.access_sinisters[value.sinister]){
            Auth.access_sinisters.size++;
          }
          Auth.access_sinisters[value.sinister] = value.access_level.name;
        }
        else if (value.company !== null){
          if (!Auth.access_insurances[value.company]) {
            Auth.access_companies.size++;
          }
          Auth.access_companies[value.company] = value.access_level.name;
        }
        else if (value.client !== null){
          if (!Auth.access_insurances[value.client]) {
            Auth.access_clients.size++;
          }
          Auth.access_clients[value.client] = value.access_level.name;
        }
      });
    };

    // Define roles
    RoleStore
      .defineRole('superuser', [], function(){
        if(Auth.userData.is_superuser){
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('admin', [], function(){
        var is_admin_of_any_company = $.grep(Auth.userData.user_permissions['admin'], function(e){ return e.role == 'Admin'; })
        if (is_admin_of_any_company[0]){
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('regular', [], function(stateParams){
        setUserAccess();
        var text = '';

        // we are accessing from the decorator in a link on the main menu
        if (stateParams.source && (stateParams.source === 'sidemenu')){
          text = stateParams.target.replace('#/', 'app.insurances.');
        }
        else{
          text = Auth.toState.name;
        }

        // Check for general module access (no special access needed)
        if (API.modules.General.indexOf(text) !== -1){
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('read_access', [], function(stateParams, role){
        setUserAccess();
        var text = '';
        var menu = false;

        // we are accessing from the decorator in a link on the main menu
        if (stateParams.source && (stateParams.source === 'sidemenu')){
          text = stateParams.target.replace('#/', 'app.insurances.');
          menu = true;
        }
        else{
          text = Auth.toState.name;
        }

        // Check for policies module access
        if (API.modules.Polizas.indexOf(text) !== -1){
          if (Auth.access_modules.Polizas && Auth.access_modules.Polizas.read_access){
            return true;
          }
          else{
            if (Auth.access_insurances.size > 0){
              if (menu || (stateParams.insuranceId === undefined)){
                return true;
              }
              else{
                if (Auth.access_insurances[stateParams.insuranceId] && Auth.access_insurances[stateParams.insuranceId] !== 'Denegado'){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for applications module access
        if (API.modules.Solicitudes.indexOf(text) !== -1){
          if (Auth.access_modules.Solicitudes && Auth.access_modules.Solicitudes.read_access){
            return true;
          }
          else{
            if (Auth.access_insurances.size > 0){
              if (menu || (stateParams.insuranceId === undefined)){
                return true;
              }
              else{
                if (Auth.access_insurances[stateParams.insuranceId] && Auth.access_insurances[stateParams.insuranceId] !== 'Denegado'){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for sinister module access
        if (API.modules.Siniestros.indexOf(text) !== -1){
          if (Auth.access_modules.Siniestros && Auth.access_modules.Siniestros.read_access){
            return true;
          }
          else{
            if (Auth.access_sinisters.size > 0){
              if (menu || (stateParams.sinisterId === undefined)){
                return true;
              }
              else{
                if (Auth.access_sinisters[stateParams.sinisterId] && Auth.access_sinisters[stateParams.sinisterId] !== 'Denegado'){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for clients module access
        if (API.modules.Clientes.indexOf(text) !== -1){
          if (Auth.access_modules.Clientes && Auth.access_modules.Clientes.read_access){
            return true;
          }
          else{
            var id = stateParams.clientId || stateParams.userId || undefined;
            if (Auth.access_clients.size > 0){
              if (menu || ((id === undefined) && (stateParams.companyId === ''))){
                return true;
              }
              else{
                if (Auth.access_clients[id] && (Auth.access_clients[id] !== 'Denegado') && (stateParams.companyId === '')){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for companies module access
        if (API.modules.Empresa.indexOf(text) !== -1){
          if (Auth.access_modules.Empresa && Auth.access_modules.Empresa.read_access){
            return true;
          }
          else{
            var id = stateParams.clientId || stateParams.userId || undefined;
            if (Auth.access_companies.size > 0){
              if (menu || ((id === undefined) && (stateParams.companyId === ''))){
                return true;
              }
              else{
                if (Auth.access_companies[stateParams.companyId] && (Auth.access_companies[stateParams.companyId] !== 'Denegado') && (id === undefined)){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for reports module access
        if (API.modules.Reportes.indexOf(text) !== -1){
          if (Auth.access_modules.Reportes && Auth.access_modules.Reportes.read_access){
            return true;
          }
          return false;
        }


        return false;
      });
    RoleStore
      .defineRole('write_access', [], function(stateParams, role){
        setUserAccess();
        var text = '';
        var menu = false;

        // we are accessing from the decorator in a link on the main menu
        if (stateParams.source && (stateParams.source === 'sidemenu')){
          text = stateParams.target;
          menu = true;
        }
        else{
          text = Auth.toState.name;
        }

        // Check for policies module access
        if (API.modules.Polizas.indexOf(text) !== -1){
          if (Auth.access_modules.Polizas && Auth.access_modules.Polizas.write_access){
            return true;
          }
          else{
            if (Auth.access_insurances.size > 0){
              if (menu  || (stateParams.insuranceId === undefined)){
                return true;
              }
              else{
                if (Auth.access_insurances[stateParams.insuranceId] && (Auth.access_insurances[stateParams.insuranceId] === 'Coordinador')){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for applications module access
        if (API.modules.Solicitudes.indexOf(text) !== -1){
          if (Auth.access_modules.Solicitudes && Auth.access_modules.Solicitudes.write_access){
            return true;
          }
          else {
            if (Auth.access_insurances.size > 0) {
              if (menu || (stateParams.insuranceId === undefined)) {
                return true;
              }
              else {
                if (Auth.access_insurances[stateParams.insuranceId] && (Auth.access_insurances[stateParams.insuranceId] === 'Coordinador')) {
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for companies module access
        if (API.modules.Empresa.indexOf(text) !== -1){
          if (Auth.access_modules.Empresa && Auth.access_modules.Empresa.write_access){
            return true;
          }
          else {
            var id = stateParams.clientId || stateParams.userId || undefined;
            if (Auth.access_companies.size > 0) {
              if (menu || (stateParams.companyId === undefined)) {
                return true;
              }
              else {
                if (Auth.access_companies[stateParams.companyId] && (Auth.access_companies[stateParams.companyId] === 'Coordinador')) {
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for clients module access
        if (API.modules.Clientes.indexOf(text) !== -1){
          if (Auth.access_modules.Clientes && Auth.access_modules.Clientes.write_access){
            return true;
          }
          else {
            var id = stateParams.clientId || stateParams.userId || undefined;
            if (Auth.access_clients.size > 0) {
              if (menu || (stateParams.clientId === undefined)) {
                return true;
              }
              else {
                if (Auth.access_clients[id] && (Auth.access_clients[id] === 'Coordinador')) {
                  return true;
                }
              }
            }
          }
          return false;
        }

        if (API.modules.Siniestros.indexOf(text) !== -1){
          if (Auth.access_modules.Siniestros && Auth.access_modules.Siniestros.write_access){
            return true;
          }
          else{
            var id = stateParams.clientId || stateParams.userId || undefined;
            if (Auth.access_sinisters.size > 0){
              if (menu || (stateParams.sinisterId === undefined)){
                return true;
              }
              else{
                if (Auth.access_sinisters[id] && Auth.access_sinisters[id] !== 'Coordinador'){
                  return true;
                }
              }
            }
          }
          return false;
        }

        // Check for reports module access
        if (API.modules.Reportes.indexOf(text) !== -1){
          if (Auth.access_modules.Reportes && Auth.access_modules.Reportes.write_access){
            return true;
          }
          return false;
        }

        return false;
      });
    RoleStore
      .defineRole('create_access', [], function(stateParams, role){
        /*if (Auth.userData.user_permissions['admin']){
          return true;
        }*/
        setUserAccess();
        var text = '';
        // we are accessing from the decorator in a link on the main menu
        if (stateParams.source && (stateParams.source === 'sidemenu')){
          text = stateParams.target;
        }
        else{
          text = Auth.toState.name;
        }

        if (API.modules.Polizas.indexOf(text) !== -1){
          if (Auth.access_modules.Polizas && Auth.access_modules.Polizas.create_access){
            return true;
          }
          return false;
        }
        if (API.modules.Solicitudes.indexOf(text) !== -1){
          if (Auth.access_modules.Solicitudes && Auth.access_modules.Solicitudes.create_access){
            return true;
          }
          return false;
        }
        if (API.modules.Empresa.indexOf(text) !== -1){
          if (Auth.access_modules.Empresa && Auth.access_modules.Empresa.create_access){
            return true;
          }
          return false;
        }
        if (API.modules.Clientes.indexOf(text) !== -1){
          if (Auth.access_modules.Clientes && Auth.access_modules.Clientes.create_access){
            return true;
          }
          return false;
        }
        if (API.modules.Reportes.indexOf(text) !== -1){
          if (Auth.access_modules.Reportes && Auth.access_modules.Reportes.create_access){
            return true;
          }
          return false;
        }
        if (API.modules.Siniestros.indexOf(text) !== -1){
          if (Auth.access_modules.Siniestros && Auth.access_modules.Siniestros.create_access){
            return true;
          }
          return false;
        }
        return false;
      });
    RoleStore
      .defineRole('sinister_access', [], function (stateParams, role) {
        var has_access = false;
        var sinister_access_on_any_company = $.grep(Auth.userData.user_permissions['modules'], function(m){ return m.module.name == 'Siniestros'; })
        angular.forEach(sinister_access_on_any_company, function(value){
          if (value['access_level']['name'] !== 'Denegado'){
            has_access = true;
          }
        });
        return has_access;
      });
    RoleStore
      .defineRole('agent', [], function (stateParams, role) {
        if (Auth.userData.user_permissions["agent"]) {
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('client', [], function (stateParams) {
        if (Auth.userData.user_permissions["insurance_client"]) {
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('broker', [], function (stateParams) {
        if (Auth.userData.user_permissions["broker"]) {
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('is_creating_application', [], function (stateParams) {
        if(stateParams.productId && stateParams.tomadorId && stateParams.tomadorName && stateParams.tomadorType)
        {
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('add_relationship', [], function (stateParams) {
        if(stateParams.type == 'invitations')
        {
          return true;
        }
        if(stateParams.type == 'brokers' && Auth.userData.user_permissions["agent"])
        {
          return true;
        }
        if(stateParams.type == 'agents' && (Auth.userData.user_permissions["broker"] || Auth.userData.user_permissions["insurance_client"] || Auth.userData.user_permissions["agent"]))
        {
          return true;
        }
        if(stateParams.type == 'clients' && (Auth.userData.user_permissions["agent"]))
        {
          return true;
        }
        return false;
      });
    RoleStore
      .defineRole('agent_has_permissions', [], function (stateParams) {
        API.authorized(stateParams.insuranceId, 'agent_permissions')
        .then(function(is_authorized){
          return true;
        },function(){
          return false;
        });
      });
  }]);
