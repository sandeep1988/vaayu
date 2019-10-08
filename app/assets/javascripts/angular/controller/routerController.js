
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

angular.module('app').controller('routeCtrl', function ($scope, $http, $state, Map, VehicleService, SiteService, GuardsService, RosterService, RouteService, RouteUpdateService,
  AutoAllocationService, VehicleAssignService, GuardAssignService,
  FinalizeService, RouteStaticResponse) {

  $scope.place = {};
  // Map.init();

  $scope.initMap = function () {
    $scope.mymap = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 0, lng: -180 },
      mapTypeId: 'terrain'
    });

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

  }

  $scope.drawMapPath = (coordinates) => {
    var pt = new google.maps.LatLng(coordinates[0].lat, coordinates[0].lng);
    // var pt = new google.maps.LatLng(19.184925, 72.8398173);

    $scope.mymap.setCenter(pt);
    $scope.mymap.setZoom(13);

    let flightPath = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap($scope.mymap);
  }

  $scope.finalizeArray = [];

  $scope.selectRoute = (container) => {
    $scope.finalizeArray.push(container);

    var coords = [];
    angular.forEach(container.employees, function (emp, idx, empArray) {
      try {
        coords.push({ lat: parseFloat(emp.lat), lng: parseFloat(emp.long) })
      } catch (er) { console.log(er) }
    });

    $scope.drawMapPath(coords)
  }


  $scope.init = function () {

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


    RosterService.getAllSiteList(function (data) {
      $scope.siteList = data.data.list;
      $scope.siteId = $scope.siteList[0].id;

      let postData = {
        "site_id": $scope.siteList[0].id,
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
      }

      RosterService.get(postData, function (data) {
        if (data.data) {
          $scope.shifts = data.data.shiftdetails;
          if ($scope.shifts && $scope.shifts.length) {
            $scope.selectedShift = $scope.shifts[0];
            $scope.resetRoute();
            // $scope.genrateRoute($scope.siteId,$scope.shifts[0].id,moment().format('YYYY-MM-DD'),1);
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

  $scope.getVehicleAndGuardList = function (siteId, shiftId) {

    GuardsService.get({ "siteId": siteId, "shiftId": shiftId }, function (res) {
      // $scope.guardList = res.data;
      $scope.guardList = RouteStaticResponse.all_guards_response;
      console.log(res.data);
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

    VehicleService.get({ "siteId": siteId, "shiftId": shiftId }, function (res) {
      // $scope.vehicleList = res.data;
      $scope.vehicleList = RouteStaticResponse.all_vehicle_response;
      console.log(res.data);
      angular.forEach($scope.vehicleList, function (item) {
        item.type = "vehical";
      })
      $scope.vehicals = [
        {
          label: "Vehical",
          allowedTypes: ['vehical'],
          max: 4,
          vehical: $scope.vehicleList
        }
      ];
    }, function (error) {
      console.log(error);
    });
  }

  $scope.updateFilters = function () {
    let postData = {
      "site_id": $scope.siteId,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }


    RosterService.get(postData, function (data) {
      $scope.shifts = data.data.shiftdetails;
    }
      , function (error) {
        console.log(error);
      });
  }

  $scope.shuffleEvent = function (item) {
    console.log(message);
  };

  $scope.isDisabled = true;

  $scope.finalizeRoutes = function () {
    FinalizeService.query($scope.finalizeArray, function () {
      $scope.resetRoute();
    });
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
      var employee_nodes = [];
      angular.forEach(route.employees, function (emp) {
        employee_nodes.push(emp.empId);
      })
      var data = {
        "route_id": route.routeId,
        "vehicle_category": route.vehicle_type,
        "employee_nodes": employee_nodes
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
      var employee_nodes = [];
      angular.forEach(originalRoute.employees_nodes_addresses, function (orgEmp) {
        employee_nodes.push(orgEmp.empId);
      })
      var data = {
        "route_id": originalRoute.routeId,
        "vehicle_category": originalRoute.vehicle_type,
        "employee_nodes": employee_nodes
      }
      original_routes.push(data);
    })

    if (finalChangedRoutes.length) {

      let postData = {
        "site_id": parseInt($scope.siteId),
        "shift_id": parseInt($scope.selectedShift.id),
        "to_date": moment($scope.filterDate).format('YYYY-MM-DD'),
        "shift_type": $scope.selectedShift.shift_type,
        "updated_routes": finalChangedRoutes,
        "original_route": original_routes
      }

      $scope.isDisabled = true;

      RouteUpdateService.query(postData, function (res) {
        $scope.resetRoute();
      })
    }
  }

  $scope.resetRoute = function () {
    $scope.finalizeArray = [];
    $scope.routeChangedIds = [];

    $scope.genrateRoute($scope.siteId, $scope.selectedShift.id, $scope.filterDate, $scope.selectedShift.trip_type);
  }

  $scope.showStaticData = () => {
    $scope.routes = RouteStaticResponse.route_response;

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

    $scope.routes.data.routes.push(
      {
        "vehicle_allocated": '',
        "employees": [],
        "vehicle": [],
        "guard": [],
        "allowed": "all"
      }
    )

    $scope.fullModel = [$scope.routes.data.routes];
    $scope.model2 = $scope.fullModel;
  }

  $scope.genrateRoute = function (siteId, shiftId, filterDate, shiftType) {

    let shift = JSON.parse($scope.selectedShift);

    $scope.showStaticData();

    // $scope.getVehicleAndGuardList(siteId, shift.id);
    $scope.getVehicleAndGuardList(siteId, 92);



    let postData = {
      "site_id": parseInt($scope.siteId),
      "shift_id": parseInt(shift.id),
      "to_date": moment(filterDate).format('YYYY-MM-DD'),
      "shift_type": shift.trip_type // 0 -checkin 1-checout
    }
    console.log('getRoutes = ' + JSON.stringify(postData));
    // RouteService.getRoutes(postData, (data) => {

    //   // $scope.routes =data;
    //   console.log(data);
    //   $scope.routes = RouteStaticResponse.route_response;

    //   $scope.originalRoutes = angular.copy($scope.routes.data.routes);

    //   $scope.stats = $scope.routes.data.tats[0];

    //   angular.forEach($scope.routes.data.routes, function (route, index, routeArray) {
    //     route.allowed = "all";
    //     if (route.guard) {
    //       let guard = route.guard;
    //       guard.type = 'guard';
    //       route.guard = [guard]
    //     } else {
    //       route.guard = [];
    //     }
    //     if (route.vehicle) {
    //       let vehical = route.vehicle;
    //       vehical.type = 'vehical';
    //       route.vehicle = [vehical]
    //     } else {
    //       route.vehicle = [];
    //     }

    //     angular.forEach(route.employees_nodes_addresses, function (employee, idx, emmplyeeArray) {
    //       employee.type = "employee";
    //       employee.effectAllowed = "all";
    //     })

    //     route.employees = route.employees_nodes_addresses;
    //   })

    //   $scope.routes.data.routes.push(
    //     {
    //       "vehicle_allocated": '',
    //       "employees": [],
    //       "vehicle": [],
    //       "guard": [],
    //       "allowed": "all"
    //     }
    //   )

    //   $scope.fullModel = [$scope.routes.data.routes];
    //   $scope.model2 = $scope.fullModel;


    // }
    //   , (error) => {
    //     console.log(error);
    //   });
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

    var isAssign = true;
    if (isAssign) {
      var postData = {
        "vehicleId": item.vehicleId,
        "routeId": container.routeId
      };

      VehicleAssignService.query(postData, function (data) {
        console.log("Guard Assign");
        isAssign = false;
      })
      return container;
    }

  };

  $scope.dropGuardCallback = function (container, index, item, external, type) {

    var isAssign = true;
    if (isAssign) {
      var postData = {
        "guardId": item.id,
        "routeId": container.routeId
      };

      GuardAssignService.query(postData, function (data) {
        console.log("Guard Assign");
        $scope.resetRoute();
      })

      return container;
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
    var postData = {
      "site_id": $scope.siteId,
      "shift_id_id": $scope.selectedShift.id,
    }
    AutoAllocationService.query(function (data) {
      $scope.routes = data;
      $scope.resetRoute();
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
    $scope.isFilterSidebarView = true;
  }

  $scope.getShiftType = (shiftType) => {
    return shiftType.toLowerCase() === 'check out' ? 1 : 0;
  }

});
