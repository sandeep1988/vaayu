app.controller('constraintController', function ($scope, $http, $state, ConstraintService, SessionService, ToasterService, $timeout,constraintService,RosterService, $ngConfirm) {

  $scope.siteNames = [];
  $scope.siteID = null;
  $scope.siteName = null;
  $scope.siteLat = null;
  $scope.siteLong = null;
  $scope.zipcode = null;




  this.$onInit = () => {
    $scope.fetchSiteList();
  }


  $scope.reset = function () {
    $state.reload(true);
  }

  $scope.tab = 1;

  $scope.setTab = function (tabId) {
    console.log('set tabbed');
    $scope.tab = tabId;
  };

  $scope.isSet = function (tabId) {
    return $scope.tab === tabId;
  };

  $scope.fetchConstraintList = (id) => {
    $scope.selectedSiteId=id;
    console.log('selectedSiteId',$scope.selectedSiteId);
    console.log(SessionService.uid);
    console.log(SessionService.access_token);
    console.log(SessionService.client);

    ConstraintService.getAllConstraints({id}, res => {
      if (res['success']) {
        $scope.max_trip_time = null;
        $scope.distance = null;
        var constraintList = res.data;
        var guardConstraints = [];
        console.log('constraintList',constraintList);
        
        for (i = 0; i < constraintList.length; i++) {
          if (constraintList[i].type === 'time') {
            $scope.max_trip_time = constraintList[i].value;
            console.log('max_trip_time', $scope.max_trip_time)
          } else if (constraintList[i].type === 'distance') {
            $scope.distance = constraintList[i].value;
            console.log('distance', $scope.distance)
          } else if (constraintList[i].type === 'guard') {
            guardConstraints.push(constraintList[i])
          }
        }
        $scope.constraintList = guardConstraints;
        
        arr = $scope.constraintList.sort((a, b) => a.id > b.id ? -1 : 1);
      } else {
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      console.log(er)
      // ToasterService.showError('Error', 'Something went wrong, Try again later.');
    });

    ConstraintService.getConfigCutoff({id}, (response) => {
      console.log('Response cutoff : ', response);
      if(response.success)
      {
         $scope.CutoffListBySite = response.data;
         console.log($scope.CutoffListBySite);
       angular.forEach($scope.CutoffListBySite, function (value, key) {
                console.log(key + ": " + value.request_type + ": " + value.value);
                if(value.request_type === 'WE_cutoff_checkout'){$scope.we_checkin = parseInt(value.value)};
                if(value.request_type === 'WD_cutoff_checkin'){$scope.wd_checkin = parseInt(value.value)};
                if(value.request_type === 'WD_cutoff_checkout'){$scope.wd_checkout = parseInt(value.value)};
                if(value.request_type === 'WE_cutoff_checkin'){$scope.we_checkout = parseInt(value.value)};


        });
      }
     

    }), (error) => {
      console.log('Error: ', error)
    }

  }


  $scope.sortByKey = (array, key) => {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];

      if (typeof x == "string") {
        x = ("" + x).toLowerCase();
      }
      if (typeof y == "string") {
        y = ("" + y).toLowerCase();
      }

      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  $scope.fetchSiteList = () => {

    ConstraintService.getSiteList(res => {
      if (res['success']) {
        $scope.siteNames = res.data.list;
        $scope.$broadcast('onSiteListReceived', res.data.list);
        console.log(JSON.stringify($scope.siteNames))
      } else {
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      console.log(err)
      ToasterService.showError('Error', 'Something went wrong, Try again later.');
    });

    // $http({
    //   method: 'POST',
    //   url: 'http://apiptsdemo.devmll.com:8001/api/v1/getAllSiteList',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'uid': SessionService.uid,
    //     'access_token': SessionService.access_token, //'8HP_3YQagGCUoWCXiCR_cg'
    //     'client': SessionService.client//'DDCqul04WXTRkxBHTH3udA',
    //   },
    //   data: { test: 'test' }
    // })
    //   .then(function (res) {
    //     if (res.data['success']) {
    //       $scope.siteNames = res.data.data.list;
    //       $scope.$broadcast('onSiteListReceived', res.data.data.list);
    //       console.log(JSON.stringify($scope.siteNames))
    //     } else {
    //       ToasterService.showError('Error', res.data['message']);
    //     }

    //   }).catch(err => {
    //     console.log(err)
    //     ToasterService.showError('Error', 'Something went wrong, Try again later.');
    //   });
  };


  $scope.getFormattedTime = (time) => {
    console.log(moment(time));
    moment(time)
  };

  $scope.deleteConstraint =function(item){
   
    $ngConfirm({
          title: 'Confirm!',
          boxWidth: '20%',
          useBootstrap: false,
          content: "Are you sure?",
          scope: $scope,
          buttons: {
              cancel:{
                text: 'Cancel',
                btnClass: 'btn-danger'
                
              },
              OK: {
                text: 'Delete',
                btnClass: 'btn-blue',
                action: function (scope) {
                  var params = {id:item.id};
                  constraintService.delete_constraint(params, function(location) {
                    scope.fetchConstraintList(scope.selectedSiteId);
                  });
                }
              }
          }
        });

   
  }

  $scope.onSubmit = () => {
    let params = {}
    if(!$scope.selectedSiteId){
      ToasterService.showError('Error', 'Please select a site');
      return false;
    }
    if($scope.we_checkin && $scope.we_checkout && $scope.wd_checkin && $scope.wd_checkout){
      params['site_id'] = Number($scope.selectedSiteId);
      params['WE_cutoff_checkin'] = {
        value: $scope.we_checkin
      }
      params['WE_cutoff_checkout'] = {
        value: $scope.we_checkout
      }
      params['WD_cutoff_checkin'] = {
        value: $scope.wd_checkin
      }
      params['WD_cutoff_checkout'] = {
        value: $scope.wd_checkout,
        display_name: 'Cutoff time for weekday Checkout Shift'
      }
      console.log('params', params)
      ConstraintService.postConfigCutoff(params, (response) => {
        console.log(response)
        if(!response['success']){
          ToasterService.showError('Error', response['errors']['errorMessage'])
          $scope.we_checkin = ''
          $scope.we_checkout = ''
          $scope.wd_checkin = ''
          $scope.wd_checkout = ''
        } else {
          ToasterService.showSuccess('Success', 'Cut-off time submitted successfully!')
          $scope.we_checkin = ''
          $scope.we_checkout = ''
          $scope.wd_checkin = ''
          $scope.wd_checkout = ''
          $scope.configForm.$setUntouched()
          $scope.configForm.$setPristine()
        }
      }, (error) => {
        console.log(error)
      })
    }
  }
});