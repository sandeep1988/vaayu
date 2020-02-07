

angular.module('app').controller('rosterCtrl', function ($scope, RosterService, RouteService, ToasterService, RosterStaticResponse, $http, BASE_URL_API_8002, BASE_URL_8002,SessionService, $timeout) {

  $scope.baseUrl = BASE_URL_API_8002;
  $scope.baseUrl2 = BASE_URL_8002;

  $scope.toggleView = false;
  $scope.init = function () {

    $scope.toggleView = true;
    ToasterService.showSuccess('Success', 'Success');
    $scope.SelectedEmp = [];
    $scope.example14settings = {
      scrollableHeight: '200px',
      scrollable: true,
      enableSearch: true,
      width: '300px'
    };

    $scope.isAddMenuOpen = false;
    $scope.isAddMenuOpen2 = false;



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

    $scope.isDoneDisabled = true;
    // date picket
    $scope.toggleMin();
    $scope.today();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.toDateFormat = $scope.formats[0];
    $scope.toCopyDateFormat = $scope.formats[0];

    $scope.getAllSiteList();

  }

  $scope.selectedSiteId;

  $scope.getAllSiteList = () => {
    RosterService.getAllSiteList(function (data) {
      $scope.siteList = data.data.list;
      $scope.selectedSite = $scope.siteList[0];
      let postData = {
        "site_id": $scope.siteList[0].id,
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
      }


      $scope.getRosters(postData);
    }, function (error) {
      console.error(error);
    });

  }

  $scope.updateFilters = function () { 
    let postData = {
      "site_id": $scope.selectedSite.id,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }
    $scope.selectedSiteId = $scope.selectedSite.id;

    if ($scope.shift_type) {
      postData.shift_type = $scope.shift_type;
    }
    // console.log(postData)
    $scope.getRosters(postData)

  }

  $scope.disableBtn = true;

  $scope.showPopup = false;

  $scope.showPopupWindow = (roster) => {

    console.log('selectedRoster', roster)
    $scope.selectedRoster = roster;
    let postData = {
      siteId: $scope.selectedSite.id + '',
      to_date: moment($scope.filterDate).format('YYYY-MM-DD'),
      shiftId: roster.id + '',
      tripType: roster.trip_type + ''
    }
    $scope.real_roster_employees = [];
    RosterService.getEmployeesInRoster(postData, (res) => {
      console.log('getEmployeesInRoster', res);
      $scope.showPopup = true;

      if (res['success']) {
        $scope.real_roster_employees = res.data;
        $scope.roster_employees = res.data;
      } else {
        $scope.toggleView = true;
        console.log('showing on roster')
        ToasterService.showError('Error', res['message']);
      }

    }, (error) => {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Something went wrong, Try again later.');
      console.error(error);
    });
  }


  $scope.showUploadDialog = false;

  $scope.showUploadWindow = () => {


    $scope.showUploadDialog = true;

    // let postData = {
    //   siteId: $scope.selectedSite.id+'',
    // }

    // RosterService.uploadExcel(postData,  (res) => {
    //   $scope.showUploadDialog=true;
    // }, (error) => {

    // });
  }




  $scope.fileNameChanged = function (e) {
    // console.log(e.files)
    $scope.fileObject = e.files[0];
    console.log('selected file', $scope.fileObject)
    if($scope.fileObject){
      $scope.disableBtn = false;
    }
    $timeout(() => {
      $scope.tempfileName = $scope.fileObject.name;
    }, 50)
  }

  $scope.mainSiteId;
  $scope.uploadExcelData = function () {

    if($scope.fileObject){
      var formData = new FormData();
      $scope.isLoader =true;
      formData.append("excelPath", $scope.fileObject);
      formData.append("siteId", $scope.selectedSite.id);
      $scope.mainSiteId = $scope.selectedSite.id;
      var request = new XMLHttpRequest();
      var vm = $scope;
      request.open("POST", this.baseUrl + "upload-employee-shedule");
      request.onload = function () {
        var resData = JSON.parse(request.response)
        // alert(resData.success);
        console.log('resData', resData)
        
        if (resData.success) {
          $scope.isLoader =false;
          $scope.toggleView = true;
          ToasterService.showSuccess('Success', "File upload success");
        } else {
          if(Array.isArray(resData.errors) && resData.errors.length != 0){
            $scope.isLoader =false;
            $scope.toggleView = true;
            ToasterService.showSuccess('Error', resData.errors.toString());
          } else {
            $scope.isLoader =false;
            $scope.toggleView = true;
            ToasterService.showSuccess('Error', resData.message);
          }
          
          // showErrorToast('Error', resData.message)
        }
      };
  
      
  
      request.setRequestHeader('uid', SessionService.uid);
      request.setRequestHeader('access_token', SessionService.access_token);
      request.setRequestHeader('client', SessionService.client)
      request.send(formData);
    }else{
      $scope.toggleView = true;
      $scope.isLoader =false;
      showErrorToast('Error', 'Please select File First!')
    }
    
  }

  function showErrorToast(error, message) {
    ToasterService.showError(error, message);
  }

  $scope.isDownload = false;
  $scope.isLoader =false;

  $scope.CheckIsDownloadeble = function () {
    
    $http({
      method: 'GET',
      url: this.baseUrl2 + 'is-downloadable-employee-excel/' + $scope.selectedSite.id
    }).then(function successCallback(res) {
        console.log('response: ', res)
        if (res['data'].success == false) {
          ToasterService.clearToast();
          $scope.toggleView = true;
          ToasterService.showError('Error', res.data.message)
        } else {
          $scope.toggleView = true;
          ToasterService.showSuccess('Success', res.data.message)
          $scope.downloadSample();
        }
      }, function errorCallback(err) {
        console.log('error: ', err)
      });

  }

  $scope.downloadSample = function () {
      var url = this.baseUrl + 'employeeupload/downloadEmployeeExcel/' + $scope.selectedSite.id;
      $scope.isLoader =true;
    
      var link = document.createElement('a');
      link.href = url;
      link.target = "_blank";
      
  
      $http({
        method: 'GET',
        url: url,
        headers: {
          'Content-type': 'application/json'
       },
       responseType: 'arraybuffer'
      }).then(function successCallback(res) {
          $scope.isLoader =false;
        }, function errorCallback(err) {
          $scope.isLoader =false;
          console.log('error: ', err)
        });

        link.click();
  }


  $scope.onEmployeeSearch = () => {
    var searchString = $scope.employee_name_search.trim().toLowerCase();

    if (searchString === "") {
      $scope.roster_employees = $scope.real_roster_employees;
      return;
    }
    var array = [];
    for (let item of $scope.real_roster_employees) {
      if (item.empName.trim().toLowerCase().startsWith(searchString)) {
        array.push(item)
      }
    }
    $scope.roster_employees = array;
  }

  $scope.getRosters = (postData) => {
    console.log('getRosters params', postData)
    $scope.isLoader= true;
    RosterService.get(postData, function (data) {
      console.log('rosters res', data);
      if (data.data) {
        $scope.isLoader =false;
        console.log('loader off');
        // var data = RosterStaticResponse.staticResponse;
        $scope.rosters = data.data.shiftdetails;
        console.log('check rosters', $scope.rosters)
        $scope.stats = data.data.stats;


      }
    }
      , function (error) {
        $scope.isLoader =false;
        console.error(error);
      });
  }

  // datepicker function
  $scope.today = function () {
    $scope.filterDate = new Date();
    $scope.toDate = new Date();
    $scope.toCopyDate = new Date();
  };

  $scope.clear = function () {
    $scope.filterDate = null;
    $scope.toCopyDate = null;
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
  $scope.toCopyDateOpen = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.toCopyDateOpened = true;
  };
  //date picker function

  $scope.generateRoutes = function (roster) {
    // console.log(roster);
    // console.log($scope.selectedSite);
    // console.log($scope.filterDate)
    $scope.disable_roster_button = true;

    let postData = {
      "site_id": parseInt($scope.selectedSite.id),
      "shift_id": parseInt(roster.id),
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD'),
      "search": '0',
      "shift_type": roster.trip_type // 0 -checkin 1-checout
    }
    console.log('route generate req', postData)
    $scope.isLoader = true;
    RouteService.getRoutes(postData,
      (res) => {
        console.log('route generate res', res);
        if (res['success']) {
          $scope.toggleView = true;
          $scope.isLoader =false;
          ToasterService.showSuccess('Success', 'Route generated successfully.');
          $scope.updateFilters();
        } else {
          $scope.toggleView = true;
          $scope.isLoader =false;
          ToasterService.showError('Error', res['message']);

          if (res['is_routes_generated'] === false) {
            // if (true) {
            roster.result = 'REQUIRED MORE VEHICLE';
            // roster.disableGenerate = false;
          }
        }
        $scope.disable_roster_button = false;
        $scope.closeAll()
      }, (error) => {
        $scope.disable_roster_button = false;
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
        console.error(error);
        $scope.closeAll();
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
// date picker custom
  $scope.toCopyDate;
  $scope.toDate;
  $scope.showGenerateDialog = false;
  $scope.rosterData;
  $scope.filterDate;
  $scope.isDateBoxOpen = false;
  $scope.closeAll = () => {
    $scope.showGenerateDialog = false;
    $scope.isDateBoxOpen = false;
  }
  $scope.updateDateFilters = function (value, date) {
    if(value === 'to'){
        $scope.filterDate = moment(date).format('YYYY-MM-DD')
    } else if(value === 'copy' ){
      $scope.toCopyDate = moment(date).format('YYYY-MM-DD');          
}

$scope.onSubmit = () => {
  if($scope.toDate && $scope.toCopyDate){
    
    let postData=  {
        "siteId": String($scope.selectedSiteId),
        "shiftId": String($scope.rosterData.id),
        "tripType": String($scope.rosterData.trip_type),
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD'),
        "tocopy_date": moment($scope.toCopyDate).format('YYYY-MM-DD')
      }

      RosterService.copyRoutes(postData, function(res){
        $scope.closeAll();
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res.message);
      }, function(err){
        $scope.closeAll();
        $scope.toggleView = true;
        ToasterService.showSuccess('Error', err.message);
      })
  }
}
}
// $scope.toCopyDateOpened = false;
// $scope.toDateOpened = false;
  

  $scope.toDateOpen = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.toDateOpened = true;
  };

  $scope.showGeneratePopup = (roster) => {
    $scope.showGenerateDialog = true;
    $scope.rosterData = roster;
    console.log('roster', roster)
    // $scope.generateRoutes(roster);
  }

  $scope.copyRoutes = () => {
    $scope.isDateBoxOpen = true;
  }

  $scope.onFreshRoutes = () => {
    $scope.generateRoutes($scope.rosterData)
    $scope.closeAll();
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
      if (!!$scope.currentRoster.total_seats) $scope.currentRoster.total_seats = parseInt($scope.currentRoster.total_seats) + parseInt($scope.currentRoster.vehicle_capacity[key]);
      else {
        $scope.currentRoster.total_seats = 0 + parseInt($scope.currentRoster.vehicle_capacity[key]);
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
        $scope.toggleView = true;
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
      console.log('Emp list', res)
      if (res['success']) {
        $scope.EmpList = res.data.employeeList;
      } else {
        $scope.toggleView = true;
        ToasterService.showError('Error', res['message']);
        setTimeout(() => {
          ToasterService.clearToast();
        }, 0)
        return;
      }
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
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Select atleast one Employee');
      return;
    } else if (moment($scope.filterDate).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
      $scope.toggleView = true;
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