
angular.module('app').factory('TripboardService', ['$resource', 'BASE_URL_8002', 'BASE_URL', 'BASE_URL_API_8004','BASE_URL_MAIN',
  function ($resource, BASE_URL_8002, BASE_URL, BASE_URL_API_8004, BASE_URL_MAIN) {
    return $resource(BASE_URL_8002 + 'tripBoardList', {}, {
      getAllTrips: { method: "POST" },
      getAllSiteList: {
        url: BASE_URL_MAIN + 'getAllSiteList',
        method: "POST"
      },
      savePanicResponse: { url: BASE_URL_8002 + 'save-panic-response', method: 'POST' },
      callOperator: { url: BASE_URL_8002 + 'call-generate-operator', method: 'POST' },
      addRemarkInTripForDriverPanic: { url: BASE_URL_8002 + 'addRemarkInTripForDriverPanic', method: 'POST' },
      forceCompleteTrip: {url: BASE_URL_MAIN+ 'completeThePendingTrip', method: 'POST'}
    });
  }]);



angular.module('app').factory('VehicleLocation', ['$resource', 'BASE_URL_8002', function ($resource, BASE_URL_8002) {
  return $resource(BASE_URL_8002 + 'get-lat-lng-by-tripid/:id');
}]);

angular.module('app').factory('constraintService', function ($resource, BASE_URL_8002) {
  var constraint = $resource(BASE_URL_8002 + 'constraint/deleteConstraint/:id',
    { id: '@id' },
    {
      delete_constraint: {
        method: 'GET'
      }
    });

  return constraint;
});


