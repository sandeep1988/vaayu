


angular.module('app').controller('reportCtrl', function ($scope,RosterService, RouteService, RouteUpdateService,$http,  
    AutoAllocationService,BASE_URL_API_8005,
    FinalizeService, RouteStaticResponse, ToasterService, SessionService, BASE_URL_API_8002, TripboardService) {
        // $scope.baseUrl3 = BASE_URL_API_8005;

        $scope.toggleView = false; 
        $scope.fromDate;
        $scope.toDate;
        $scope.siteId;
        $scope.report;
        $scope.reportId;

        $scope.reportType = [
            {
                displayValue: 'Trip Log Report',
                sendValue: 'tripReport'
            },
            {
                displayValue: 'Employee Log Reports',
                sendValue: 'employeeLogReport'
            },
            {
                displayValue: 'OTA Report',
                sendValue: 'OTAReport'
            },
            {
                displayValue: 'OTD Report',
                sendValue: 'OTDReport'
            },
            {
                displayValue: 'Daily Shift Wise Occupency Report',
                sendValue: 'dailyShiftWiseOccupency'
            }
        ];
        $scope.reportValue = $scope.reportType[0].sendValue;
        $scope.isChanged = false;
        
        $scope.init = function () {
            
            $scope.reportId = $scope.reportType[0].sendValue;
            $scope.today();
            // date picker
            $scope.toggleMin();
            // $scope.reportValue = $scope.reportType[0].displayValue;
            console.log('report Value', $scope.reportValue)
            

            
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            
            
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.toDateFormat = $scope.formats[0];
            $scope.fromDateFormat = $scope.formats[0];

            
            RosterService.getAllSiteList(function (data) {
                $scope.siteList = data.data.list;
                if ($scope.siteList.length) {
                    $scope.siteId = $scope.siteList[0].id;
                }
                
                let postData = {
                    "from_date": moment($scope.fromDate).format('YYYY-MM-DD'),
                    "to_date": moment($scope.toDate).format('YYYY-MM-DD')
                }
            })
        }
        
            

        $scope.getSiteId = (id) => {
            $scope.siteId = id;
        }


        $scope.updateFilters = function (date, value) {
            if(date === 'from'){
                console.log('from',moment(value).format('YYYY-MM-DD'))
                $scope.fromDate = moment(value).format('YYYY-MM-DD')
            } else if(date === 'to'){
                console.log('to',moment(value).format('YYYY-MM-DD'))
                $scope.toDate = moment(value).format('YYYY-MM-DD')
            }
        }
        $scope.updateName = function(){
            console.log('logged')
        }
        
        
        $scope.today = function () {
            $scope.filterDate = new Date();
            $scope.toDate = new Date();
            $scope.toDate = moment($scope.toDate).format('YYYY-MM-DD');
            $scope.fromDate = new Date();
            $scope.fromDate = moment($scope.fromDate).format('YYYY-MM-DD');

        };

        $scope.clear = function () {
            $scope.filterDate = null;
            $scope.toDate = null;
            $scope.fromDate = null;

          };
        
          // Disable weekend selection
        $scope.disabled = function (date, mode) {
            // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            return false;
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.fromDateOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        
            $scope.fromDateOpened = true;
        };

        $scope.toDateOpen = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        
            $scope.toDateOpened = true;
        };

        $scope.downloadSample = function (url) {
            // var url = this.baseUrl + 'employeeupload/downloadEmployeeExcel/' + $scope.selectedSite.id;
            $scope.isLoader =true;
          
            var link = document.createElement('a');
            link.href = url;
            link.target = "_self";
            
        
            $http({
              method: 'GET',
              url: url,
              headers: {
                'Content-type': 'application/json'
             },
             responseType: 'arraybuffer'
            }).then(function successCallback(res) {
                $scope.isLoader =false;
              }, function errorCallback(err) {
                $scope.isLoader =false;
                console.log('error: ', err)
              });
              if($scope.isChanged){
                  link.click();
              }
        }

        $scope.downloadReport = function(){
            var url = 'http://api.mllvaayu.com:8005/api/v1/' + $scope.reportId +'/ksjdfhsi5735936/' + $scope.siteId + '/' + $scope.fromDate + '/' + $scope.toDate;
            if($scope.reportId && $scope.siteId && $scope.fromDate && $scope.toDate ){
                $scope.isChanged = true;
                $scope.downloadSample(url);
            }
        }

        $scope.getReportId = (id) => {
            console.log(id)
            $scope.reportId = id;
        }

    })
    
    