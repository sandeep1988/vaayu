
angular.module('app').factory('RosterService', ['$resource','BASE_URL_8002','BASE_URL',
function ($resource,BASE_URL_8002,BASE_URL) {
    return $resource(BASE_URL_8002+'roasterlist', {}, {
        // query: { method: "GET", isArray: true },
        // create: { method: "POST"},
        get: { method: "POST"},
        // remove: { method: "DELETE"},
        // update: { method: "PUT"}
        addVehicle:{
          url: BASE_URL_8002 + 'addvehicle',
          method: "POST"
        },
        getAllSiteList:{
          url: BASE_URL + 'getAllSiteList',
          method: "POST"
        },
        addCustomEmployee:{
          url: 'http://8e1d7a0d.ngrok.io/api/v1/' + 'adhoc_employee_route',
          method: "POST"
        },
        getEmployeeList:{
          url: 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8002/api/v1/' + 'get_all_employees',
          method: "POST"
        },
    });

}]);



