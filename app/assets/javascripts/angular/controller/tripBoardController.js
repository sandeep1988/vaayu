angular.module('app').controller('tripboardCtrl', function ($scope, VehicleListResponse, RouteService, TripboardService, TripboardResponse, $timeout, ToasterService,TripboardBoardCallService,$interval,$filter,TripboardBoardCommentService) {

  // $scope.toggled = function(open) {
  //   // $log.log('Dropdown is now: ', open);
  // };
  // $scope.status = {
  //   isopen: false
  // };

  // $scope.toggleDropdown = function($event) {
  //   $event.preventDefault();
  //   $event.stopPropagation();
  //   $scope.status.isopen = !$scope.status.isopen;
  // };

  

  $scope.init = function () {
    $scope.today();
    // date picket
    $scope.toggleMin();


    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.selectedVehicle = {};
    $scope.example14settings = {
      scrollableHeight: '150px',
      scrollable: true,
      enableSearch: true,
      width: '300px',
      selectionLimit: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    // date function

    TripboardService.getAllSiteList(function (data) {
      $scope.siteList = data.data.list;
      $scope.selectedSiteID = $scope.siteList[0].id;
      $scope.getAllTrips();
    }
      , function (error) {
        console.error(error);
      });
  };
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


  $scope.FilterStat = function(item){
    $scope.search=  $filter('uppercase')(item);
  }

  $scope.updateCallStatus =function(modelData){
    var postdata={
      "msg":modelData.comment,
      "panic_id":modelData.panic_id,
      "date":moment().format('YYYY-MM-DD hh:mm:ss')
    };
    
    TripboardBoardCommentService.get(postdata, (data) => {
     
      if (!data['success']) {
        ToasterService.showError('Error', data['message']);
      }else{
        ToasterService.showSuccess('Success','Response Recorded Succesfully');
      }

    }, function (error) {
      console.error(error);
    });
  }

  $scope.panicCallSesion = function(id,type){
    var postdata={
      "toId":id,
      "callToType":type,
      "callRequestDateTime":moment().format('YYYY-MM-DD hh:mm:ss')
    };
    
    TripboardBoardCallService.get(postdata, (data) => {
     
      if (!data['success']) {
        ToasterService.showError('Error', data['message']);
        return;
      }else{
        ToasterService.showSuccess('Success','Call Ended');
      }

    }, function (error) {
      console.error(error);
    });
  }

  $scope.getAllTrips = function () {

    // $scope.fullRoster = TripboardResponse.tempResponse.tripsdetails;
    // $scope.stats = TripboardResponse.tempResponse.stats;
    // $scope.rosters = $scope.fullRoster;
    

    let postData = {
      "site_id": $scope.selectedSiteID,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }
    console.log(postData)
    TripboardService.get(postData, (data) => {
      console.log('all trips data', data);
      if (!data['success']) {
        ToasterService.showError('Error', data['message']);
        return;
      }
      $scope.fullRoster = data.data.tripsdetails;
      $scope.rosters = $scope.fullRoster;
      
      angular.forEach($scope.rosters, function (item) {
        item.current_status =  $filter('uppercase')(item.current_status);
      })
      $scope.stats =  data.data.stats;

    }, function (error) {
      console.error(error);
    });

  }
  // Refresh Trip Board after Every 1 Minute;

  $interval(function() {
    $scope.getAllTrips();
  }, 1000*60);


  $scope.showPopup = false;
  $scope.showModal = (row) => {
    console.log('showModal', row);
    $scope.modelData = row;
    $scope.showPopup = true;
    $scope.selectedVehicle = {};
    var trip_status = row.current_status.toLowerCase().trim();
    if (trip_status === 'pending acceptance' || trip_status === 'accepted', trip_status === 'delayed') {
      $scope.getVehicleListForTrip(row);
    } 
      
    return ;

    // var mapProp = {
    //   center: new google.maps.LatLng(51.508742, -0.120850),
    //   zoom: 5,
    // };
    // var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var map = new google.maps.Map(document.getElementById('googleMap'), {
      zoom: 4,
      center: { lat: 25.291, lng: 153.027 },
      mapTypeId: 'terrain'
    });

    // Define a symbol using SVG path notation, with an opacity of 1.
    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 2
    };


    // Create the polyline, passing the symbol in the 'icons' property.
    // Give the line an opacity of 0.
    // Repeat the symbol at intervals of 20 pixels to create the dashed effect.
    var line = new google.maps.Polyline({
      path: [{ lat: 32.291, lng: 157.027 }, { lat: 22.291, lng: 153.027 }, { lat: 28.291, lng: 158.027 }, { lat: 18.291, lng: 153.027 }],
      strokeOpacity: 0,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '5px'
      }],
      map: map
    });


    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");

    // // Get the <span> element that closes the modal
    var closepop = document.getElementsByClassName("closepop")[0];


    // When the user clicks the button, open the modal 
    // btn.onclick = function() {

    // }

    // When the user clicks on <span> (x), close the modal
    closepop.onclick = function () {
      modal.style.display = "none";
    }


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

  }

  $scope.filterTrips = function (status) {
    $scope.rosters = $scope.fullRoster.filter(item => item.current_status === status)
  }

  $scope.getVehicleListForTrip = function (trip) {
    var siteId = $scope.selectedSiteID
    var shiftId = trip.shift_id
    var shiftType = trip.trip_type_status

    let params = {
      siteId, shiftId, shiftType,
      selectedDate: moment($scope.filterDate).format('YYYY-MM-DD'),
      driverStatus: 'on_duty' //$scope.selected_vehicle_status
    }
    console.log('getVehicleListForTrip req', params)
    RouteService.postVehicleList(params, function (res) {
      console.log('vehicle list', res)
      if (!res['success']) {
        ToasterService.showError('Error', res['message']);
        return;
      } else {
        $scope.searchAllVehicles(res.data, trip);
        // $scope.vehicleList = res.data;

        // var array = VehicleListResponse.listResponse.data;
        // var newarray = [];
        // for (let item of array) {
        //   newarray.push({id: item.id, name: item.vehicleNumber})
        // }
        // $scope.vehicleList = newarray;
      }
      
    }, function (error) {
      console.log(error);
    });
  }

  $scope.searchAllVehicles = (vehicleList, trip) => {
    var shiftId = trip.shift_id
    var shiftType = trip.trip_type_status

    let params = { shiftId , shift_type: shiftType, searchBy: '' };
    console.log('searchAllVehicles req', params)
    RouteService.searchVechicle(params, function (res) {
      console.log('searchAllVehicles res', res)
      if (res['success']) {
        //vehicleList.push(res.data);
        // var array = VehicleListResponse.listResponse.data;
        var newarray = [];
        for (let item of vehicleList) {
          newarray.push({id: item.id, name: item.vehicleNumber+' - On Site'})
        }
        for (let item of res.data) {
          newarray.push({id: item.id, name: item.vehicleNumber+' - Off Site'})
        }
       
        $scope.vehicleList = newarray;
      } else {
        console.log(res['message']);
      }
      console.log('$scope.vehicleList', $scope.vehicleList)
    },
    function (error) {
      console.log(error);
    });
  }

  $scope.isDisable = () => {
    if (Object.keys($scope.selectedVehicle).length === 0) {
      return false;
    }
    return true;
  }
  $scope.isDisable1 = (row) => {
    if (row == undefined) {
      return false;
    }
    var trip_status = row.current_status.toLowerCase().trim();
    if (trip_status === 'pending acceptance' || trip_status === 'accepted', trip_status === 'delayed') {
      return true;
    } 
    return false;
  }
  $scope.changeAllocation = (trip) => {
    console.log('selected vehicle', $scope.selectedVehicle)
    let params = {trip_id: trip.trip_id, vehicleId: $scope.selectedVehicle.id}
    console.log('changeAllocation params', params);
    RouteService.changeAllocation (params, function(res) {
      console.log('changeAllocation res', res)
      if (res['success']) {
        ToasterService.showSuccess('Success', res['message']);
        $scope.showPopup = false;
      } else {
        ToasterService.showError('Error', res['message']);
      }
    }, function (er) {
      ToasterService.showError('Error', 'Something went wrong, Try Later.');
    });
  }
  

});