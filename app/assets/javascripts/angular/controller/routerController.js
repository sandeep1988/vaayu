
angular.module('app').directive('setHeight', function ($window) {
  return {
    link: function (scope, element, attrs) {
      element.css('height', $window.innerHeight / 2 + 'px');
    }
  }
})

angular.module('app')
  .filter('range', function () {
    return function (items, property, min, max) {
      return items.filter(function (item) {
        return item[property] >= min && item[property] <= max;
      });
    };
  });


app.directive('focusMe', function ($timeout) {
  return {
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.focusMe, function (value) {
        // if(value === true) { 
        // scope[attrs.value] = 'default';
        console.log('value=', value, ele, attrs);
        //$timeout(function() {
        ele[0].focus();
        // scope[attrs.focusMe] = false;
        //});
        // }
      });
    }
  };
});

angular.module('app').controller('routeCtrl', function ($scope, $http, $state, Map, SiteService, RosterService, RouteService, RouteUpdateService,
  AutoAllocationService,
  FinalizeService, RouteStaticResponse, ToasterService, SessionService,BASE_URL_API_8002,TripboardService) {


  $scope.toggleView = false;  
  $scope.disableBtn = false;
  ToasterService.clearToast();
  $scope.place = {};
  // Map.init();

  $scope.initMap = () => {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
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

    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 19.2578, lng: 72.8731 },
      mapTypeId: 'terrain'
    });
    $scope.map = map
    console.log('map ', $scope.map)
    directionsRenderer.setMap(map);
    var stepDisplay = new google.maps.InfoWindow;
    var waypts = [
      {
        location: 'Kandivali Station (W), Parekh Nagar, Kandivali, Mumbai, Maharashtra',
        stopover: true
      },
      {
        location: 'Thane Station Road, Jambli Naka, Thane West, Thane, Maharashtra',
        stopover: true
      }
    ];
    
    // calculateAndDisplayRoute( directionsService, directionsRenderer, waypts)

  }

  $scope.selected_vehicle_status = 'on_duty';
  $scope.onVehicleStatusChange = (value) => {
    $scope.selected_vehicle_status = value;
    let shift = JSON.parse($scope.selectedShift);
    $scope.getVehicleListForSite($scope.siteId, shift.id, shift.trip_type);
  }

  $scope.finalizeArray = [];
  $scope.coords = []
  $scope.selectRoute = (container) => {

    console.log(container);
    $scope.finalizeArray.push({ routeId: container.routeId });
   
    var waypts=[];

    angular.forEach(container.employees, function (item, index,wayptsArray) {
      waypts.push({
        location:new google.maps.LatLng(item.lat,item.lng),
        stopover:true
      });

      makeMarker(new google.maps.LatLng(item.lat,item.lng),item.empName);

    })


    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 19.2578, lng: 72.8731 },
      mapTypeId: 'terrain'
    });
    $scope.map = map
    console.log('map ', $scope.map)
    directionsRenderer.setMap(map);
    var stepDisplay = new google.maps.InfoWindow;
   
    calculateAndDisplayRoute( directionsService, directionsRenderer, waypts)
  }


  $scope.init = function () {
    $scope.toggleView = false;
    
    ToasterService.clearToast();
    $scope.stats = {
      "no_of_routes": 0,
      "male_count": 0,
      "female_count": 0,
      "special": 0,
      "on_duty_vehicle": 0,
      "kilometres": 0
    }

    $scope.initMap();

    // SiteService.get().$promise.then(function (res) {
    //   $scope.sites = res.data.list;
    //   console.log($scope.sites);
    // }).catch(er => {
    //   console.log(error);
    // });

    $scope.today();
    // date picket
    $scope.toggleMin();


    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    // date function

    $scope.vehicle_status_list = [
      {name: 'On Duty', value: 'on_duty'},
      {name: 'Off Duty', value: 'off_duty'}
    ]

    $http({
      method: 'POST',
      url: BASE_URL_API_8002 + 'categoryList',
      headers: {
          'Content-Type': 'application/json',
          'uid': SessionService.uid,
          'access_token': SessionService.access_token,
          'client': SessionService.client
      },
      data: { test: 'test' }
  }).then(function (res) {
      console.log('Vehicle', res);
      $scope.vehicleCategoryList = res.data.data;
  }).catch(err => {
      console.log(err)
  });
  
    // RouteService.getVehicleCategoryList(function (data) {
    //   $scope.vehicleCategoryList = data;
    // });

    RosterService.getAllSiteList(function (data) {
      $scope.siteList = data.data.list;
      if ($scope.siteList.length) {
        $scope.siteId = $scope.siteList[0].id;
      }

      let postData = {
        "site_id": $scope.siteList[0].id,
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
      }

      RosterService.get(postData, function (data) {
        if (data.data) {
          $scope.shifts = data.data.shiftdetails;
          if ($scope.shifts && $scope.shifts.length) {
            $scope.selectedShift = JSON.stringify($scope.shifts[0]);
            $scope.resetRoute();
            // $scope.generateRoute($scope.siteId,$scope.shifts[0].id,moment().format('YYYY-MM-DD'),1);
          } else {
            $scope.selectedShift = null;
            // $scope.resetRoute();
          }
        }
      }, function (error) {
        console.log(error);
      });
    }, function (error) {
      console.log(error);
    });

  }

  $scope.removeVehicle = (vehicle, route) => {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    console.log('route', route.routeId, route)
    RouteService.removeVehicle({ routeId: route.routeId }, res => {
      console.log(res)
      if (res['success']) {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res['message']);
        $scope.resetRoute()
      } else {
        ToasterService.clearToast();
        $scope.toggleView = true;
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      console.log(er);
    });
  }

  $scope.removeGuard = (guard,route) => {
    $scope.toggleView = false;
    
    ToasterService.clearToast();
    console.log('route', route.routeId, route)
    RouteService.removeGuard({ routeId: String(route.routeId), guardId:String(guard.guardId)}, res => {
      if (res['success']) {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res['message']);
        $scope.resetRoute()
      } else {
        ToasterService.clearToast();
        $scope.toggleView = true;
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      console.log(er);
    });
  }

  $scope.getVehicleListForSite = function (siteId, shiftId, shiftType) {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    if (siteId == null || shiftId == null || shiftType == null){
      return;
    } 

    let postVehicleData = {
      siteId, shiftId, shiftType,
      selectedDate: moment($scope.filterDate).format('YYYY-MM-DD'),
      driverStatus: $scope.selected_vehicle_status
    }
    console.log('postVehicleData', postVehicleData)
    RouteService.postVehicleList(postVehicleData, function (res) {
      console.log('vehicle list', res)
      $scope.vehicleList = res.data;

      var allowtypes = [];
      angular.forEach($scope.vehicleList, function (item) {
        // item.type = "vehical";
        item.type = item.vehicleType;
        if (!allowtypes.includes(item.type)) {
          allowtypes.push(item.type)
        }
      })
      console.log('allowtypes', allowtypes);

      $scope.vehicals = [
        {
          label: "Vehical",
          allowedTypes: allowtypes,
          max: allowtypes.length + 1,
          vehical: $scope.vehicleList
        }
      ];
    }, function (error) {
      console.log(error);
    });
  }

  $scope.getGuardListForSite = function (siteId, shiftId, shiftType) {

    $scope.toggleView = false;
    
    ToasterService.clearToast();
    if (siteId == null || shiftId == null ){
      return;
    } 
    RouteService.getGuardList({ siteId, shiftId }, function (res) {
      console.log('guard list', res.data)
      $scope.guardList = res.data;
      // $scope.guardList = RouteStaticResponse.all_guards_response;
      angular.forEach($scope.guardList, function (item) {
        item.type = "guard";
      })

      $scope.guards = [
        {
          label: "Guard",
          allowedTypes: ['guard'],
          guard: $scope.guardList
        }
      ];
    }, function (error) {
      console.log(error);
    });
  }

  $scope.updateFilters = function () {
    $scope.toggleView = false;
    ToasterService.clearToast();
    let postData = {
      "site_id": $scope.siteId,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }

    RosterService.get(postData, function (data) {
      $scope.shifts = data.data.shiftdetails;
      if ($scope.shifts && $scope.shifts.length) {
        $scope.selectedShift = JSON.stringify($scope.shifts[0]);
        // $scope.resetRoute();
        // $scope.generateRoute($scope.siteId,$scope.shifts[0].id,moment().format('YYYY-MM-DD'),1);
      } else {
        $scope.selectedShift = null;
        // $scope.resetRoute();
      }
    }, function (error) {
      console.log(error);
    });

  }

  $scope.submitFilters = function () {
    let postData = {
      "site_id": $scope.siteId,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }
    $scope.disableBtn = true;
    RosterService.get(postData, function (data) {
      $scope.disableBtn = false;
      $scope.shifts = data.data.shiftdetails;
      if ($scope.shifts && $scope.shifts.length) {
        $scope.selectedShift = JSON.stringify($scope.shifts[0]);
        $scope.resetRoute();
        $scope.toggleView = true;
        console.log('data: ',data); 
        ToasterService.showSuccess('Success', 'Routes listed successfully');
        // $scope.generateRoute($scope.siteId,$scope.shifts[0].id,moment().format('YYYY-MM-DD'),1);
      } else {
        $scope.selectedShift = null;
        // $scope.resetRoute();
      }
    }, function (error) {
      console.log(error);
    });
  }

  $scope.shuffleEvent = function (item) {
    console.log(message);
  };

  $scope.isDisabled = true;

  $scope.finalizeRoutes = () => {
    if ($scope.finalizeArray.length === 0) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Kindly select a route before save')
      return;
    }
    let postdata = { routesFinalizeArray: $scope.finalizeArray }
    console.log('finalizeRoutes request object', postdata)
    FinalizeService.query(postdata, (data) => {
      console.log('finalizeRoutes ', data);
      $scope.resetRoute();
    }, err => {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Something went wrong')
    });
  }

  $scope.roundValue = (val) => {
    return parseInt(val)
  }

  $scope.saveRoutes = function () {
    var changedRoutes = [];

    angular.forEach($scope.routes.data.routes, function (route) {
      angular.forEach($scope.routeChangedIds, function (routeId) {
        if (route.routeId === routeId) {
          changedRoutes.push(route);
        }
      })
    })



    var finalChangedRoutes = [];
    angular.forEach(changedRoutes, function (route) {
     
      if(route.guard_required){
        route.guard_required="Y";
     }else{
       route.guard_required="N";
     }
      var employee_nodes = [];
      angular.forEach(route.employees, function (emp) {
        employee_nodes.push(emp.empId);
      })
      var data = {
        "route_id": route.routeId,
        "vehicle_category": route.vehicle_type,
        "employee_nodes": employee_nodes,
        "guard_required":route.guard_required
      }
      finalChangedRoutes.push(data);
    })

    var original_routes = [];


    var originalChangedRoutes = [];

    angular.forEach($scope.originalRoutes, function (route) {
      angular.forEach($scope.routeChangedIds, function (routeId) {
        if (route.routeId === routeId) {
          originalChangedRoutes.push(route);
        }
      })
    })

    angular.forEach(originalChangedRoutes, function (originalRoute) {
      if(originalRoute.guard_required){
        originalRoute.guard_required="Y";
      }else{
        originalRoute.guard_required="N";
      }

      var employee_nodes = [];
      angular.forEach(originalRoute.employees_nodes_addresses, function (orgEmp) {
        employee_nodes.push(orgEmp.empId);
      })
      var data = {
        "route_id": originalRoute.routeId,
        "vehicle_category": originalRoute.vehicle_type,
        "employee_nodes": employee_nodes,
        "guard_required":originalRoute.guard_required
      }
      original_routes.push(data);
    })

    if (finalChangedRoutes.length) {
      let shift = JSON.parse($scope.selectedShift);
      let postData = {
        "site_id": parseInt($scope.siteId),
        "shift_id": parseInt(shift.id),
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD'),
        "shift_type": String(shift.trip_type),
        "updated_routes": finalChangedRoutes,
        "original_routes": original_routes
      }

      $scope.isDisabled = true;

      RouteUpdateService.query(postData, function (res) {
        console.log('save button cick res', res)
        $scope.isDisabled = false;
        if (res['success']) {
          $scope.resetRoute();
          $scope.toggleView = true;
          ToasterService.showSuccess('Success', res['message']);
        } else {
          ToasterService.clearToast();
          $scope.toggleView = true;
          ToasterService.showError('Error', res['message']);
          return;
        }
      })
    }
  }

  $scope.resetRoute = function () {
    
    $scope.finalizeArray = [];
    $scope.routeChangedIds = [];

    $scope.generateRoute($scope.siteId, $scope.selectedShift.id, $scope.filterDate, $scope.selectedShift.trip_type);
  }

  $scope.plateNumber = '';

  $scope.closePopup = () => {
    $scope.showPopup=false;
  }

  $scope.showPopup = false;

  $scope.openPopUp = () => {
   
    $scope.showPopup = true;
             
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    var closepop = document.getElementsByClassName("closepop")[0];

    closepop.onclick = function () {
      modal.style.display = "none";
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
 
  $scope.createNewRoute=function(vehicleType) {
    var routeId;

    angular.forEach($scope.vehicleCategoryList, function (vehicle, idx) {
      if(vehicle.id==vehicleType){
        $scope.vehicle=vehicle;
      }
    });

    angular.forEach($scope.routes.data.routes, function (route, index, routeArray) {
      if(index===routeArray.length-1){
        routeId=route.routeId
      }
    });

    let shift = JSON.parse($scope.selectedShift);
      let postData = {
        "routeId":String(routeId),
        "site_id": String($scope.siteId),
        "shift_id": String(shift.id),
        "seating_capacity":String($scope.vehicle.seating_capacity),
        "vehicle_category":$scope.vehicle.category_name,
        "start_date": moment($scope.filterDate).format('YYYY-MM-DD'),
        "trip_type": String(shift.trip_type),
      }


      RouteService.createRoute(postData, function (res) {
          $scope.showPopup = false;
          $scope.resetRoute();
      });
  };

  $scope.onVehicleSearch = (plateNumber) => {
    $scope.plateNumber = plateNumber;
    let shift = JSON.parse($scope.selectedShift);
    let params = { shiftId: shift.id, shift_type: shift.trip_type, searchBy: plateNumber, to_date: moment($scope.filterDate).format('YYYY-MM-DD')};
    RouteService.searchVechicle(params, function (res) {
      console.log('vehicle search response', res)
      console.log('vehicle search response', JSON.stringify(res))
      if (res['success']) {
        $scope.vehicleList = res.data;
        var allowtypes = [];
        angular.forEach($scope.vehicleList, function (item) {
          // item.type = "vehical";
          item.type = item.vehicleType;
          if (!allowtypes.includes(item.type)) {
            allowtypes.push(item.type)
          }
        })
        console.log('allowtypes', allowtypes);

        $scope.vehicals = [
          {
            label: "Vehical",
            allowedTypes: allowtypes,
            max: allowtypes.length + 1,
            vehical: $scope.vehicleList
          }
        ];
      } else {
        //ToasterService.showError('Error', res['message']);
        console.log(res['message']);
      }
    }, function (error) {
      console.log(error);
    });

  }

  $scope.showStaticData = (res) => {
    $scope.toggleView = false;
    
    ToasterService.clearToast();
    $scope.routes = res;

    $scope.originalRoutes = angular.copy($scope.routes.data.routes);

    $scope.stats = $scope.routes.data.tats[0];


    angular.forEach($scope.routes.data.routes, function (route, index, routeArray) {
      route.allowed = "all";
      if (route.guard) {
        let guard = route.guard;
        guard.type = 'guard';
        route.guard = [guard]
      } else {
        route.guard = [];
      }
      if (route.vehicle) {
        let vehical = route.vehicle;
        vehical.type = 'vehical';
        route.vehicle = [vehical]
      } else {
        route.vehicle = [];
      }

      angular.forEach(route.employees_nodes_addresses, function (employee, idx, emmplyeeArray) {
        employee.type = "employee";
        employee.effectAllowed = "all";
      })

      route.employees = route.employees_nodes_addresses;
    })

    if ($scope.routes.data.routes.length <= 4) {
      $scope.routes.data.routes.push(
        {
          "vehicle_allocated": '',
          "employees": [],
          "vehicle": [],
          "guard": [],
          "allowed": "all"
        }
      )
    }


    
    $scope.fullModel = [$scope.routes.data.routes];
    $scope.model2 = $scope.fullModel;
    console.log('scope routes', $scope.model2);

  }

  $scope.generateRoute = function (siteId, shiftId, filterDate, shiftType) {  

    $scope.toggleView = false;
    ToasterService.clearToast();
    if (!$scope.siteId) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Select Site.');
      return;
    } else if (!$scope.selectedShift) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Select Shift.');
      return;
    }
    let shift = JSON.parse($scope.selectedShift);
    // Static data display
    // $scope.showStaticData(RouteStaticResponse.route_response);
    // return;

    $scope.getVehicleListForSite(siteId, shift.id, shift.trip_type);
    $scope.getGuardListForSite(siteId, shift.id, shift.trip_type);

    let postData = {
      "site_id": parseInt($scope.siteId),
      "shift_id": parseInt(shift.id),
      "to_date": moment(filterDate).format('YYYY-MM-DD'),
      "search": "1",
      "shift_type": shift.trip_type + '' // 0 -checkin 1-checout
    }
    console.log('postData', postData)

    RouteService.getRoutes(postData, (data) => {

      $scope.toggleView = false;
      ToasterService.clearToast();
      console.log(data);
      if (!data['success']) {
        ToasterService.clearToast();
        $scope.toggleView = true;
        ToasterService.showError('Error', data['message']);
        return;
      }
      $scope.routes = data;

      if ($scope.routes.data) {
        try {
          // ToasterService.showToast('info', 'Response Received', $scope.routes.data.routes.length+' Routes found for this shift')
          $scope.originalRoutes = angular.copy($scope.routes.data.routes);
          $scope.stats = $scope.routes.data.tats[0];
          console.log($scope.model2)
        } catch (err) {
          $scope.stats = { no_of_routes: 0, kilometres: 0, male_count: 0, female_count: 0, special: 0 };
          $scope.routes = RouteStaticResponse.emptyResponse;
          $scope.routes.data.routes = [];
          $scope.toggleView = true;
          ToasterService.showToast('info', 'Response Received', 'No Routes found for this shift')
          console.log('error', err)
        }
        $scope.showRouteData()
      }
    }, (error) => {
      console.log(error);
    });
  }

  function makeMarker( position, title ) {
    new google.maps.Marker({
     position: position,
     map: $scope.map,
     title: title
    });
   }
   
  $scope.showRouteData = () => {
    $scope.toggleView = false;
    
    ToasterService.clearToast();
    angular.forEach($scope.routes.data.routes, function (route, index, routeArray) {
      route.allowed = "all";

      if(route.guard_required=="Y"){
         route.guard_required=true;
      }else{
        route.guard_required=false;
      }

      if (route.guard) {
        let guard = route.guard;
        guard.type = 'guard';
        route.guard = [guard]
      } else {
        route.guard = [];
      }
      if (route.vehicle) {
        let vehical = route.vehicle;
        // vehical.type = "vehical";
        vehical.type = route.vehicle_type;
        // vehical.type = vehical.vehicleType;
        route.vehicle = [vehical]
      } else {
        route.vehicle = [];
      }

      angular.forEach(route.employees_nodes_addresses, function (employee, idx, emmplyeeArray) {
        employee.type = "employee";
        employee.effectAllowed = "all";
      })

      route.employees = route.employees_nodes_addresses;
    })

    // $scope.routes.data.routes.push(
    //   {
    //     "vehicle_allocated": '',
    //     "employees": [],
    //     "vehicle": [],
    //     "guard": [],
    //     "allowed": "all"
    //   }
    // )

    $scope.fullModel = [$scope.routes.data.routes];
    $scope.model2 = $scope.fullModel;
    console.log('scope model2');
    
  }

  $scope.collapsiblePanel = function (item) {
    if (item.collapse) {
      item.collapse = false;
    } else {
      item.collapse = true;
    }
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
    // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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

  $scope.slider_occupied = {
    minValue: 1,
    maxValue: 8,
    options: {
      floor: 0,
      ceil: 10,
      showTicksValues: true
    }
  };

  $scope.slider_empty = {
    minValue: 1,
    maxValue: 8,
    options: {
      floor: 0,
      ceil: 10,
      showTicksValues: true
    }
  };

  
  $scope.reset = function () {
    $state.reload(true);
  }

  $scope.tab = 1;

  $scope.search = '';

  $scope.setTab = function (tabId) {
    if (tabId == 2) {// non allocated 
      $scope.search = "Y";
    } else if (tabId == 3) {// non allocated 
      $scope.search = "N";
    } else {
      $scope.search = '';
    }

    $scope.tab = tabId;
  };


  $scope.isSet = function (tabId) {
    return $scope.tab === tabId;
  };

  $scope.routeChangedIds = [];

  $scope.checkBoxChanged = function (container) {
    console.log(container);
    if ($scope.routeChangedIds.indexOf(container.routeId) === -1) {
      $scope.routeChangedIds.push(container.routeId)
  
      $scope.isDisabled = false;
    }
  };



  $scope.dragoverCallback = function (container, index, external, type, callback) {
    if ($scope.routeChangedIds.indexOf(container.routeId) === -1) {
      $scope.routeChangedIds.push(container.routeId)
      console.log($scope.routeChangedIds);
      $scope.isDisabled = false;
    }

    if (type == 'container' && !external) {
      console.log('Container being dragged contains ' + callback() + ' items');
    }
    return index < 10; // Disallow dropping in the third row.
  };



  $scope.dropCallback = function (container, index, item, external, type) {
    if ($scope.routeChangedIds.indexOf(container.routeId) === -1) {
      $scope.routeChangedIds.push(container.routeId)
      console.log($scope.routeChangedIds);
      $scope.isDisabled = false;
    }
    return item;
  };

  $scope.dropVehicleCallback = function (container, index, item, external, type) {
    console.log('modified route after drag', container);
    var isAssign = true;
    if (isAssign) {
      var postData = {
        "vehicleId": item.vehicleId,
        "routeId": container.routeId
      };

      RouteService.assignVehicle(postData, function (data) {
        console.log("Vehicle Assign", data);
        if (data['success']) {
          isAssign = false;
        } else {
          $scope.toggleView = true;
          ToasterService.showError('Error', data['message']);
        }
        $scope.resetRoute();
      })
      return item;
    }

  };

  $scope.dropGuardCallback = function (container, index, item, external, type) {
    var isAssign = true;
    $scope.saveRoutes();
    if (isAssign) {

      var changedRoutes = [];

      angular.forEach($scope.routes.data.routes, function (route) {
        angular.forEach($scope.routeChangedIds, function (routeId) {
          if (route.routeId === routeId) {
            changedRoutes.push(route);
          }
        })
      })
   
  
      var finalChangedRoutes = [];
      angular.forEach(changedRoutes, function (route) {
       
        if(route.guard_required){
          route.guard_required="Y";
       }else{
         route.guard_required="N";
       }
        var employee_nodes = [];
        angular.forEach(route.employees, function (emp) {
          employee_nodes.push(emp.empId);
        })
        var data = {
          "route_id": route.routeId,
          "vehicle_category": route.vehicle_type,
          "employee_nodes": employee_nodes,
          "guard_required":route.guard_required
        }
        finalChangedRoutes.push(data);
      })

      var postData = {
        "guardId": item.guardId,
        "updated_routes": finalChangedRoutes,
        "routeId": container.routeId
      };

      RouteService.assignGuards(postData, function (data) {
        console.log("Guard Assign");
       
        $scope.resetRoute();
      })

      return item;
    }
  };

  $scope.logEvent = function (message) {
    // console.log(message);
  };

  $scope.logListEvent = function (action, index, external, type) {
    var message = external ? 'External ' : '';
    message += type + ' element was ' + action + ' position ' + index;
    // console.log(message);
  };

  $scope.allowedVehicalTypes = ['vehical'];
  $scope.allowedGuardTypes = ['guard'];

  // // Initialize model

  $scope.autoAllocate = function () {

    $scope.toggleView = false;    
    ToasterService.clearToast();
    if (!$scope.siteId) {
      ToasterService.clearToast();
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Select Site.');
      return;
    } else if (!$scope.selectedShift) {
      ToasterService.clearToast();
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Select Shift.');
      return;
    }
    // ToasterService.showSuccess('Success', 'Routes are allocated successfully.')
    // $scope.showStaticData(RouteStaticResponse.allocated_route_response);
    // return ;

    let shift = JSON.parse($scope.selectedShift);
    var postData = {
      'customerId': SessionService.custId,
      "siteId": $scope.siteId,
      "shiftId": shift.id,
      "shift_type": shift.trip_type,
      scheduledDate: moment($scope.filterDate).format('YYYY-MM-DD')
    }
    // var postData = {
    //   "siteId": 30,
    //   "shiftId": 138,
    //   "customerId": 1,
    //   "shift_type": 1,
    //   "scheduledDate": "2019-10-24"
    // }
    console.log('autoAllocate postData', postData)
    AutoAllocationService.query(postData, function (data) {
      console.log('autoallocation response ', data);
      if (data['success']) {
        ToasterService.clearToast();
        $scope.routes = data;
        if ($scope.routes.data) {
          ToasterService.clearToast();
          try {
            $scope.toggleView = true;
            console.log('In try loop');
            ToasterService.clearToast();
            ToasterService.showToast('info', 'Response Received', $scope.routes.data.routes.length + ' Routes found for this shift')
            $scope.originalRoutes = angular.copy($scope.routes.data.routes);
            $scope.stats = $scope.routes.data.tats[0];
            console.log($scope.model2)
          } catch (err) {
            console.log('In catch loop');
            $scope.routes = RouteStaticResponse.emptyResponse;
            $scope.routes.data.routes = [];
            ToasterService.clearToast();
            $scope.toggleView = true;
            ToasterService.showToast('info', 'Response Received', 'No Routes found for this shift')
            console.log('error', err)
          }
          $scope.showRouteData()
        }
      } else {
        console.log('data: ', data['message'])
        $scope.toggleView = true;
        ToasterService.showError('Error', data.message);
        setTimeout(()=>{
          ToasterService.clearToast();
        },20)
      }

      // $scope.resetRoute();


    }, function (err) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Something went wrong..');
    })
  }

  $scope.$watch('model2', function (model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);

  // Model to JSON for demo purpose
  $scope.$watch('guards', function (guards) {
    $scope.modelAsJson = angular.toJson(guards, true);
  }, true);

  // Model to JSON for demo purpose
  $scope.$watch('vehicals', function (vehicals) {
    $scope.modelAsJson = angular.toJson(vehicals, true);
  }, true);


  $scope.resetSidebar = function () {
    $scope.isVehicalSidebarView = false;
    $scope.isGuardSidebarView = false;
    $scope.isFilterSidebarView = false;
  }

  $scope.resetSidebar();

  $scope.hideVehicalSidebar = function () {
    $scope.isVehicalSidebarView = false;
  }

  $scope.showVehicalSidebar = function () {
    let shift = JSON.parse($scope.selectedShift);
    $scope.getVehicleListForSite($scope.siteId, shift.id, shift.trip_type);
    $scope.plateNumber = '';
    $scope.resetSidebar();
    $scope.isVehicalSidebarView = true;
  }

  $scope.hideGuardSidebar = function () {
    $scope.resetSidebar();
  }

  $scope.showGuardSidebar = function () {
    $scope.resetSidebar();
    $scope.isGuardSidebarView = true;
  }

  $scope.hideFilterSidebar = function () {
    $scope.resetSidebar();
  }

  $scope.showFilterSidebar = function () {
    $scope.resetSidebar();
    // $scope.isFilterSidebarView = true;
  }

  function calculateAndDisplayRoute(directionsService, directionsRenderer, waypts) {

    var postData ={
      "site_id": $scope.siteId
    }
    TripboardService.getAllSiteList(postData,function (data) {
      $scope.site = data.data.list[0];


      let shift = JSON.parse($scope.selectedShift);
    
      $scope.isSiteStatus=1;

    if($scope.getShiftType(shift.shift_type) == 1){
      $scope.isSiteStatus=1;
      makeMarker(new google.maps.LatLng($scope.site.latitude,$scope.site.longitude),$scope.site.name);
    }

   if($scope.getShiftType(shift.shift_type) ==0){
      $scope.isSiteStatus=0;
     makeMarker(new google.maps.LatLng($scope.site.latitude,$scope.site.longitude),$scope.site.name);
   }

   if($scope.isSiteStatus == 1){
     console.log('latLng', $scope.site.latitude);
     
    directionsService.route({
      origin: waypts[0].location,
      destination: new google.maps.LatLng($scope.site.latitude,$scope.site.longitude),
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
   }

   if($scope.isSiteStatus == 0){

    directionsService.route({
      origin: new google.maps.LatLng($scope.site.latitude,$scope.site.longitude),
      destination: waypts[waypts.length-1].location,
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
   }
    });
   




    // $scope.getCurrentVehicleLocation();
  }



  function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function () {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }
  // Helping Functions End

  $scope.getShiftType = (shiftType) => {
   
    return shiftType.toLowerCase() === 'check out' ? 1 : 0;
  }

  $scope.getCurrentVehicleLocation = (vehicleNumber) => {
    // call vehicle list api
    // $http({
    //   method: 'GET',
    //   url: 'https://intouch.mapmyindia.com/Intouch/apis/getEntityList?token=z5fmo6ekwd6ucrp4k9ujf1x5jwnw25m2'
    // })
    //   .then(function (response) {
    //   // console.log(JSON.stringify(response))

    //     if (response.entity.length > 0 && response.message === 'success' && response.status === 200) {
    //       const vehicleListData = response.entity.filter((e) => e.registrationNumber === vehicleNumber)

    //       if (vehicleListData.length > 0) {
    //         const entityId = vehicleListData[0].id
    //         $http({
    //           method: 'GET',
    //           url: 'https://intouch.mapmyindia.com/Intouch/apis/getEntityLiveData?token=z5fmo6ekwd6ucrp4k9ujf1x5jwnw25m2&entityId=' + entityId
    //         })
    //           .then((vehicleData) => {
    //           // map car icon in google map
    //           })
    //           .catch(() => {
    //             ToasterService.showError('Error', 'Something went wrong, Try again later.')    
    //           })
    //       } else {
    //         ToasterService.showError('Error', 'Something went wrong, Try again later.')
    //       }
    //     } else {
    //       ToasterService.showError('Error', 'Something went wrong, Try again later.')
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //     ToasterService.showError('Error', 'Something went wrong, Try again later.')
    //   })

    // hard coded vehicle location
    console.log('$scope.map ', $scope.map)
    var marker1 = new google.maps.Marker({
      map: $scope.map,
      position: new google.maps.LatLng(19.2578, 72.8731),
      icon: "../assets/angular_images/car.png"
    })
  }
});
