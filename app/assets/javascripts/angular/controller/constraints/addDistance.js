'use strict';

// Register `phoneList` component, along with its associated controller and template
// angular.
//   module('app').
//   component('addDistance', {
//     templateUrl: './views/add_distance.html',
//     controller: function GuardController($http, $scope, SessionService, ToasterService) {

app.controller('addDistance', function ($scope, $http, $state, SessionService, ToasterService, $timeout) {

  this.$onInit = () => {
    console.log('onInit called addDistance');
  }

  

  // $scope.$on("onSiteListReceived", (evt, list) => {
  //   this.siteNames = list;
  // });

  $scope.submitForm = function (isValid) {
    console.log($scope.$parent.siteID)
    console.log($scope.distance)

    $scope.submitted = true;
    if ($scope.$parent.siteID == null) {
      ToasterService.showError('Error', 'Select Site Name');
      return true;
    }
    if (isValid) {
      $scope.addTime();
    }

  };

  $scope.hasError = function (field, validation) {
    // console.log($scope.form)
    if (validation) {
      return ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.submitted && $scope.form[field].$error[validation]);
    }
    return ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.submitted && $scope.form[field].$invalid);
  };

  $scope.addTime = () => {
    $http({
      method: 'POST',
      url: 'http://operatorptsdemo.devmll.com/' + 'constraint/insert',
      // url: 'http://localhost:8002/api/v1/' + 'constraint/insert',
      headers: {
        'Content-Type': 'application/json',
        'uid': SessionService.uid,
        'access_token': SessionService.access_token, //'8HP_3YQagGCUoWCXiCR_cg'
        'client': SessionService.client//'DDCqul04WXTRkxBHTH3udA',
      },
      data: {
        siteId: parseInt($scope.$parent.siteID),
        type: 'distance',
        clause: 'total_distance',
        operator: 'less_than',
        value: parseInt($scope.$parent.distance)
      }
    })
      .then(function (res) {
        console.log(JSON.stringify(res));
        if (res.data['success']) {
          ToasterService.showSuccess('Success', res.data['message']);
          $timeout(() => $scope.$parent.fetchConstraintList($scope.$parent.siteID), 200);
        } else {
          ToasterService.showError('Error', res.data['message']);
        }
      }).catch(err => {
        console.log(err);
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
      });
  }
});
