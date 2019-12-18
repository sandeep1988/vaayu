angular.module('app').controller('tripboardCtrl', function ($scope, VehicleListResponse, RouteService, TripboardService, TripboardResponse, $timeout, ToasterService,$interval,$filter,VehicleLocation) {

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
    $scope.toggleView = false;
    
    ToasterService.clearToast();
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
    $scope.search =  $filter('uppercase')(item);
  }

  $scope.FilterSosStat = function(item){
    $scope.search ='';
    $scope.sos_panic =  item
  }


  $scope.initMap = () => {


    // $scope.drawMapPath([
    //   {lat: 37.772, lng: -122.214},
    //   {lat: 21.291, lng: -157.821},
    //   {lat: -18.142, lng: 178.431},
    //   {lat: -27.467, lng: 153.027}
    // ])

    // var flightPlanCoordinates = [
    // {lat: 37.772, lng: -122.214},
    // {lat: 21.291, lng: -157.821},
    // {lat: -18.142, lng: 178.431},
    // {lat: -27.467, lng: 153.027}
    // ];

    // var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true
  });

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 19.2578, lng: 72.8731 },
      mapTypeId: 'terrain'
    });
    $scope.map = map
    console.log('map ', $scope.map)
    directionsRenderer.setMap(map);
    var stepDisplay = new google.maps.InfoWindow;
    $scope.waypts=$scope.modelData.map_data.wayPoints;

    var waypts=[];

    angular.forEach($scope.waypts, function (item, index,wayptsArray) {
      if(index==1){
        $scope.source={
           lat:item.lat,
           lng:item.lng,
           emp_name:item.emp_name
        }
      }
      waypts.push({
        location:new google.maps.LatLng(item.lat,item.lng),
        stopover:true
      });

      makeMarker(new google.maps.LatLng(item.lat,item.lng),item.emp_name);

      if(index===wayptsArray.length-1){
        $scope.destination={
          lat:item.lat,
          lng:item.lng,
          emp_name:item.emp_name
       }
      }
    })
    
    // var waypts = [
    //   {
    //     location: 'Kandivali Station (W), Parekh Nagar, Kandivali, Mumbai, Maharashtra',
    //     stopover: true
    //   },
    //   {
    //     location: 'Thane Station Road, Jambli Naka, Thane West, Thane, Maharashtra',
    //     stopover: true
    //   }
    // ];
    // calculateAndDisplayRoute(directionsRenderer, directionsService, $scope.markerArray, waypts, stepDisplay, map);    // Define a symbol using SVG path notation, with an opacity of 1.
    calculateAndDisplayRoute( directionsService, directionsRenderer, waypts)

  }

  $scope.tripOngoing =true;

  function makeMarker( position, title ) {
    new google.maps.Marker({
     position: position,
     map: $scope.map,
     title: title
    });
   }

  $scope.getCurrentVehicleLocation = () => {
    
      $scope.toggleView = false;
      ToasterService.clearToast();
    
      VehicleLocation.get({ id: $scope.modelData.trip_id }, function(location) {
        if(location.success){
          var res=location.data.current_location;
          console.log("data : "+ res);
         var marker1 = new google.maps.Marker({
           map: $scope.map,
           position: new google.maps.LatLng(res.lat, res.lng),
           icon: "../assets/angular_images/car.png"
         })
         $scope.tripOngoing=true;
        }else{
          $scope.tripOngoing=false;
          $scope.toggleView = true;
          ToasterService.showError('Error', location['message']);
        }
      });
    
    
  } 

  function calculateAndDisplayRoute(directionsService, directionsRenderer, waypts) {

    var source =$scope.modelData.map_data.source;
    console.log('modelData', $scope.modelData)
    var destination =$scope.modelData.map_data.destination;

    if(source.is_site){
       makeMarker(new google.maps.LatLng(source.lat,source.lng),source.site_name);
    }

    if(destination.is_site){
      makeMarker(new google.maps.LatLng(destination.lat,destination.lng),destination.site_name);
    }

    directionsService.route({
      origin: new google.maps.LatLng(source.lat,source.lng),
      destination: new google.maps.LatLng(destination.lat,destination.lng),
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    }, function (response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');

        if (summaryPanel) {
          summaryPanel.innerHTML = '';
          // For each route, display summary information.
          for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i + 1;
            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
            summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
          }
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    $scope.getCurrentVehicleLocation();
  }

  function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function () {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

  $scope.addRemarkInTripForDriverPanic = (trip) => {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    var params={
      "trip_id":trip.trip_id,
      "remarks":trip.comment,
    };
    console.log('addRemarkInTripForDriverPanic req', params)
    TripboardService.addRemarkInTripForDriverPanic(params, (data) => {
      console.log('addRemarkInTripForDriverPanic res', data)
      if (!data['success']) {
        $scope.toggleView = true;
        ToasterService.showError('Error', data['message']);
      } else {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', data['message']);
        trip.trip_is_panic = data.data.is_trip_panic;
        trip.trip_driver_is_panic = false;
      }

    }, function (error) {
      console.error(error);
    });
  }

  $scope.updateCallStatus = function(item, trip) {

    var postdata={
      "msg":item.comment,
      "panic_id":item.panic_id,
      "date":moment().format('YYYY-MM-DD hh:mm:ss')
    };
    
    TripboardService.savePanicResponse(postdata, (data) => {
      console.log('employeePanicComment res', data)
      if (!data['success']) {
        $scope.toggleView = true;
        ToasterService.showError('Error', data['message']);
      }else{
        $scope.toggleView = true;
        ToasterService.showSuccess('Success',data['message']);
        trip.trip_is_panic = data.data.is_trip_panic;
        item.is_panic = false;
      }

    }, function (error) {
      console.error(error);
    });
  }

  $scope.panicCallSesion = function(id,type){

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    var postdata={
      "toId":id,
      "callToType":type,
      "callRequestDateTime":moment().format('YYYY-MM-DD hh:mm:ss')
    };
    
    TripboardService.callOperator(postdata, (data) => {
     
      if (data['success']) {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', data['message']);
      } else {
        $scope.toggleView = true;
        ToasterService.showError('Error', data['message']);
      }

    }, function (error) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Something went wrong, Try later.');
      console.error(error);
    });
  }

  $scope.getAllTrips = function () {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    $scope.search = '';
    // $scope.fullRoster = TripboardResponse.tempResponse.tripsdetails;
    // $scope.stats = TripboardResponse.tempResponse.stats;
    // $scope.rosters = $scope.fullRoster;
    

    let postData = {
      "site_id": $scope.selectedSiteID,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }
    console.log(postData)
    TripboardService.getAllTrips(postData, (data) => {
      console.log('all trips data', data);
      if (!data['success']) {
        $scope.toggleView = true;
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
    $scope.getCurrentVehicleLocation ();
    $scope.getAllTrips();
  }, 1000*60);


  $scope.showPopup = false;
  $scope.showModal = (row) => {
    console.log('showModal', row.map_data);
    $scope.modelData = row;
    $scope.showPopup = true;
    $scope.selectedVehicle = {};
    var trip_status = row.current_status.toLowerCase().trim();
    if (trip_status === 'pending acceptance' || trip_status === 'accepted' || trip_status === 'delayed') {
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

    $scope.toggleView = false;
    
    ToasterService.clearToast();
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
        $scope.toggleView = true;
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
    if (trip_status === 'pending acceptance' || trip_status === 'accepted' || trip_status === 'delayed') {
      return true;
    } 
    return false;
  }
  $scope.changeAllocation = (trip) => {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    console.log('selected vehicle', $scope.selectedVehicle)
    let params = {trip_id: trip.trip_id, vehicleId: $scope.selectedVehicle.id}
    console.log('changeAllocation params', params);
    RouteService.changeAllocation (params, function(res) {
      console.log('changeAllocation res', res)
      if (res['success']) {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res['message']);
        $scope.showPopup = false;
        $scope.getAllTrips();
      } else {
        $scope.toggleView = true;
        ToasterService.showError('Error', res['message']);
      }
    }, function (er) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Something went wrong, Try Later.');
    });
  }
  
  $scope.closePopup = () => {
    $scope.showPopup=false;
  }

  $scope.getRowColor = (index, trip) => {
    // 'active': ($index % 2) === 0, 'panic':roster.trip_is_panic}
    if (trip && trip.trip_is_panic) {
      return 'panic';
    } else if ((index % 2) === 0){
      return 'active';
    }
    return '';
  }

  $scope.getDriverProfileUrl = (url) => {
    if (url !== undefined && url !== null && url.length > 8){
      if (url.startsWith('http')) {
        return url;
      } else {
        return 'http://'+url;
      }
    } 

    return '../assets/angular_images/img_avatar.png';
  }
  

});