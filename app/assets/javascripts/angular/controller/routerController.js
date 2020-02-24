
angular.module('app').directive('setHeight', function ($window) {
  return {
    link: function (scope, element, attrs) {
      element.css('height', $window.innerHeight / 2 + 'px');
    }
  }
})
angular.module('app').directive("scroll", function ($window) {
  return function(scope, element, attrs) {
    
      angular.element($window).bind("scroll", function() {
          if (this.pageYOffset >= 250) {
               scope.boolChangeClass = true;
           } else {
               scope.boolChangeClass = false;
           }
          scope.$apply();
      });
  };
});

angular.module('app').directive("scroll", function ($window) {
  return function(scope, element, attrs) {
    
      angular.element($window).bind("scroll", function() {
          if (this.pageYOffset >= 250) {
               scope.boolChangeClass = true;
           } else {
               scope.boolChangeClass = false;
           }
          scope.$apply();
      });
  };
});

angular.module('app')
  .filter('range', function () {
    return function (items, property, min, max) {
      return items.filter(function (item) {
        return item[property] >= min && item[property] <= max;
      });
    };
  });

  angular.module('app').filter('propsFilter', function() {
    return function(items, props) {
      var out = [];
  
      if (angular.isArray(items)) {
        items.forEach(function(item) {
          var itemMatches = false;
  
          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }
  
          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }
  
      return out;
    }
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
  FinalizeService, RouteStaticResponse, ToasterService, SessionService, BASE_URL_API_8002, TripboardService,$q,$ngConfirm) {

    $scope.rut = {};

    $scope.itemArray = [
      {id: 1, name: 'first'},
      {id: 2, name: 'second'},
      {id: 3, name: 'third'},
      {id: 4, name: 'fourth'},
      {id: 5, name: 'fifth'},
  ];

  $scope.vehicleTypeArray = [
    {id: 1, type: 'HATCHBACK'},
    {id: 2, type: 'TT'},
    {id: 3, type: 'SUV'},
    {id: 4, type: 'SEDAN'},
    {id: 5, type: 'MINI VAN'}
];

  $scope.showVehicleTypeDialog=false;

  $scope.changeVehicleType =function(container){
    $scope.selectedContainer=container;
    $scope.showVehicleTypeDialog=true;
  }

   $scope.closeVehicleTypeDialog = () => {
    $scope.showVehicleTypeDialog=false;
  }

  $scope.updateTypes =function(type) {
    alert(type);
    $scope.closeVehicleTypeDialog();
  }

  $scope.onSelectGuardCallback = function (item,model,container) {
    var isAssign = true;
    // $scope.saveRoutes();

    $scope.routeChangedIds.push(container.routeId)
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

        if (route.guard_required==true) {
          route.guard_required = "Y";
        } 
        
        if (originalRoute.guard_required==false) {
          route.guard_required = "N";
        }
        var employee_nodes = [];
        angular.forEach(route.employees, function (emp) {
          if(emp.length){
            employee_nodes.push(emp.empId);
          }
        })
        var data = {
          "route_id": route.routeId,
          "vehicle_category": route.vehicle_type,
          "employee_nodes": employee_nodes,
          "guard_required": route.guard_required
        }
        finalChangedRoutes.push(data);
      })

      var postData = {
        "guardId": item.guardId,
        "updated_routes": finalChangedRoutes,
        "routeId": container.routeId
      };

      RouteService.assignGuards(postData, function (data) {
        $scope.resetRoute();
      })
    }
  };
  
    $scope.onSelectCallback =function(item,model,container){
     
      if(item){
        var postRouteData=getRoutePostData();
        
        RouteService.constraintCheck(postRouteData,function (response) {
          if(response.success){
            $scope.assignVehicleOnSelect(container,item);
            return true;
          }else{
            var htmlBody=$scope.returnVehicleHTML(response);
            
            $ngConfirm({
              title: 'Constraint Failed!',
              boxWidth: '40%',
              useBootstrap: false,
              content: htmlBody,
              scope: $scope,
              buttons: {
                  cancel: {
                    text: 'Revert',
                    btnClass: 'btn-blue',
                    action: function (scope) {
                    
                    }
                  },
                  procced: {
                      text: 'Proceed',
                      btnClass: 'btn-orange',
                      action: function(scope, button){
                        scope.assignVehicleOnSelect(container,item);
                        return true;
                      }
                  }
              }
            });
          }
        });
      }
    }

    $scope.assignVehicleOnSelect=function(container,item){
      var postData = {
        "vehicleId": item.vehicleId,
        "routeId": container.routeId
      };
  
      RouteService.assignVehicle(postData, function (data) {
        if (data['success']) {
          $scope.resetRoute();
          // isAssign = false;
          // ToasterService.clearToast();
          // $scope.toggleView = true;
          ToasterService.showSuccess('Success', data['message']);
        } else {
          $ngConfirm({
            title: 'Error!',
            boxWidth: '40%',
            useBootstrap: false,
            content:  data['message'],
            scope: $scope,
            buttons: {
                ok: {
                  text: 'Ok',
                  btnClass: 'btn-blue',
                  action: function (scope) {
                    scope.resetRoute();
                  }
                }
            }
          });
        }
        
      })
  
    }
  

  // $scope.toggleView = false;
  $scope.disableBtn = false;
  // ToasterService.clearToast();
  $scope.place = {};
  // Map.init();

  var directionsRenderer 
  $scope.initMap = () => {

    directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 19.2578, lng: 72.8731 },
      mapTypeId: 'terrain'
    });
    $scope.map = map;
    directionsRenderer.setMap(map);

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
   
    var stepDisplay = new google.maps.InfoWindow;




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

    // calculateAndDisplayRoute( directionsService, directionsRenderer, waypts)

  }

  $scope.isLoader = false;

  $scope.selected_vehicle_status = 'on_duty';

  $scope.onVehicleStatusChange = (value) => {
    console.log('value ', value);
    $scope.selected_vehicle_status = value;
    let shift = JSON.parse($scope.selectedShift);
    $scope.getVehicleListForSite($scope.siteId, shift.id, shift.trip_type);
  }

  $scope.finalizeArray = [];
  $scope.coords = []



  $scope.init = function () {
    $scope.toggleView = false;

    // ToasterService.clearToast();
    $scope.stats = {
      "no_of_routes": 0,
      "male_count": 0,
      "female_count": 0,
      "special": 0,
      "on_duty_vehicle": 0,
      "kilometres": 0
    }

    // $scope.initMap();

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
      { name: 'On Duty', value: 'on_duty' },
      { name: 'Off Duty', value: 'off_duty' }
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


    $scope.getStyleInPx =function(capacity){
      var multiplier =(capacity % 4) > 0 ? 1 : 0
      return {
        'min-height': (Math.trunc(capacity/4)+ multiplier )*110+'px'
      }
    }

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

    console.log('route', route.routeId, route)
    RouteService.removeVehicle({ routeId: route.routeId }, res => {
      console.log(res)
      if (res['success']) {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res['message']);
        $scope.resetRoute()
      } else {
        $scope.toggleView = true;
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      console.log(er);
    });
  }

  $scope.removeGuard = (guard, route) => {
    console.log('route', route.routeId, route)
    RouteService.removeGuard({ routeId: String(route.routeId), guardId: String(guard.guardId) }, res => {
      if (res['success']) {
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res['message']);
        $scope.resetRoute()
      } else {
        $scope.toggleView = true;
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      console.log(er);
    });
  }


  $scope.searchVehicleAsync = (plateNumber) => {
    $scope.plateNumber = plateNumber;

    if(plateNumber){
      let shift = JSON.parse($scope.selectedShift);

      let params = { shiftId: shift.id, shift_type: shift.trip_type, searchBy: plateNumber, to_date: moment($scope.filterDate).format('YYYY-MM-DD') };
  
      return RouteService.searchVechicle(params).$promise.then(function (result) {
          return result.data;
      });
    }else{
      let postVehicleData = {
        siteId:$scope.siteId, shiftId:$scope.selectedShift.id, shiftType:$scope.selectedShift.trip_type,
        selectedDate: moment($scope.filterDate).format('YYYY-MM-DD'),
        driverStatus: $scope.selected_vehicle_status
      }
      
      return RouteService.postVehicleList(postVehicleData).$promise.then(function (result) {
        return result.data;
      });
    }
  
  }

  $scope.getVehicleListForSite = function (siteId, shiftId, shiftType) {

    if (siteId == null || shiftId == null || shiftType == null) {
      return;
    }

    let postVehicleData = {
      siteId, shiftId, shiftType,
      selectedDate: moment($scope.filterDate).format('YYYY-MM-DD'),
      driverStatus: $scope.selected_vehicle_status
    }
    
    RouteService.postVehicleList(postVehicleData, function (res) {
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

    // $scope.toggleView = false;

    if (siteId == null || shiftId == null) {
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
    // $scope.toggleView = false;
    let postData = {
      "site_id": $scope.siteId,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }

    RosterService.get(postData, function (data) {
      $scope.shifts = data.data.shiftdetails;
      if ($scope.shifts && $scope.shifts.length) {
        $scope.selectedShift = JSON.stringify($scope.shifts[0]);
        $scope.resetRoute();
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
        console.log('data: ', data);
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

  function removeDumplicateValue(myArray){ 
    var newArray = [];
    angular.forEach(myArray, function(value, key) {
      var exists = false;
      angular.forEach(newArray, function(val2, key) {
        if(angular.equals(value.routeId, val2.routeId)){ exists = true }; 
      });
      if(exists == false && value.routeId != "") { newArray.push(value); }
    });
    return newArray;
  }

  $scope.finalizeRoutes = () => {

    angular.forEach($scope.model2, function (containers) {
      angular.forEach(containers, function (container) {
        if (container.routeId && container.route_selected) {
          $scope.finalizeArray.push({ routeId: container.routeId });
        }
      })
    })

    $scope.newFinalizeArray=removeDumplicateValue($scope.finalizeArray);

    if ($scope.newFinalizeArray.length === 0) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Kindly select a route before save')
      return;
    }else{
      let postdata = { routesFinalizeArray: $scope.newFinalizeArray }
      FinalizeService.query(postdata, (data) => {
        $scope.resetRoute();
        $scope.allRouteSelected=false;
      }, err => {
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Something went wrong')
      });
    }
  }

  $scope.roundValue = (val) => {
    return parseInt(val)
  }

  $scope.saveRoutes = function () {
    var postData=getRoutePostData();
    $scope.isDisabled = true;

    RouteUpdateService.query(postData, function (res) {
      $scope.isDisabled = false;
      $scope.routeChangedIds=[];
      if (res['success']) {
        $scope.resetRoute();
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', res['message']);
      } else {
        $ngConfirm({
          title: 'Update Routes Failed!',
          boxWidth: '40%',
          useBootstrap: false,
          content: res['message'],
          scope: $scope,
          buttons: {
              OK: {
                text: 'OK',
                btnClass: 'btn-blue',
                action: function (scope) {
                  scope.resetRoute();
                }
              }
          }
        });
      }
    })
  }

  $scope.resetRoute = function () {

    $scope.isLoader = true;
    $scope.finalizeArray = [];
    $scope.routeChangedIds = [];

    $scope.generateRoute($scope.siteId, $scope.selectedShift.id, $scope.filterDate, $scope.selectedShift.trip_type);
  }

  $scope.plateNumber = '';

  $scope.closePopup = () => {
    $scope.showPopup = false;
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

  $scope.createNewRoute = function (vehicleType) {
    var routeId;

    angular.forEach($scope.vehicleCategoryList, function (vehicle, idx) {
      if (vehicle.id == vehicleType) {
        $scope.vehicle = vehicle;
      }
    });

    angular.forEach($scope.routes.data.routes, function (route, index, routeArray) {
      if (index === routeArray.length - 2) {
        routeId = route.routeId
      }
    });

    let shift = JSON.parse($scope.selectedShift);
    let postData = {
      "routeId": String(routeId),
      "site_id": String($scope.siteId),
      "shift_id": String(shift.id),
      "seating_capacity": String($scope.vehicle.seating_capacity),
      "vehicle_category": $scope.vehicle.category_name,
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

    let params = { shiftId: shift.id, shift_type: shift.trip_type, searchBy: plateNumber, to_date: moment($scope.filterDate).format('YYYY-MM-DD') };
    RouteService.searchVechicle(params, function (res) {
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
      }
    }, function (error) {
      console.log(error);
    });


  }

  $scope.showStaticData = (res) => {
    // $scope.toggleView = false;

    // ToasterService.clearToast();
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


  $scope.checkSiteTime =function(time){
    return time > $scope.site_time;
  }
  $scope.checkSiteDistance =function(distance){
   return distance > $scope.site_distance;
  }

  $scope.generateRoute = function (siteId, shiftId, filterDate, shiftType) {

    RouteService.getConstraintsForSite({site_id:siteId},function (res) {
      $scope.site_time =res.data.time;
      $scope.site_distance =res.data.distance;
    });

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
  
    RouteService.getRoutes(postData, (data) => {

      // $scope.toggleView = false;
      // ToasterService.clearToast();
      console.log(data);
      if (!data['success']) {
        // ToasterService.clearToast();
        $scope.toggleView = true;
        ToasterService.showError('Error', data['message']);
        return;
      }
      $scope.routes = data;
      // $scope.routes =RouteStaticResponse.route_response;

      if ($scope.routes.data) {
        try {
          // ToasterService.showToast('info', 'Response Received', $scope.routes.data.routes.length+' Routes found for this shift')
          $scope.originalRoutes = angular.copy($scope.routes.data.routes);
          $scope.stats = $scope.routes.data.tats[0];
        } catch (err) {
          $scope.stats = { no_of_routes: 0, kilometres: 0, male_count: 0, female_count: 0, special: 0, on_duty_vehicle: 0 };
          $scope.routes = RouteStaticResponse.emptyResponse;
          $scope.routes.data.routes = [];
          $scope.toggleView = true;
          // ToasterService.showSuccess('info', 'Response Received', 'No Routes found for this shift')
          console.log('error', err)
        }
        $scope.showRouteData()
      }
    }, (error) => {
      console.log(error);
    });
  }

  $scope.showRouteData = () => {
    // $scope.toggleView = false;
    $scope.isLoader=false;
    // ToasterService.clearToast();
    angular.forEach($scope.routes.data.routes, function (route, index, routeArray) {
      route.allowed = "all";

      if (route.guard_required == "Y") {
        route.guard_required = true;
      } 

      if (route.guard_required == "N") {
        route.guard_required = false;
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

      if(route.subtype=="unallocated"){
         route.vehicle_allocated='';
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
    if ($scope.routeChangedIds.indexOf(container.routeId) === -1) {
      $scope.routeChangedIds.push(container.routeId)
      $scope.isDisabled = false;
    }
      if(container.guard_required){
        container.guard_required=true;
      }else{
        container.guard_required=false;
      }
 
        var postData=getRoutePostData();
        RouteService.constraintCheck(postData,function (response) {
          if(response.success){
            $scope.saveRoutes();
          }else{
            var htmlBody=$scope.returnHTML(response);
            
            $ngConfirm({
              title: 'Constraint Failed!',
              boxWidth: '40%',
              useBootstrap: false,
              content: htmlBody,
              scope: $scope,
              buttons: {
                  cancel: {
                    text: 'Revert',
                    btnClass: 'btn-blue',
                    action: function (scope) {
                      scope.resetRoute();
                    }
                  },
                  procced: {
                      text: 'Proceed',
                      btnClass: 'btn-orange',
                      action: function(scope, button){
                        scope.updateRouteConstraint(response,postData);
                      }
                  }
              }
            });
          }
        });
  };



  $scope.dragoverCallback = function (container, index, external, type, callback) {
    if ($scope.routeChangedIds.indexOf(container.routeId) === -1) {
      $scope.routeChangedIds.push(container.routeId)
      $scope.isDisabled = false;
    }
    $scope.newModel=angular.copy($scope.model2)
 
    return index < 100000000; 
  };

  $scope.isShowMap =false;
  $scope.toggleMap =function() {
    $scope.resetRoute();
    if($scope.isShowMap){
      $scope.isShowMap=false;
    }else{
      $scope.isShowMap=true;
    }
  }

  $scope.dropItemCallback = function (container, index, item, external, type) {
    if ($scope.routeChangedIds.indexOf(container.routeId) === -1) {
      $scope.routeChangedIds.push(container.routeId)
      $scope.isDisabled = false;
    }

    // $scope.checkDroppable(container,index,item);
    return item;
  }


  $scope.dropCallback = function (container, index, item, external, type,element) {
      var postData=getRoutePostData();

      RouteService.constraintCheck(postData,function (response) {
        if(response.success==true){
          // $scope.updateRouteConstraint(response,postData);
          $scope.saveRoutes();
        }else{
          var htmlBody=$scope.returnHTML(response);
          
          $ngConfirm({
            title: 'Constraint Failed!',
            boxWidth: '40%',
            useBootstrap: false,
            content: htmlBody,
            scope: $scope,
            buttons: {
                cancel: {
                  text: 'Revert',
                  btnClass: 'btn-blue',
                  action: function (scope) {
                    scope.model2=scope.newModel;
                    // scope.routeChangedIds = [];
                    scope.resetRoute();
                    $ngConfirm("Reverted successfully")
                    // return false;
                  }
                },
                procced: {
                    text: 'Proceed',
                    btnClass: 'btn-orange',
                    action: function(scope, button){
                      scope.updateRouteConstraint(response,postData);
                    }
                }
            }
          });
        }
      });
  };

  $scope.updateRouteConstraint = function(response,postData){
     $scope.resData=response.data.errLogs;

     angular.forEach($scope.model2, function (container) {
       angular.forEach(container, function (route) {
        angular.forEach($scope.resData, function (item) {
          if (route.routeId == item.routeId) {
            if(item.distance){
              route.total_distance = item.distance.distance;
            }
            if(item.time){
              route.total_time = item.time.duration;
            }
            
            if(item.guard){
              route.guard_constraint_failed=item.guard ? true :false;
              route.guard_required=item.guard.guard_required;
            }
          }
        })
      })
    })

    $scope.saveRoutes();

  }

  $scope.returnVehicleHTML =function(response){
    $scope.res=response.data.errLogs;

    var html = '<div ng-repeat="item in res" ng-if="res.length">'+
                '<div class="">'+
                  '<div class="card-header">Trip_Id :{{item.tripId}}</div><hr>'+
                  '<div class="card-body" style="min-height:auto !important;">'+
                    '<div class="alert alert-danger" role="alert" ng-if="item.vehicle">'+
                      '{{item.vehicle.reason}}'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div ng-if="!res.length">Something Went Wrong!</div>';

    return html;
  }

  $scope.returnHTML =function(response){
    $scope.res=response.data.errLogs;

    var html = '<div ng-repeat="item in res" ng-if="res.length">'+
                '<div class="">'+
                  '<div class="card-header">Trip_Id :{{item.tripId}}</div><hr>'+
                  '<div class="card-body" style="min-height:auto !important;">'+
                    '<div ng-if="item.guard.errors" ng-repeat="error in item.guard.errors">'+
                      '<div class="alert alert-danger" role="alert">'+
                        '{{error.reason}}'+
                      '</div>'+
                    '</div>'+
                    '<div class="alert alert-danger" role="alert" ng-if="item.time">'+
                        '{{item.time.reason}}'+
                    '</div>'+
                    '<div class="alert alert-danger" role="alert" ng-if="item.distance">'+
                      '{{item.distance.reason}}'+
                    '</div>'+
                    '<div class="alert alert-danger" role="alert" ng-if="item.vehicle">'+
                      '{{item.vehicle.reason}}'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div ng-if="!res.length">Something Went Wrong!</div>';

    return html;
  }

  $scope.checkDroppable = function(container,index,item) {
      for(var key in container.employees) {
        if(Object.keys(angular.copy(container.employees[key])).length<=1){
            var target_index = key;
        }
      }

      container.employees.splice(index,1,item);
      angular.copy(container.employees).forEach(function(value, key) {
          if(key!=target_index && angular.toJson(value)==angular.toJson(container.employees[target_index])){
            container.employees.splice(key, 1);
          }
      });
  }

  function getRoutePostData(){
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
      if (route.guard_required==true) {
        route.guard_required = "Y";
      }
      if (route.guard_required==false) {
        route.guard_required = "N";
      }
      var employee_nodes = [];
      angular.forEach(route.employees, function (emp) {
        if(emp.empId){
          employee_nodes.push(emp.empId);
        }
      })
      
      var data = {
        "route_id": route.routeId,
        "trip_id" :route.tripId,
        "vehicle_category": route.vehicle_type,
        "employee_nodes": employee_nodes,
        "guard_required": route.guard_required
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
      if (originalRoute.guard_required==true) {
        originalRoute.guard_required = "Y";
      }  
      if (originalRoute.guard_required==false) {
        originalRoute.guard_required = "N";
      }

      var employee_nodes = [];
      angular.forEach(originalRoute.employees_nodes_addresses, function (orgEmp) {
        if(orgEmp.empId){
          employee_nodes.push(orgEmp.empId);
        }
      })
      
      var data = {
        "route_id": originalRoute.routeId,
        "vehicle_category": originalRoute.vehicle_type,
        "employee_nodes": employee_nodes,
        "guard_required": originalRoute.guard_required
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

      return postData;
     }else{
      return postData = {
        "site_id": "",
        "shift_id": "",
        "to_date": "",
        "shift_type": "",
        "updated_routes": ""
      } 
     }
  }
  
 

  $scope.dropVehicleCallback = function (container, index, item, external, type) {
    
    var isAssign = true;
    if (isAssign) {
      var postRouteData=getRoutePostData();
    
      RouteService.constraintCheck(postRouteData,function (response) {
        if(response.success){
          $scope.VehicleAssignCallback(item,container);
          return item;
        }else{
          var htmlBody=$scope.returnVehicleHTML(response);
          
          $ngConfirm({
            title: 'Constraint Failed!',
            boxWidth: '40%',
            useBootstrap: false,
            content: htmlBody,
            scope: $scope,
            buttons: {
                cancel: {
                  text: 'Revert',
                  btnClass: 'btn-blue',
                  action: function (scope) {
                  
                  }
                },
                procced: {
                    text: 'Proceed',
                    btnClass: 'btn-orange',
                    action: function(scope, button){
                      scope.VehicleAssignCallback(item,container);
                      return item;
                    }
                }
            }
          });
        }
      });
    }
  };

  $scope.getColor =function(container) {
    if(container.is_distance_exceeded=="N" && container.is_time_exceeded=="N" && container.vehicle_utilization<100){
      return 1;
    }if(container.is_distance_exceeded=="Y" && container.is_time_exceeded=="Y" && !container.guard.length){
      return 2;
    }if(container.is_distance_exceeded=="N" && container.is_time_exceeded=="N" && container.total_seats>=container.employees.length && container.guard.length){
      return 3;
    }
  }

  $scope.VehicleAssignCallback=function(item,container){
    var postData = {
      "vehicleId": item.vehicleId,
      "routeId": container.routeId
    };

    RouteService.assignVehicle(postData, function (data) {
      if (data['success']) {
        isAssign = false;
        // ToasterService.clearToast();
        $scope.toggleView = true;
        ToasterService.showSuccess('Success', data['message']);
      } else {
        $ngConfirm({
          title: 'Constraint Failed!',
          boxWidth: '40%',
          useBootstrap: false,
          content:  data['msg'],
          scope: $scope,
          buttons: {
              ok: {
                text: 'Revert',
                btnClass: 'btn-blue',
                action: function (scope) {
                
                }
              }
          }
        });
      }
      $scope.resetRoute();
    })

  }

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

        if (route.guard_required==true) {
          route.guard_required = "Y";
        } 
        
        if (originalRoute.guard_required==false) {
          route.guard_required = "N";
        }
        var employee_nodes = [];
        angular.forEach(route.employees, function (emp) {
          if(emp.length){
            employee_nodes.push(emp.empId);
          }
        })
        var data = {
          "route_id": route.routeId,
          "vehicle_category": route.vehicle_type,
          "employee_nodes": employee_nodes,
          "guard_required": route.guard_required
        }
        finalChangedRoutes.push(data);
      })

      var postData = {
        "guardId": item.guardId,
        "updated_routes": finalChangedRoutes,
        "routeId": container.routeId
      };

      RouteService.assignGuards(postData, function (data) {
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

    if (!$scope.siteId) {
      $scope.toggleView = true;
      ToasterService.showError('Error', 'Select Site.');
      return;
    } else if (!$scope.selectedShift) {
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
    
    AutoAllocationService.query(postData, function (data) {
      console.log('autoallocation response ', data);
      if (data['success']) {
        $scope.routes = data;
        if ($scope.routes.data) {
          try {
            $scope.toggleView = true;
            console.log('In try loop');
            // ToasterService.showToast('info', 'Response Received', $scope.routes.data.routes.length + ' Routes found for this shift')
            $scope.originalRoutes = angular.copy($scope.routes.data.routes);
            $scope.stats = $scope.routes.data.tats[0];
          } catch (err) {
            $scope.routes = RouteStaticResponse.emptyResponse;
            $scope.routes.data.routes = [];
            $scope.toggleView = true;
            // ToasterService.showToast('info', 'Response Received', 'No Routes found for this shift')
            console.log('error', err)
          }
          $scope.showRouteData()
        }
      } else {
        $scope.toggleView = true;
      }
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

  $scope.isSiteStatus = 1;
  $scope.site;
  function calculateAndDisplayRoute(directionsService, directionsRenderer, waypts) {
    for (let item of $scope.siteList) {
      if (item.id === $scope.siteId) {
        var site = item;
      }
    }

    let shift = JSON.parse($scope.selectedShift);
    if ($scope.getShiftType(shift.shift_type) == 1) {
      $scope.isSiteStatus = 1;
      makeMarker(new google.maps.LatLng(site.latitude, site.longitude), site.name, true);
    }

    if ($scope.getShiftType(shift.shift_type) == 0) {
      $scope.isSiteStatus = 0;
      makeMarker(new google.maps.LatLng(site.latitude, site.longitude), site.name, true);
    }

    if ($scope.isSiteStatus == 1) {
      directionsService.route({
        origin: waypts[0].location,
        destination: new google.maps.LatLng(site.latitude, site.longitude),
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
          console.log('Directions request failed due to ' + status);
        }
      });
    }

    if ($scope.isSiteStatus == 0) {
      directionsService.route({
        origin: new google.maps.LatLng(site.latitude, site.longitude),
        destination: waypts[waypts.length - 1].location,
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
          console.log('Directions request failed due to ' + status);
        }
      });
    }

    // $scope.getCurrentVehicleLocation();
  }

  $scope.selectAllRoute =function(models){
    if($scope.allRouteSelected){
      angular.forEach(models, function (containers) {
        angular.forEach(containers, function (container) {
          container.route_selected =true;
        })
      })
    }else{
      angular.forEach(models, function (containers) {
        angular.forEach(containers, function (container) {
          container.route_selected =false;
        })
      })
    }
  }
 
  $scope.selectRoute = (container) => {
    if (!container.route_selected) {
      return;
    }
    
    // $scope.finalizeArray.push({ routeId: container.routeId });

    var waypts = [];
    for (let item of container.employees) {
      waypts.push({
        location: new google.maps.LatLng(item.lat, item.lng),
        stopover: true
      });
      makeMarker(new google.maps.LatLng(item.lat, item.lng), item.empName);
    }

    // var directionsService = new google.maps.DirectionsService();
    

    var stepDisplay = new google.maps.InfoWindow;

    calculateAndDisplayRoute(directionsService, directionsRenderer, waypts)
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

  function makeMarker(position, title, isSite = false) {
    // var image = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23808080%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E' + 'umar' + '%3C%2Ftext%3E%3C%2Fsvg%3E';
    if (!isSite) {
      return showCustomMarker(position, title, title)
    }
    return new google.maps.Marker({
      position: position,
      map: $scope.map,
      title: title,
      animation: google.maps.Animation.DROP,
    });

    function showCustomMarker() {
      // var image = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23808080%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E' + 'umar' + '%3C%2Ftext%3E%3C%2Fsvg%3E';
      return new google.maps.Marker({
        position: position,
        map: $scope.map,
        title: title,
        animation: google.maps.Animation.DROP,
        // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        label: { color: '#fff', fontWeight: 'bold', fontSize: '14px', text: title.charAt(0).toUpperCase() }
      });
    }
  }

  
});