angular.module('app').factory('TripboardResponse', function () {
  return {
    tempResponse: { "success": true, "data": { "stats": { "all_trips": 10, "ongoing_trips": 1, "delayed_trips": 0, "accepted_trips": 0, "pending_acceptance_trips": 0, "cancelled": 6, "completed": 3, "sos_count": 0 }, "tripsdetails": 
    [
      { "trip_id": 153911, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "13:00", "shift_end_time": "13:00", "shift_id": 495, "vehicle_type": "SUV", "vehicle_model": "TAVERA", "vehicle_number": "MH22TT7888", "driver_id": 1300, "driver_name": "Mahindra Driver", "driver_profile_picture_url": "NA", "no_of_employees": 4, "current_status": "Cancelled", "start_date": "2019-12-30T07:09:43.000Z", "panic_raised": 1, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "11:38:00", "actual_time": "12:39:43", "completed_date": null, "route_id": 557960, "employees_nodes_addresses": [{ "rank": "0", "empId": 5534, "employee_trip_id": 1189887, "total_time": 17, "total_distance": 6, "empName": "Dharmendra  Sharma", "lat": 19.234789, "long": 72.864945, "gender": 1, "special": "no", "emp_on_board_time": "12:39:44", "emp_checkout_time": "12:39:47", "emp_status": "trip_created", "missed_time": null, "eta": "12:39", "empCheckInStatus": "checked", "is_panic": true, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5543, "employee_trip_id": 1189889, "total_time": 18, "total_distance": 5, "empName": "Sneha  Patil", "lat": 19.198454, "long": 72.878492, "gender": 0, "special": "no", "emp_on_board_time": "12:39:44", "emp_checkout_time": "12:39:47", "emp_status": "trip_created", "missed_time": null, "eta": "12:39", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5542, "employee_trip_id": 1189888, "total_time": 12, "total_distance": 3, "empName": "Ramajor  Saroj", "lat": 19.198818, "long": 72.840217, "gender": 1, "special": "no", "emp_on_board_time": "12:39:45", "emp_checkout_time": "12:39:47", "emp_status": "trip_created", "missed_time": null, "eta": "12:39", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "3", "empId": 5544, "employee_trip_id": 1189890, "total_time": 13, "total_distance": 4, "empName": "Jagruti.Mali  ", "lat": 19.202818, "long": 72.827924, "gender": 0, "special": "no", "emp_on_board_time": "12:39:47", "emp_checkout_time": "12:39:47", "emp_status": "trip_created", "missed_time": null, "eta": "12:39", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 82, "trip_start_time": "12:39", "trip_end_time": "12:55", "total_trip_distance": 18, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5534, "emp_name": "Dharmendra  Sharma", "lat": 19.234789, "lng": 72.864945 }, { "emp_id": 5543, "emp_name": "Sneha  Patil", "lat": 19.198454, "lng": 72.878492 }, { "emp_id": 5542, "emp_name": "Ramajor  Saroj", "lat": 19.198818, "lng": 72.840217 }, { "emp_id": 5544, "emp_name": "Jagruti.Mali  ", "lat": 19.202818, "lng": 72.827924 }], "source": { "lat": 19.234789, "lng": 72.864945, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153912, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "14:00", "shift_end_time": "14:00", "shift_id": 496, "vehicle_type": "SUV", "vehicle_model": "TAVERA", "vehicle_number": "MH22TT7888", "driver_id": 1300, "driver_name": "Mahindra Driver", "driver_profile_picture_url": "NA", "no_of_employees": 4, "current_status": "Cancelled", "start_date": "2019-12-30T07:17:02.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "12:11:00", "actual_time": "12:47:02", "completed_date": null, "route_id": 557961, "employees_nodes_addresses": [{ "rank": "0", "empId": 5564, "employee_trip_id": 1189891, "total_time": 10, "total_distance": 3, "empName": "Sachin  Pawar", "lat": 19.25037, "long": 72.85788, "gender": 1, "special": "no", "emp_on_board_time": "12:47:03", "emp_checkout_time": "12:47:06", "emp_status": "trip_created", "missed_time": null, "eta": "12:47", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5558, "employee_trip_id": 1189892, "total_time": 36, "total_distance": 17, "empName": "Anjali  p", "lat": 19.2323, "long": 72.85378, "gender": 1, "special": "no", "emp_on_board_time": "12:52:00", "emp_checkout_time": null, "emp_status": "trip_created", "missed_time": null, "eta": "12:52", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5556, "employee_trip_id": 1189894, "total_time": 13, "total_distance": 3, "empName": "Rahul  Mandadkar", "lat": 19.135745, "long": 72.844612, "gender": 1, "special": "no", "emp_on_board_time": "12:47:02", "emp_checkout_time": "12:47:06", "emp_status": "trip_created", "missed_time": null, "eta": "12:47", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "3", "empId": 5557, "employee_trip_id": 1189893, "total_time": 28, "total_distance": 10, "empName": "Neetha  Kotian", "lat": 19.118198, "long": 72.850913, "gender": 0, "special": "no", "emp_on_board_time": "12:47:03", "emp_checkout_time": "12:47:06", "emp_status": "trip_created", "missed_time": null, "eta": "12:47", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 109, "trip_start_time": "12:47", "trip_end_time": "13:18", "total_trip_distance": 33, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5564, "emp_name": "Sachin  Pawar", "lat": 19.25037, "lng": 72.85788 }, { "emp_id": 5558, "emp_name": "Anjali  p", "lat": 19.2323, "lng": 72.85378 }, { "emp_id": 5556, "emp_name": "Rahul  Mandadkar", "lat": 19.135745, "lng": 72.844612 }, { "emp_id": 5557, "emp_name": "Neetha  Kotian", "lat": 19.118198, "lng": 72.850913 }], "source": { "lat": 19.25037, "lng": 72.85788, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153913, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "17:00", "shift_end_time": "17:00", "shift_id": 498, "vehicle_type": "SUV", "vehicle_model": "TAVERA", "vehicle_number": "MH22TT7888", "driver_id": 1300, "driver_name": "Mahindra Driver", "driver_profile_picture_url": "NA", "no_of_employees": 4, "current_status": "Cancelled", "start_date": "2019-12-30T10:40:56.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "15:43:00", "actual_time": "16:10:56", "completed_date": null, "route_id": 557962, "employees_nodes_addresses": [{ "rank": "0", "empId": 5540, "employee_trip_id": 1189899, "total_time": 7, "total_distance": 1, "empName": "Ekta  Bhadra", "lat": 19.246015, "long": 72.863559, "gender": 0, "special": "no", "emp_on_board_time": "17:09:30", "emp_checkout_time": "17:09:31", "emp_status": "trip_created", "missed_time": null, "eta": "17:09", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5534, "employee_trip_id": 1189900, "total_time": 17, "total_distance": 6, "empName": "Dharmendra  Sharma", "lat": 19.234789, "long": 72.864945, "gender": 1, "special": "no", "emp_on_board_time": "17:09:29", "emp_checkout_time": "17:09:31", "emp_status": "trip_created", "missed_time": null, "eta": "17:09", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5543, "employee_trip_id": 1189902, "total_time": 18, "total_distance": 5, "empName": "Sneha  Patil", "lat": 19.198454, "long": 72.878492, "gender": 0, "special": "no", "emp_on_board_time": "17:09:30", "emp_checkout_time": "17:09:31", "emp_status": "trip_created", "missed_time": null, "eta": "17:09", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "3", "empId": 5542, "employee_trip_id": 1189901, "total_time": 13, "total_distance": 3, "empName": "Ramajor  Saroj", "lat": 19.198818, "long": 72.840217, "gender": 1, "special": "no", "emp_on_board_time": "17:09:30", "emp_checkout_time": "17:09:31", "emp_status": "trip_created", "missed_time": null, "eta": "17:09", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 77, "trip_start_time": "16:10", "trip_end_time": "17:25", "total_trip_distance": 15, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5540, "emp_name": "Ekta  Bhadra", "lat": 19.246015, "lng": 72.863559 }, { "emp_id": 5534, "emp_name": "Dharmendra  Sharma", "lat": 19.234789, "lng": 72.864945 }, { "emp_id": 5543, "emp_name": "Sneha  Patil", "lat": 19.198454, "lng": 72.878492 }, { "emp_id": 5542, "emp_name": "Ramajor  Saroj", "lat": 19.198818, "lng": 72.840217 }], "source": { "lat": 19.246015, "lng": 72.863559, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153930, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "18:00", "shift_end_time": "18:00", "shift_id": 501, "vehicle_type": "SUV", "vehicle_model": "TAVERA", "vehicle_number": "MH22TT7888", "driver_id": 1300, "driver_name": "Mahindra Driver", "driver_profile_picture_url": "NA", "no_of_employees": 4, "current_status": "Cancelled", "start_date": "2019-12-30T11:54:41.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "Yes", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "16:43:00", "actual_time": "17:24:41", "completed_date": null, "route_id": 557979, "employees_nodes_addresses": [{ "rank": "0", "empId": 5540, "employee_trip_id": 1189911, "total_time": 7, "total_distance": 1, "empName": "Ekta  Bhadra", "lat": 19.246015, "long": 72.863559, "gender": 0, "special": "no", "emp_on_board_time": "17:24:57", "emp_checkout_time": "18:25:24", "emp_status": "trip_created", "missed_time": null, "eta": "17:24", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5534, "employee_trip_id": 1189910, "total_time": 17, "total_distance": 6, "empName": "Dharmendra  Sharma", "lat": 19.234789, "long": 72.864945, "gender": 1, "special": "no", "emp_on_board_time": "17:27:40", "emp_checkout_time": "18:25:24", "emp_status": "trip_created", "missed_time": null, "eta": "17:27", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5543, "employee_trip_id": 1189913, "total_time": 18, "total_distance": 5, "empName": "Sneha  Patil", "lat": 19.198454, "long": 72.878492, "gender": 0, "special": "no", "emp_on_board_time": "17:40:25", "emp_checkout_time": "18:25:24", "emp_status": "trip_created", "missed_time": null, "eta": "17:40", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "3", "empId": 5542, "employee_trip_id": 1189912, "total_time": 13, "total_distance": 3, "empName": "Ramajor  Saroj", "lat": 19.198818, "long": 72.840217, "gender": 1, "special": "no", "emp_on_board_time": "18:24:57", "emp_checkout_time": "18:25:24", "emp_status": "trip_created", "missed_time": null, "eta": "18:24", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 77, "trip_start_time": "17:24", "trip_end_time": "18:40", "total_trip_distance": 15, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5540, "emp_name": "Ekta  Bhadra", "lat": 19.246015, "lng": 72.863559 }, { "emp_id": 5534, "emp_name": "Dharmendra  Sharma", "lat": 19.234789, "lng": 72.864945 }, { "emp_id": 5543, "emp_name": "Sneha  Patil", "lat": 19.198454, "lng": 72.878492 }, { "emp_id": 5542, "emp_name": "Ramajor  Saroj", "lat": 19.198818, "lng": 72.840217 }], "source": { "lat": 19.246015, "lng": 72.863559, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153932, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "23:30", "shift_end_time": "23:30", "shift_id": 510, "vehicle_type": "SUV", "vehicle_model": "TAVERA", "vehicle_number": "MH22TT7888", "driver_id": 1300, "driver_name": "Mahindra Driver", "driver_profile_picture_url": "NA", "no_of_employees": 4, "current_status": "Cancelled", "start_date": "2019-12-30T16:26:47.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "21:31:00", "actual_time": "21:56:47", "completed_date": null, "route_id": 557981, "employees_nodes_addresses": [{ "rank": "0", "empId": 5534, "employee_trip_id": 1189922, "total_time": 10, "total_distance": 3, "empName": "Dharmendra  Sharma", "lat": 19.234789, "long": 72.864945, "gender": 1, "special": "no", "emp_on_board_time": "21:57:05", "emp_checkout_time": "22:02:08", "emp_status": "trip_created", "missed_time": null, "eta": "21:57", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5558, "employee_trip_id": 1189925, "total_time": 21, "total_distance": 5, "empName": "Anjali  p", "lat": 19.2323, "long": 72.85378, "gender": 1, "special": "no", "emp_on_board_time": "21:57:36", "emp_checkout_time": "22:02:08", "emp_status": "trip_created", "missed_time": null, "eta": "21:57", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5544, "employee_trip_id": 1189923, "total_time": 39, "total_distance": 10, "empName": "Jagruti.Mali  ", "lat": 19.202818, "long": 72.827924, "gender": 0, "special": "no", "emp_on_board_time": "21:57:36", "emp_checkout_time": "22:02:08", "emp_status": "trip_created", "missed_time": null, "eta": "21:57", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "3", "empId": 5556, "employee_trip_id": 1189924, "total_time": 27, "total_distance": 7, "empName": "Rahul  Mandadkar", "lat": 19.135745, "long": 72.844612, "gender": 1, "special": "no", "emp_on_board_time": "21:57:37", "emp_checkout_time": "22:02:08", "emp_status": "trip_created", "missed_time": null, "eta": "21:57", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 119, "trip_start_time": "21:56", "trip_end_time": "22:27", "total_trip_distance": 25, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5534, "emp_name": "Dharmendra  Sharma", "lat": 19.234789, "lng": 72.864945 }, { "emp_id": 5558, "emp_name": "Anjali  p", "lat": 19.2323, "lng": 72.85378 }, { "emp_id": 5544, "emp_name": "Jagruti.Mali  ", "lat": 19.202818, "lng": 72.827924 }, { "emp_id": 5556, "emp_name": "Rahul  Mandadkar", "lat": 19.135745, "lng": 72.844612 }], "source": { "lat": 19.234789, "lng": 72.864945, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153933, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "23:30", "shift_end_time": "23:30", "shift_id": 511, "vehicle_type": "SUV", "vehicle_model": "TAVERA", "vehicle_number": "MH22TT7888", "driver_id": 1300, "driver_name": "Mahindra Driver", "driver_profile_picture_url": "NA", "no_of_employees": 4, "current_status": "Cancelled", "start_date": "2019-12-30T17:42:02.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "22:07:00", "actual_time": "23:12:02", "completed_date": null, "route_id": 557982, "employees_nodes_addresses": [{ "rank": "0", "empId": 5564, "employee_trip_id": 1189930, "total_time": 16, "total_distance": 4, "empName": "Sachin  Pawar", "lat": 19.25037, "long": 72.85788, "gender": 1, "special": "no", "emp_on_board_time": "23:12:37", "emp_checkout_time": "23:19:12", "emp_status": "trip_created", "missed_time": null, "eta": "23:12", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5534, "employee_trip_id": 1189927, "total_time": 10, "total_distance": 3, "empName": "Dharmendra  Sharma", "lat": 19.234789, "long": 72.864945, "gender": 1, "special": "no", "emp_on_board_time": "23:15:18", "emp_checkout_time": "23:19:12", "emp_status": "trip_created", "missed_time": null, "eta": "23:15", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5558, "employee_trip_id": 1189929, "total_time": 29, "total_distance": 7, "empName": "Anjali  p", "lat": 19.2323, "long": 72.85378, "gender": 1, "special": "no", "emp_on_board_time": "23:16:47", "emp_checkout_time": "23:19:12", "emp_status": "trip_created", "missed_time": null, "eta": "23:16", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "3", "empId": 6194, "employee_trip_id": 1189928, "total_time": 6, "total_distance": 1, "empName": "Mahesh  Varma", "lat": 19.184878, "long": 72.834409, "gender": 1, "special": "no", "emp_on_board_time": "23:16:52", "emp_checkout_time": "23:19:12", "emp_status": "trip_created", "missed_time": null, "eta": "23:16", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 83, "trip_start_time": "23:12", "trip_end_time": "23:25", "total_trip_distance": 15, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5564, "emp_name": "Sachin  Pawar", "lat": 19.25037, "lng": 72.85788 }, { "emp_id": 5534, "emp_name": "Dharmendra  Sharma", "lat": 19.234789, "lng": 72.864945 }, { "emp_id": 5558, "emp_name": "Anjali  p", "lat": 19.2323, "lng": 72.85378 }, { "emp_id": 6194, "emp_name": "Mahesh  Varma", "lat": 19.184878, "lng": 72.834409 }], "source": { "lat": 19.25037, "lng": 72.85788, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153921, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "10:00", "shift_end_time": "19:00", "shift_id": 447, "vehicle_type": "SEDAN", "vehicle_model": "BENZ E CLASS", "vehicle_number": "MH11MU55666", "driver_id": 1302, "driver_name": "Rahul Divekar", "driver_profile_picture_url": "s3.ap-south-1.amazonaws.com/moove-assets-uat10/drivers/profile_pictures/000/001/302/original/profile_pic.jpg?1577187203", "no_of_employees": 2, "current_status": "On Going", "start_date": "2019-12-30T13:32:25.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "Yes", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "09:11:00", "actual_time": "19:02:25", "completed_date": null, "route_id": 557970, "employees_nodes_addresses": [{ "rank": "0", "empId": 5544, "employee_trip_id": 1178971, "total_time": 22, "total_distance": 5, "empName": "Jagruti.Mali  ", "lat": 19.202818, "long": 72.827924, "gender": 0, "special": "no", "emp_on_board_time": "19:05:55", "emp_checkout_time": null, "emp_status": "current", "missed_time": null, "eta": "19:05", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5555, "employee_trip_id": 1179142, "total_time": 11, "total_distance": 3, "empName": "samiksha  shetty", "lat": 19.165466, "long": 72.831105, "gender": 0, "special": "no", "emp_on_board_time": null, "emp_checkout_time": null, "emp_status": "current", "missed_time": null, "eta": "19:30", "empCheckInStatus": "not_checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 49, "trip_start_time": "19:02", "trip_end_time": "19:44", "total_trip_distance": 8, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5544, "emp_name": "Jagruti.Mali  ", "lat": 19.202818, "lng": 72.827924 }, { "emp_id": 5555, "emp_name": "samiksha  shetty", "lat": 19.165466, "lng": 72.831105 }], "source": { "lat": 19.202818, "lng": 72.827924, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153915, "trip_type": "Check Out", "trip_type_status": 1, "shift_time": "17:00", "shift_end_time": "17:00", "shift_id": 446, "vehicle_type": "SEDAN", "vehicle_model": "HONDA CITY", "vehicle_number": "MH50AA1111", "driver_id": 1313, "driver_name": "Karthick Ram", "driver_profile_picture_url": "s3.ap-south-1.amazonaws.com/moove-assets-uat10/drivers/profile_pictures/000/001/313/original/profile_pic.jpg?1577368549", "no_of_employees": 3, "current_status": "completed", "start_date": "2019-12-30T07:25:41.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "17:00:00", "actual_time": "12:55:41", "completed_date": "2019-12-30T09:37:00.000Z", "route_id": 557964, "employees_nodes_addresses": [{ "rank": "0", "empId": 6220, "employee_trip_id": 1189904, "total_time": 21, "total_distance": 5, "empName": "Deekshith singh Kongara", "lat": 19.206685, "long": 72.849332, "gender": 1, "special": "no", "emp_on_board_time": "12:57:48", "emp_checkout_time": "15:06:55", "emp_status": "completed", "missed_time": null, "eta": "15:06", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5540, "employee_trip_id": 1178915, "total_time": 19, "total_distance": 6, "empName": "Ekta  Bhadra", "lat": 19.246015, "long": 72.863559, "gender": 0, "special": "no", "emp_on_board_time": null, "emp_checkout_time": null, "emp_status": "missed", "missed_time": "12:58:37", "eta": "12:58", "empCheckInStatus": "missed", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "2", "empId": 5543, "employee_trip_id": 1178953, "total_time": 17, "total_distance": 8, "empName": "Sneha  Patil", "lat": 19.198454, "long": 72.878492, "gender": 0, "special": "no", "emp_on_board_time": "12:58:41", "emp_checkout_time": "15:07:00", "emp_status": "completed", "missed_time": null, "eta": "15:07", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 131, "trip_start_time": "12:55", "total_trip_distance": 19, "trip_end_time": "15:07", "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 6220, "emp_name": "Deekshith singh Kongara", "lat": 19.206685, "lng": 72.849332 }, { "emp_id": 5540, "emp_name": "Ekta  Bhadra", "lat": 19.246015, "lng": 72.863559 }, { "emp_id": 5543, "emp_name": "Sneha  Patil", "lat": 19.198454, "lng": 72.878492 }], "source": { "lat": 19.179831, "lng": 72.83541, "is_site": true, "site_name": "Vaayu Site" }, "destination": { "lat": 19.198454, "lng": 72.878492, "is_site": false, "site_name": null }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153917, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "08:00", "shift_end_time": "17:00", "shift_id": 446, "vehicle_type": "SEDAN", "vehicle_model": "DZIRE", "vehicle_number": "MH14GU1621MC", "driver_id": 1322, "driver_name": "SHARAD KEDAR", "driver_profile_picture_url": "NA", "no_of_employees": 2, "current_status": "completed", "start_date": "2019-12-30T09:49:12.000Z", "panic_raised": 0, "panic_status": null, "panic_remarks": null, "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "07:13:00", "actual_time": "15:19:12", "completed_date": "2019-12-30T09:49:21.000Z", "route_id": 557966, "employees_nodes_addresses": [{ "rank": "0", "empId": 5543, "employee_trip_id": 1178952, "total_time": 18, "total_distance": 5, "empName": "Sneha  Patil", "lat": 19.198454, "long": 72.878492, "gender": 0, "special": "no", "emp_on_board_time": "15:19:18", "emp_checkout_time": "15:19:21", "emp_status": "completed", "missed_time": null, "eta": "15:19", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5542, "employee_trip_id": 1178933, "total_time": 13, "total_distance": 3, "empName": "Ramajor  Saroj", "lat": 19.198818, "long": 72.840217, "gender": 1, "special": "no", "emp_on_board_time": "15:19:20", "emp_checkout_time": "15:19:21", "emp_status": "completed", "missed_time": null, "eta": "15:19", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 0, "trip_start_time": "15:19", "trip_end_time": "15:19", "total_trip_distance": 8, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5543, "emp_name": "Sneha  Patil", "lat": 19.198454, "lng": 72.878492 }, { "emp_id": 5542, "emp_name": "Ramajor  Saroj", "lat": 19.198818, "lng": 72.840217 }], "source": { "lat": 19.198454, "lng": 72.878492, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } }, 
      
      { "trip_id": 153923, "trip_type": "Check In", "trip_type_status": 0, "shift_time": "16:02", "shift_end_time": "19:02", "shift_id": 499, "vehicle_type": "SEDAN", "vehicle_model": "HONDA CITY", "vehicle_number": "MH50AA1111", "driver_id": 1313, "driver_name": "Karthick Ram", "driver_profile_picture_url": "s3.ap-south-1.amazonaws.com/moove-assets-uat10/drivers/profile_pictures/000/001/313/original/profile_pic.jpg?1577368549", "no_of_employees": 2, "current_status": "completed", "start_date": "2019-12-30T11:15:43.000Z", "panic_raised": 1, "panic_status": "closed", "panic_remarks": "done", "guard_assigned": "No", "site_id": 133, "current_lat": null, "current_lng": null, "planned_time": "14:52:00", "actual_time": "16:45:43", "completed_date": "2019-12-30T12:55:25.000Z", "route_id": 557972, "employees_nodes_addresses": [{ "rank": "0", "empId": 5556, "employee_trip_id": 1179161, "total_time": 30, "total_distance": 11, "empName": "Rahul  Mandadkar", "lat": 19.135745, "long": 72.844612, "gender": 1, "special": "no", "emp_on_board_time": "16:49:41", "emp_checkout_time": "18:25:25", "emp_status": "completed", "missed_time": null, "eta": "16:49", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }, { "rank": "1", "empId": 5546, "employee_trip_id": 1179009, "total_time": 24, "total_distance": 6, "empName": "Kivisha  Jain", "lat": 19.207557, "long": 72.873809, "gender": 0, "special": "no", "emp_on_board_time": "17:05:50", "emp_checkout_time": "18:25:25", "emp_status": "completed", "missed_time": null, "eta": "17:05", "empCheckInStatus": "checked", "is_panic": false, "panic_id": null, "panic_message": "" }], "total_trip_time_minutes": 99, "trip_start_time": "16:45", "trip_end_time": "18:25", "total_trip_distance": 17, "trip_driver_is_panic": false, "trip_is_panic": false, "map_data": { "wayPoints": [{ "emp_id": 5556, "emp_name": "Rahul  Mandadkar", "lat": 19.135745, "lng": 72.844612 }, { "emp_id": 5546, "emp_name": "Kivisha  Jain", "lat": 19.207557, "lng": 72.873809 }], "source": { "lat": 19.135745, "lng": 72.844612, "is_site": false, "site_name": null }, "destination": { "lat": 19.179831, "lng": 72.83541, "site_name": "Vaayu Site", "is_site": true }, "current_location": { "lat": null, "lng": null } } 
    }] 

  }, "errors": {}, "message": "Trip Board listed successfully" }
  }
});