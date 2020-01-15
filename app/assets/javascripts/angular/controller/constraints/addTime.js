'use strict';

// Register `phoneList` component, along with its associated controller and template
// angular.
//   module('app').
//   component('addTime', {
//     templateUrl: './views/add_time.html',
//     controller: function GuardController($http, $scope, SessionService, ToasterService) {
app.controller('addTime', function ($scope, $http, $state, SessionService, ConstraintService, ToasterService, $timeout) {



  this.$onInit = () => {
    console.log('onInit called addTime');
  }

  // $scope.time_data = $scope.parent.time_data;

  // $scope.$on("onDataReceived", (evt, list) => {
  //   this.siteNames = list;
  // });

  $scope.submitForm = function (isValid) {
    console.log($scope.$parent.siteID)
    console.log($scope.max_trip_time)

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

    let params = {
      siteId: parseInt($scope.$parent.siteID),
      type: 'time',
      clause: 'total_time',
      operator: 'less_than',
      value: parseInt($scope.$parent.max_trip_time)
    }
    ConstraintService.upsertConstraint(params, res => {
      console.log(JSON.stringify(res));
      if (res['success']) {
        ToasterService.showSuccess('Success', res['message']);
        $timeout(() => $scope.$parent.fetchConstraintList($scope.$parent.siteID), 200);
      } else {
        ToasterService.showError('Error', res['message']);
      }
    }, er => {
      ToasterService.showError('Error', 'Something went wrong, Try again later.');
    })
  }

});
