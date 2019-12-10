
angular.module('app').factory('TripboardService',['$resource','BASE_URL_8002','BASE_URL',
 function($resource,BASE_URL_8002,BASE_URL) {
    return $resource(BASE_URL_8002+'tripBoardList',{},{
        getAllTrips: { method: "POST"},
        getAllSiteList:{
          url: BASE_URL + 'getAllSiteList',
          method: "POST"
        },
        savePanicResponse: {url: BASE_URL_8002+'save-panic-response', method: 'POST'},
        callOperator: {url: BASE_URL_8002+'call-generate-operator', method: 'POST'}
    });
}]);


// angular.module('app').factory('TripboardBoardCommentService',['$resource','BASE_URL_8002','BASE_URL',
//  function($resource,BASE_URL_8002,BASE_URL) {
//     return $resource(BASE_URL_8002+'save-panic-response',{},{
//         get: { method: "POST"},
//     });
// }]);

// angular.module('app').factory('TripboardBoardCallService',['$resource','BASE_URL_8002','BASE_URL',
//  function($resource,BASE_URL_8002,BASE_URL) {
//     return $resource(BASE_URL_8002+'call-generate-operator',{},{
//         get: { method: "POST"},
//         callEmployee: {
//           url: 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8007/api/call-generate-driver-employee',
//           method: "POST"
//         },
//     });
// }]);


angular.module('app').factory('TripboardResponse', function () {
  return {
    tempResponse : {
      "stats": {
        "all_trips": 3,
        "ongoing_trips": 1,
        "delayed_trips": 0,
        "accepted_trips": 4,
        "pending_acceptance_trips": 0,
        "cancelled": 3
      },
      "tripsdetails": [{
        "trip_id": 138,
        "trip_type": "checkin",
        "shift_time": "09:00 AM",
        "vehicle_type": 'SUV',
        "vehicle_model": 'CRETA',
        "vehicle_number": "MH43K7867",
        "driver_name": 'Ram Kumar',
        "no_of_employees": 16,
        "current_status": "cancelled",
        "tripInfo": [{
  
          "routeId": 23423232342344,
          "total_time": 90,
          "total_distabce": 40,
          "tripStartTime": "09:00",
          "tripEndTime": "10:00",
          "vehicle_type": "SUV",
          "total_seats": 5,
          "empty_seats": 2,
          "guard_required": "Y",
          "vehicle_allocated": "N",
          "trip_cost": 100,
          "driver_id": "",
          "driver_profile_image": "",
        }],
        "employees_nodes_addresses": [{
          "rank": 1,
          "empId": 12312,
          "empName": "Deekshith M",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 2,
          "empId": 12312,
          "empName": "Umar Sayyed",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 3,
          "empId": 12312,
          "empName": "Ajay Sharma",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 4,
          "empId": 12312,
          "empName": "Vaibhavi Rawale",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 1,
          "empId": 12312,
          "empName": "Deekshith M",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 2,
          "empId": 12312,
          "empName": "Umar Sayyed",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 3,
          "empId": 12312,
          "empName": "Ajay Sharma",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 4,
          "empId": 12312,
          "empName": "Vaibhavi Rawale",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 1,
          "empId": 12312,
          "empName": "Deekshith M",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 2,
          "empId": 12312,
          "empName": "Umar Sayyed",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 3,
          "empId": 12312,
          "empName": "Ajay Sharma",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 4,
          "empId": 12312,
          "empName": "Vaibhavi Rawale",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        }
        ]
      },
      {
        "trip_id": 138,
        "trip_type": "checkin",
        "shift_time": "09:00 AM",
        "vehicle_type": 'SUV',
        "vehicle_model": 'CRETA',
        "vehicle_number": "MH43K7867",
        "driver_name": 'Ram Kumar',
        "no_of_employees": 4,
        "current_status": "cancelled",
        "tripInfo": [{
  
          "routeId": 23423232342344,
          "total_time": 90,
          "total_distabce": 40,
          "tripStartTime": "09:00",
          "tripEndTime": "10:00",
          "vehicle_type": "SUV",
          "total_seats": 5,
          "empty_seats": 2,
          "guard_required": "Y",
          "vehicle_allocated": "N",
          "trip_cost": 100,
          "driver_id": "",
          "driver_profile_image": "",
        }],
        "employees_nodes_addresses": [{
          "rank": 1,
          "empId": 12312,
          "empName": "Rushikesh Indulkar",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 2,
          "empId": 12312,
          "empName": "Mansi Sawant",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 3,
          "empId": 12312,
          "empName": "Dhruv Sharma",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 4,
          "empId": 12312,
          "empName": "Sohel Khan",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        }
        ]
      },
      {
        "trip_id": 138,
        "trip_type": "checkin",
        "shift_time": "09:00 AM",
        "vehicle_type": 'SUV',
        "vehicle_model": 'CRETA',
        "vehicle_number": "MH43K7867",
        "driver_name": 'Ram Kumar',
        "no_of_employees": 4,
        "current_status": "cancelled",
        "tripInfo": [{
  
          "routeId": 23423232342344,
          "total_time": 90,
          "total_distabce": 40,
          "tripStartTime": "09:00",
          "tripEndTime": "10:00",
          "vehicle_type": "SUV",
          "total_seats": 5,
          "empty_seats": 2,
          "guard_required": "Y",
          "vehicle_allocated": "N",
          "trip_cost": 100,
          "driver_id": "",
          "driver_profile_image": "",
        }],
        "employees_nodes_addresses": [{
          "rank": 1,
          "empId": 12312,
          "empName": "Veer Singh",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 2,
          "empId": 12312,
          "empName": "Praveen Singh",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 3,
          "empId": 12312,
          "empName": "Pushp S",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        },
        {
          "rank": 4,
          "empId": 12312,
          "empName": "Kirti Sharma",
          "lat": "123123123.23",
          "long": "23423423423.234",
          "gender": "M",
          "special": "Yes"
        }
        ]
      }
      ]
  
    }
  }
});