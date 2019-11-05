'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('app').controller('addZone', function ($scope, $http, $state, SessionService, ToasterService) {
      this.$onInit = () => {
        console.log('onInit called addZone');
        $scope.fetchSiteList();
        
      }

      $scope.site_list = [];
      $scope.siteID = "";
      $scope.zoneName = null;
      $scope.latitude = null;
      $scope.longitude = null;
      $scope.zipcode = null;

      $scope.fetchSiteList = () => {
        $http({
            method: 'POST',
            url: 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8001/api/v1/getAllSiteList',
            headers: {
                'Content-Type': 'application/json',
                'uid': SessionService.uid,
                'access_token': SessionService.access_token,
                'client': SessionService.client
            },
            data: { test: 'test' }
        }).then(res => {
                if (res.data['success']) {
                    $scope.site_list = res.data.data.list;
                    console.log('addzone sites = '+JSON.stringify($scope.site_list))
                } else {
                    alert(res.data['message']);
                }
            }).catch(err => {
                console.log(err)
            });
      };

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
        console.log('fetchZones');
        $http({
          method: 'GET',
          url: 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8003/api/v1/zones/' + $scope.siteID,
        })
          .then( (res) => {
            
            if (res.data['success']) {
              $scope.zoneList = res.data.data.zoneList;
              console.log($scope.zoneList);
            } else {
              ToasterService.showError('Error', res.data['message']);
            }
          }).catch(err => {
            console.log(err)
            ToasterService.showError('Error', 'Something went wrong, Try again later.');
          });
      }

      $scope.submitZone =  (isValid) =>  {
        console.log($scope.site_list);
        console.log(SessionService.uid)
        $scope.submitted = true;
      
        if ($scope.siteID == null) {
          // alert('Select Site Name');
          ToasterService.showError('Error', 'Select Site Name');
        } else if (isValid) {
          $scope.addZone();
        }
       
      };


     

      $scope.addZone = () => {

        let data  = {
            site_id: parseInt($scope.siteID),
            name: $scope.zoneName,
            latitude: $scope.latitude+'',
            longitude: $scope.longitude+'',
            zipcode: $scope.zipcode+''

            // "name":"Dombivali",
            // "site_id":10,
            // "latitude":"19.2094",
            // "longitude":"73.0939",
            // "zipcode":"421202"
        }
        console.log('body'+JSON.stringify(data))
        $http({
          method: 'POST',
          url: 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/' + 'createZones',
          headers: {
            'content-type': 'application/json',
            'uid': SessionService.uid,
            'access_token': SessionService.access_token, //'8HP_3YQagGCUoWCXiCR_cg'
            'client': SessionService.client//'DDCqul04WXTRkxBHTH3udA',
          },
          data: data
        })

          .then( (res) => {
            console.log(JSON.stringify(res));
            if (res.data['success']) {
              ToasterService.showSuccess('Success', 'Zone added successfully.');
              console.log(JSON.stringify(res.data))
              $scope.fetchZones()
            } else {
              ToasterService.showError('Error', res.data['message']);
            }
          }).catch(err => {
            console.log(err)
            ToasterService.showError('Error', 'Something went wrong, Try again later.');
          });
      }

      $scope.deleteZone =  (zone) =>  {
        
        $http({
          method: 'GET',
          url: "http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/delete_zone/"+ zone.id,
          // url: "https://c22e1ea0.ngrok.io/api/v1/delete_zone/"+ zone.id,
          headers: {
            'Content-Type': 'application/json',
            'uid': SessionService.uid,
            'access_token': SessionService.access_token, //'8HP_3YQagGCUoWCXiCR_cg'
            'client': SessionService.client//'DDCqul04WXTRkxBHTH3udA',
          },
        }).then( (res) => {
            console.log(JSON.stringify(res));
            if (res.data['success']) {
              ToasterService.showSuccess('Success', res.data['message']);
              console.log('zone deleted', JSON.stringify(res.data))
              $scope.fetchZones()
            } else {
              ToasterService.showError('Error', res.data['message']);
            }
          }).catch(err => {
            console.log(err)
            ToasterService.showError('Error', 'Something went wrong, Try again later.');
          });
      }

  });
