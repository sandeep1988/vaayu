'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('app').controller('addZone', function ($scope, $http, $state, ConstraintService, SessionService, ToasterService) {
    this.$onInit = () => {
      console.log('onInit called addZone');
      $scope.toggleView = false;
      $scope.fetchSiteList();

    }


    $scope.site_list = [];
    $scope.siteID = "";
    $scope.zoneName = null;
    $scope.latitude = null;
    $scope.longitude = null;
    $scope.zipcode = null;

    $scope.fetchSiteList = () => {

      ConstraintService.getSiteList(res => {
        if (res['success']) {
          $scope.site_list = res.data.list;
          $scope.$broadcast('onSiteListReceived', res.data.list);
          
        } else {
          $scope.toggleView = true;
          ToasterService.showError('Error', res['message']);
        }
      }, er => {
        console.log(err)
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
      });
    }


    // $scope.$on("onSiteListReceived", (evt, list) => {
    //   this.siteNames = list;
    // });

    $scope.hasError = function (field, validation) {
      if (validation) {
        return ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.submitted && $scope.form[field].$error[validation]);
      }
      return ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.submitted && $scope.form[field].$invalid);
    };


    $scope.fetchZones = () => {
      ConstraintService.getZones({ siteId: $scope.siteID }, res => {
        if (res['success']) {
          $scope.zoneList = res.data.zoneList;
          
        } else {
          $scope.toggleView = true;
          ToasterService.showError('Error', res['message']);
        }
      }, er => {
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
      });
    }

    $scope.submitZone = (form) => {
      console.log($scope.site_list);
      console.log(SessionService.uid)
      $scope.submitted = true;

      if ($scope.siteID == null) {
        // alert('Select Site Name');
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Select Site Name');
      } else if (form.$valid && $scope.isValidZipcodes()) {
        $scope.addZone();
      }

    };


    $scope.isValidZipcodes = () => {
      let array = $scope.zipcode.split(',');
      for (let item of array) {
        if (item.trim().length != 6) {
          $scope.toggleView = true;
          ToasterService.showError('Error', 'Invalid zipcode, must contain exact 6 digits.');
          return false;
        }
      }
      return true;
    }

    $scope.addZone = () => {

      let params = {
        site_id: parseInt($scope.siteID),
        name: $scope.zoneName,
        latitude: $scope.latitude + '',
        longitude: $scope.longitude + '',
        zipcode: $scope.zipcode + ''

        // "name":"Dombivali",
        // "site_id":10,
        // "latitude":"19.2094",
        // "longitude":"73.0939",
        // "zipcode":"421202"
      }
      console.log('body' + params)

      ConstraintService.createZones(params, res => {
        if (res['success']) {
          $scope.toggleView = true;
          ToasterService.showSuccess('Success', 'Zone added successfully.');
          console.log(JSON.stringify(res.data))
          $scope.fetchZones()
        } else {
          $scope.toggleView = true;
          ToasterService.showError('Error', res['message']);
        }
      }, er => {
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
      });
    }

    $scope.deleteZone = (zone) => {

      ConstraintService.delete_zone({ zoneId: zone.id }, res => {
        if (res['success']) {
          $scope.toggleView = true;
          ToasterService.showSuccess('Success', res['message']);
          console.log('zone deleted', JSON.stringify(res.data))
          $scope.fetchZones()
        } else {
          $scope.toggleView = true;
          ToasterService.showError('Error', res['message']);
        }
      }, er => {
        $scope.toggleView = true;
        ToasterService.showError('Error', 'Something went wrong, Try again later.');
      });
    
    }

    $scope.getSelectedSite = (siteID) => {
      var name = 'NA';
      for (const item of $scope.site_list) {
        if (item.id == siteID) {
          name = item.name;
          break;
        }
      }
      // angular.forEach($scope.site_list,function(item,idx,shiftArray){

      // });
      return name;
    }

    // $scope.zoneOnKeyPress = (value) => {
    //   var array = value.split(",");
    //   console.log(array)
    //   // if (value.length == ((6 * array.length)+)) return false; 
    //   // if (/^([0-9]){0,6}(,){1}+$/.test(panValue1)) {

    //   // }
    // }

    // // Restricts input for the given textbox to the given inputFilter.
    // $scope.setInputFilter = (textbox, inputFilterRegex) => {
    //   ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    //     textbox.oldValue = "";
    //     textbox.addEventListener(event, function () {
    //       if ($scope.inputFilter(this.value, inputFilterRegex)) {
    //         this.oldValue = this.value;
    //         this.oldSelectionStart = this.selectionStart;
    //         this.oldSelectionEnd = this.selectionEnd;
    //       } else if (this.hasOwnProperty("oldValue")) {
    //         this.value = this.oldValue;
    //         this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
    //       }
    //     });
    //   });
    // }

    // // Restrict input to digits and '.' by using a regular expression filter.
    // $scope.inputFilter = (value, regex) => {
    //   return /^\d*\.?\d*$/.test(value);
    // };

  });
