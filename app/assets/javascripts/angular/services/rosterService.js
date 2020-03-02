
angular.module('app').factory('RosterService', ['$resource', 'BASE_URL_8002','BASE_URL','BASE_URL_API_8002', 'BASE_URL_API_8005',
function ($resource, BASE_URL_8002, BASE_URL,BASE_URL_API_8002, BASE_URL_API_8005) {
  return $resource(BASE_URL_8002 + 'roasterlist', {}, {
    // query: { method: "GET", isArray: true },
    // create: { method: "POST"},
    get: { method: "POST" },
    // remove: { method: "DELETE"},
    // update: { method: "PUT"}
    addVehicle: {
      url: BASE_URL_8002 + 'addvehicle',
      method: "POST"
    },
    downloadSample: {
      url: BASE_URL_API_8002 + 'employeeupload/downloadEmployeeExcel/:siteId',
      method: "GET"
    },
    isDownloadable: {
      url: BASE_URL_8002 + 'is-downloadable-employee-excel/:site_id',
      method: "GET"
    },
    getAllSiteList: {
      url: BASE_URL + 'getAllSiteList',
      method: "POST"
    },
    addCustomEmployee: {
      url: BASE_URL_8002 + 'adhoc_employee_route',
      method: "POST"
    },
    getEmployeeList: {
      url: BASE_URL_8002 + 'get_all_employees',
      method: "POST"
    },
    getEmployeesInRoster: {
      url: BASE_URL_8002 + 'getRosterEmpDetails',
      method: "POST"
    },
    uploadExcel :{
      url: BASE_URL_8002 + 'upload-employee-shedule',
      method: "POST"
    },
    exportReport: {
      url: BASE_URL_API_8005 + 'tripReport/ksjdfhsi5735936',
      method: "POST"
    },
    isExcelDownloadable: {
      url: BASE_URL_8002 + 'isReportsDownloadable/ksjdfhsi5735936/:siteId/:fromDate/:toDate',
      method: 'GET'
    },
    copyRoutes: {
      url: BASE_URL_8002 + 'copyexistingroutes',
      method: 'POST'
    },
    userRoles: {
      url: BASE_URL_8002 + 'auth/roles-modules-list',
      method: 'GET'
    }

  });

}]);

angular.module('app').factory('RosterStaticResponse', function () {

return {

  staticResponse: {

    "success": true,
    "data": {
      "stats": {
        "on_duty": 2,
        "off_duty": 0,
        "shift_count": 3,
        "left_for_allocation": 0,
        "tot_emp": 9
      },
      "shiftdetails": [
        {
          "id": 237,
          "name": "Rishikesh Site 5pm",
          "trip_type": 0,
          "emp_id": 1155473,
          "start_time": "17:00:00",
          "et_date": "2019-11-25T18:30:00.000Z",
          "et_time": "17:00:00",
          "shift_start_time": "17:00:00",
          "shift_end_time": "22:00:00",
          "no_of_emp": 3,
          "shift_type": "Check In",
          "vehicle": {
            "SEDAN": 0,
            "SUV": 0,
            "BUS": 0,
            "MINI VAN": 0,
            "HATCHBACK": 0,
            "TRUCK": 0,
            "TT": 0
          },
          "vehicle_capacity": {
            "SEDAN": 4,
            "SUV": 2,
            "BUS": 12,
            "MINI VAN": 10,
            "HATCHBACK": 5,
            "TRUCK": 2,
            "TT": 4
          },
          "total_vehicles": 0,
          "seats_left_for_alloc": 0,
          "empl_left_for_alloc": 3,
          "result": "REQUIRED MORE VEHICLE",
          "disableGenerate": false,
          "subtractedDate": "2019-11-26 15:00:00",
          "istDate": "2019-11-18 18:05:48",
          "shiftDate": "2019-11-26 17:00:00",
          "constraintTime": "120",
          "routesGenerated": false
        },
        {
          "id": 247,
          "name": "rushikesh shift 5pm",
          "trip_type": 0,
          "emp_id": 1155473,
          "start_time": "17:00:00",
          "et_date": "2019-11-25T18:30:00.000Z",
          "et_time": "17:00:00",
          "shift_start_time": "17:00:00",
          "shift_end_time": "19:00:00",
          "no_of_emp": 3,
          "shift_type": "Check In",
          "vehicle": {
            "HATCHBACK": 0,
            "SUV": 3,
            "TT": 0,
            "SEDAN": 0,
            "BUS": 0,
            "MINI VAN": 0,
            "TRUCK": 0
          },
          "vehicle_capacity": {
            "SEDAN": 8,
            "SUV": 2,
            "BUS": 10,
            "MINI VAN": 8,
            "HATCHBACK": 5,
            "TRUCK": 8,
            "TT": 10
          },
          "total_seats": 6,
          "total_vehicles": 3,
          "seats_left_for_alloc": 3,
          "result": "GOOD TO GO",
          "empl_left_for_alloc": 0,
          "disableGenerate": false,
          "routesGenerated": true
        },
        {
          "id": 247,
          "name": "rushikesh shift 5pm",
          "trip_type": 1,
          "emp_id": 1155472,
          "start_time": "19:00:00",
          "et_date": "2019-11-25T18:30:00.000Z",
          "et_time": "19:00:00",
          "shift_start_time": "17:00:00",
          "shift_end_time": "19:00:00",
          "no_of_emp": 3,
          "shift_type": "Check Out",
          "vehicle": {
            "HATCHBACK": 0,
            "SUV": 3,
            "TT": 0,
            "SEDAN": 0,
            "BUS": 0,
            "MINI VAN": 0,
            "TRUCK": 0
          },
          "vehicle_capacity": {
            "SEDAN": 8,
            "SUV": 8,
            "BUS": 10,
            "MINI VAN": 8,
            "HATCHBACK": 5,
            "TRUCK": 8,
            "TT": 10
          },
          "total_seats": 24,
          "total_vehicles": 3,
          "seats_left_for_alloc": 21,
          "result": "GOOD TO GO",
          "empl_left_for_alloc": 0,
          "disableGenerate": false,
          "routesGenerated": true
        }
      ],
      "site_id": 51,
      "to_date": "2019-11-26"
    },
    "errors": {},
    "message": ""
  }
}
});

