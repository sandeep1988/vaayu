angular.module('app').controller('rosterCtrl', function ($scope, RosterService, RouteService, ToasterService, SiteService, $http) {


  $scope.init = function () {
    $scope.SelectedEmp = [];
    $scope.example14settings = {
      scrollableHeight: '200px',
      scrollable: true,
      enableSearch: true,
      width: '300px'
    };

    $scope.isAddMenuOpen = false;
    $scope.isAddMenuOpen2 = false;

    $scope.today();

    $scope.defaultVehiclesList = {
      HATCHBACK: 0,
      SUV: 0,
      TT: 0,
      SEDAN: 0,
      BUS: 0,
      'MINI VAN': 0,
      TRUCK: 0,
    };

    $scope.defaultVehiclesCapacityList = {
      SEDAN: 8,
      SUV: 8,
      BUS: 10,
      'MINI VAN': 8,
      HATCHBACK: 5,
      TRUCK: 8,
      TT: 10
    }
    // date picket
    $scope.toggleMin();
    $scope.isDoneDisabled = true;

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];


    RosterService.getAllSiteList(function (data) {
      $scope.siteList = data.data.list;
      $scope.selectedSite = $scope.siteList[0];
      let postData = {
        "site_id": $scope.siteList[0].id,
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
      }


      $scope.getRosters(postData);
    }
      , function (error) {
        console.error(error);
      });;

  }

  $scope.updateFilters = function () {

    let postData = {
      "site_id": $scope.selectedSite.id,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }

    if ($scope.shift_type) {
      postData.shift_type = $scope.shift_type;
    }
    console.log(postData)
    $scope.getRosters(postData)

  }


  $scope.getRosters = (postData) => {
    RosterService.get(postData, function (data) {
      var staticData={
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
                    "seats_left_for_alloc": 0,
                    "empl_left_for_alloc": 3,
                    "result": "REQUIRED MORE VEHICLE",
                    "disableGenerate": false,
                    "subtractedDate": "2019-11-26 15:00:00",
                    "istDate": "2019-11-15 17:04:44",
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
                    "seats_left_for_alloc": 0,
                    "empl_left_for_alloc": 3,
                    "result": "REQUIRED MORE VEHICLE",
                    "disableGenerate": false,
                    "subtractedDate": "2019-11-26 17:00:00",
                    "istDate": "2019-11-15 17:04:44",
                    "shiftDate": "2019-11-26 19:00:00",
                    "constraintTime": "120",
                    "routesGenerated": false
                }
            ],
            "site_id": 51,
            "to_date": "2019-11-26"
        },
        "errors": {},
        "message": ""
    };
      if (staticData.data) {
        $scope.rosters = staticData.data.shiftdetails;
        $scope.stats = staticData.data.stats;
        console.log('rosters', $scope.rosters);

      }
    }
      , function (error) {
        console.error(error);
      });
  }

  // datepicker function
  $scope.today = function () {
    $scope.filterDate = new Date();
  };

  $scope.clear = function () {
    $scope.filterDate = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    // return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    return false;
  };

  $scope.toggleMin = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  //date picker function

  $scope.generateRoutes = function (roster) {
    // console.log(roster);
    // console.log($scope.selectedSite);
    // console.log($scope.filterDate)

    let shift_type = 0;
    if (roster.shift_type.toLowerCase() === 'check out') {
      shift_type = 1;
    }

    let postData = {
      "site_id": parseInt($scope.selectedSite.id),
      "shift_id": parseInt(roster.id),
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD'),
      "search": '0',
      "shift_type": shift_type // 0 -checkin 1-checout
    }
    console.log(postData)

    RouteService.getRoutes(postData,
      (res) => {
        console.log(res);
        if (res['success']) {
          ToasterService.showSuccess('Success', 'Route generated successfully.');
        } else {
          ToasterService.showError('Error', res['message']);
        }

      }, (error) => {
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
        console.error(error);
      });
  }

  $scope.addVehicleToRoster = function (roster) {
    $scope.currentRoster = angular.copy(roster);
    // console.log($scope.currentRoster.vehicle);
    // console.log(angular.equals($scope.currentRoster.vehicle, {}));
    if (angular.equals($scope.currentRoster.vehicle, {})) {
      $scope.currentRoster.total_seats = 0;
      $scope.currentRoster.total_vehicles = 0;
      $scope.currentRoster.vehicle = $scope.defaultVehiclesList;
      $scope.currentRoster.vehicle_capacity = $scope.defaultVehiclesCapacityList;
      
    } else if (!$scope.currentRoster.vehicle) {
      $scope.currentRoster.total_seats = 0;
      $scope.currentRoster.total_vehicles = 0;
      $scope.currentRoster.vehicle = $scope.defaultVehiclesList;
      $scope.currentRoster.vehicle_capacity = $scope.defaultVehiclesCapacityList;
     
    }
    $scope.disableDone(roster);

    // Open Side View
    $scope.isAddMenuOpen = true;
    console.log($scope.currentRoster);
  }

  $scope.hideAddMenu = function () {
    $scope.isAddMenuOpen = false;
    $scope.defaultVehiclesList = {
      HATCHBACK: 0,
      SUV: 0,
      TT: 0,
      SEDAN: 0,
      BUS: 0,
      'MINI VAN': 0,
      TRUCK: 0,
    };



  }

  $scope.plusVehicle = function (key) {
    $scope.currentRoster.vehicle[key] = parseInt($scope.currentRoster.vehicle[key]) + 1;
    $scope.currentRoster.total_vehicles = parseInt($scope.currentRoster.total_vehicles) + 1;
    if ($scope.currentRoster.vehicle_capacity[key]) {
        if(!!$scope.currentRoster.total_seats)$scope.currentRoster.total_seats = parseInt($scope.currentRoster.total_seats) + parseInt($scope.currentRoster.vehicle_capacity[key]);
        else { $scope.currentRoster.total_seats = 0 + parseInt($scope.currentRoster.vehicle_capacity[key]);
        }
    
      }
    $scope.disableDone($scope.currentRoster);

  }

  $scope.minusVehicle = function (key) {
    if (parseInt($scope.currentRoster.vehicle[key]) > 0) {
      $scope.currentRoster.vehicle[key] = parseInt($scope.currentRoster.vehicle[key]) - 1
      $scope.currentRoster.total_vehicles = parseInt($scope.currentRoster.total_vehicles) - 1;
      if ($scope.currentRoster.vehicle_capacity[key]) {
        $scope.currentRoster.total_seats = parseInt($scope.currentRoster.total_seats) - parseInt($scope.currentRoster.vehicle_capacity[key]);
      }

      $scope.disableDone($scope.currentRoster);
    }
  }

  $scope.submitAddVehicle = function () {

    let postData = {
      id: $scope.currentRoster.id,
      no_of_emp: $scope.currentRoster.no_of_emp,
      vehicle: $scope.currentRoster.vehicle,
      total_seats: $scope.currentRoster.total_seats,
      vehicle_capacity: $scope.currentRoster.vehicle_capacity,
      to_date: moment($scope.filterDate).format('YYYY-MM-DD'),
      total_vehicles: $scope.currentRoster.total_vehicles,
      trip_type: $scope.currentRoster.trip_type,
    }

    console.log('vehicleAdd', postData)
    RosterService.addVehicle(postData, function (result) {
      console.log('vehicleAdd', result)
      if (!result['success']) {
        ToasterService.showError('Error', result['message']);
        return;
      }
      $scope.isAddMenuOpen = false;
      $scope.updateFilters();
      $scope.defaultVehiclesList = {
        HATCHBACK: 0,
        SUV: 0,
        TT: 0,
        SEDAN: 0,
        BUS: 0,
        'MINI VAN': 0,
        TRUCK: 0,
      };


    });

  }

  $scope.disableDone = roster => {

    if (!roster.total_seats) {
      $scope.isDoneDisabled = true;
    }
    else if (roster.total_seats < roster.no_of_emp) {
      $scope.isDoneDisabled = true;
    } else {
      $scope.isDoneDisabled = false;
    }
  }


  //mansi changes

  $scope.getEmployeeList = function () {

    let postData = {
      "siteId": $scope.selectedSite.id,
      "date": moment($scope.filterDate).format('YYYY-MM-DD'),
      //"searchText":'',
    }
    console.log(postData);
    RosterService.getEmployeeList(postData, function (res) {
      console.log('Emp list')
      $scope.EmpList = res.data.employeeList;
      console.log(res.data);
    }, function (error) {
      console.log(error);
    });
  }

  $scope.addCustomeRoute = function () {
    $scope.getEmployeeList();
    $scope.isAddMenuOpen2 = true;
  }
  $scope.hideAddMenu2 = function () {
    $scope.isAddMenuOpen2 = false;
    $scope.SelectedEmp = [];
  }
  $scope.submitAddCustomRoute = function (selectedShift, to_time) {
    if ($scope.SelectedEmp.length == 0) {
      ToasterService.showError('Error', 'Select atleast one Employee');
      return;
    } else if (moment($scope.filterDate).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
      ToasterService.showError('Error', 'Selected date should not be smaller than todays date.');
      return;
    }
    var employeeIds = $scope.SelectedEmp.map(emp => emp.id);
    let postData = {
      siteId: $scope.selectedSite.id,
      tripType: selectedShift,
      date: moment($scope.filterDate).format('YYYY-MM-DD'),
      shiftTime: moment(to_time).format('HH:mm'),
      employeeIds: employeeIds
    }
    console.log(postData);
    RosterService.addCustomEmployee(postData,
      (res) => {

        if (res['success']) {
          console.log(res);
          ToasterService.showSuccess('Success', 'Custom Route generated successfully.');
          $scope.SelectedEmp = [];
          $scope.isAddMenuOpen2 = false;
          $scope.updateFilters();
        } else {
          ToasterService.showError('Error', res['message']);
          return;
        }
      }, (error) => {
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
      });
  }

});
