app.controller('contractListAddCtrl', function ($scope, $http, $state, SessionService, ToasterService, $timeout) {

    this.$onInit = function () {
        console.log('onit - contractListAddCtrl');
        $scope.totalSelectedUIDs = "Select UIDs";
        $scope.toggleView = false;

        ToasterService.clearToast();
        // $scope.showCheckboxes();

        $scope.fetchSiteList();
        $scope.fetchBAList();

        $scope.tab = 'CUSTOMER';
        console.log($scope.tab);
        
    };

    $scope.fileObject;
    $scope.ctype;
    $scope.bcycle;
    $scope.siteList;
    $scope.selectedSiteId;
    $scope.selectedUIDs = [];

    $scope.contract_type = [
        { name: 'PER KM',   value: 'Per km' },
        { name: 'PER HEAD', value: 'Per head', },
        { name: 'PER ZONE', value: 'Per zone', },
        { name: 'PER SLAB', value: 'Per slab', },
        { name: 'PER PACKAGE', value: 'Per package', },
        { name: 'PER TRIP',   value: 'Per trip' },
    ];

    $scope.uniqueId = [
        {
            id: 1,
            "name": "Trip Category",
            "value": "trip_category"
        },

        {
            id: 2,
            "name": "Vehicle Category",
            "value": "vehicle_category"
        },
        {
            id: 3,
            "name": "Vehicle Model",
            "value": "vehicle_model"
        },
        {
            id: 4,
            "name": "Age of Vehicle",
            "value": "age_of_vehicle"
        },
        {
            id: 5,
            "name": "Trip Time",
            "value": "trip_time"
        },
        {
            id:6,
            "name": "From to To Time",
            "value": "from_time_to_time"
        },
        {
            id:7,
            "name": "KM",
            "value": "trip_km"
        },
        {
            id:8,
            "name": "Trip Date",
            "value": "trip_date"
        },
        {
            id:9,
            "name": "AC/ Non AC",
            "value": "ac_nonac"
        },
        {
            id: 10,
            "name": "Shift",
            "value": "shift"
        },
        {
            id: 11,
            "name": "Zone",
            "value": "zone"
        },
        {
            id: 12,
            "name": "Trip Type",
            "value": "trip_type"
        },
        {
            id: 13,
            "name": "Garage KM",
            "value": "garage_km"
        },
        {
            id: 14,
            "name": "Swing KM",
            "value": "swing_km"
        },

        {
            id: 15,
            "name": "Trip Day",
            "value": "day_type"
        },
        {
            id: 16,
            "name": "Number of employees",
            "value": "employee_count"
        },
        {
            id: 17,
            "name": "Vehicle Capacity",
            "value": "vehicle_capacity"
        },
        {
            id: 18,
            "name": "Vehicle Average",
            "value": "vehicle_avg"
        },
        {
            id: 19,
            "name": "Guard",
            "value": "guard"
        },
    ]
    $scope.billingOption = [
        // {"name": "Per Trip", "value": "Per Trip"},
        { "name": "Daily", "value": "Daily" },
        { "name": "Weekly", "value": "Weekly" },
        { "name": "Fortnightly",  "value": "Fortnightly" },
        { "name": "Monthly",  "value": "Monthly" },
        // {  "name": "Quarterly", "value": "Quarterly"  }
    ]
    $scope.submitResponse;
    $scope.expanded = true;
    $scope.totalSelectedUIDs = "Select UIDs";
    $scope.selectedUIDtoSend;


    // $scope.closeExpanded = () => {
    //     console.log('exp')
    //     checkboxes.style.display = "none";
    //     $scope.expanded = false;
    // }
    // $scope.showCheckboxes = () => {
    //     var checkboxes = document.getElementById("checkboxes");
    //     if (!$scope.expanded) {
    //         checkboxes.style.display = "block";
    //         $scope.expanded = true;
    //     } else {
    //         checkboxes.style.display = "none";
    //         $scope.expanded = false;
    //     }
    // }
    // $scope.toggleSelection = function toggleSelection(UID) {
    //     var idx = $scope.selectedUIDs.indexOf(UID);

    //     // Is currently selected
    //     if (idx > -1) {
    //         $scope.selectedUIDs.splice(idx, 1);
    //     }

    //     // Is newly selected
    //     else {
    //         $scope.selectedUIDs.push(UID);
    //     }
    //     $scope.totalSelectedUIDs = $scope.selectedUIDs.length + ' UIDs selected';
    //     console.log($scope.selectedUIDs);
    // };
    $scope.fetchSiteList = () => {

        $http({
            method: 'POST',
            url: 'http://apiptsdemo.devmll.com:8001/api/v1/getAllSiteList',
            headers: {
                'Content-Type': 'application/json',
                'uid': SessionService.uid,
                'access_token': SessionService.access_token,
                'client': SessionService.client
            },
            data: { test: 'test' }
        })
            .then(function (res) {
                if (res.data['success']) {
                    $scope.siteList = res.data.data.list;
                    // $scope.$broadcast('onSiteListReceived',res.data.data.list);
                    console.log(JSON.stringify($scope.siteList))
                } else {
                    alert(res.data['message']);
                }

            }).catch(err => {
                // ToasterService.showError('Error', 'Something went wrong, Try again later.');
                console.log(err)
            });

    };


    $scope.fileNameChanged = function (e) {
        // console.log(e.files)
        $scope.fileObject = e.files[0];
        console.log('selected file', $scope.fileObject)
        $timeout(()=>{
            $scope.tempfileName = $scope.fileObject.name;
        },50)
    }

    $scope.getSelectedUDIDs = () => {
        if ($scope.selectedUIDs.length == 0) return "";
        let items = $scope.selectedUIDs.map(i => i.label);
        return items.join(" | ");
    }

    // $scope.downloadCSV = function () {
    //     var id = $scope.selectedSiteId
    //     var type = 'SITE'
    //     if ($scope.tab === 'BA') {
    //         id = $scope.baID
    //         type = 'BA'
    //     }
    //     console.log(type, id)        
    //     $http({
    //         method: 'GET',
    //         url: 'http://apiptsdemo.devmll.com:8003/api/v1/contract/download-samplefile/'+id+'/'+type,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'uid': SessionService.uid,
    //             'access_token': SessionService.access_token,
    //             'client': SessionService.client
    //         },

    //     })
    //         .then(function (response) {
    //             console.log(JSON.stringify(response))
    //         });
    //     console.log('download CSV');
    // }
    
    $scope.isValid = () => {
        if ($scope.selectedUIDs.length == 0) {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Select one or more UDID\'s');
            return false;
        } else if (!$scope.selectedSiteId && $scope.tab == 'CUSTOMER') {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Select Site');
            return false;
        } else if (!$scope.baID && $scope.tab == 'BA') {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Select BA');
            return false;
        } else if (!$scope.bcycle) {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Select Billing Cycle.');
            return false;
        } else if (!$scope.ctype) {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Select Contract Type.');
            return false;
        } else if (!$scope.fileObject) {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Upload contract in csv');
            return false;
        }
        return true;
    }

    $scope.createContract = function () {
        
        // var file=$scope.myFile;
        if (!$scope.isValid()) {
            return;
        }
        $scope.selectedUIDtoSend = $scope.selectedUIDs.map(({ label }) => label)
        console.log($scope.selectedUIDtoSend);

        var formData = new FormData();
        formData.append("customer_id", "1");
        
        formData.append("unique_identification", $scope.selectedUIDtoSend);
        formData.append("billing_cycle", $scope.bcycle);
        formData.append("contract_type", $scope.ctype);
        formData.append("contract_file", $scope.fileObject);
        formData.append("site_id", $scope.selectedSiteId);
        console.log(formData)
        var contractType = "contract";
        if ($scope.tab == 'BA') {
            formData.append("ba_id", $scope.baID);
            contractType = 'bacontract'
        } 
        var request = new XMLHttpRequest();
        var vm = $scope;
        request.open("POST", "http://apiptsdemo.devmll.com:8003/api/v1/" + contractType + "/upload");
        // request.open("POST", "https://a7c05928.ngrok.io/api/v1/" + contractType + "/upload");
        request.onload = function () {
            console.log(request.response);
            if (request.readyState === request.DONE) {
                if (request.status === 200) {
                    // console.log(request.response);
                    vm.submitResponse = JSON.parse(request.response);   
                    if (vm.submitResponse['success']) {
                        $scope.toggleView = true;
            ToasterService.clearToast();
                        ToasterService.showSuccess('Success', 'Contract created successfully.');
                        console.log('Contract created successfully.');
                        $scope.getContracts();
                    } else {
                        if (vm.submitResponse['message'] && vm.submitResponse.data['allowParameters']) {
                            let msg = vm.submitResponse['message'] + "\n\n";
                            let obj = vm.submitResponse.data.allowParameters
                            for (var key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    let keyTemp="";
                                    if(key=="billing_cycle"){
                                        keyTemp="<b>Billing Cycle</b>";
                                    }else if(key=="unique_identifier"){
                                        keyTemp="<b>Unique Identifier</b>";
                                    }else{
                                        keyTemp=key;
                                    }
                                    msg +=  keyTemp+' must be '+obj[key] + "\n";
                                }
                            }
                            $scope.toggleView = true;
            ToasterService.clearToast();
                            ToasterService.showError_html('Error', msg.replace(/(\r\n|\n|\r)/gm, "<br>"));   
                        } else {
                            $scope.toggleView = true;
            ToasterService.clearToast();
                            ToasterService.showError_html('Error', vm.submitResponse['message']);   
                        }
                    }                
                    
                }
            } else {
                $scope.toggleView = true;
            ToasterService.clearToast();
                ToasterService.showError('Error', 'Something went wrong, Try again later.');
            }
        };
        request.send(formData);
    }

    $scope.reset = function () {
        $state.reload(true);
    }



    $scope.setTab = function (tabId) {
        console.log('set tabbed');
        $scope.tab = tabId;
        $scope.getContracts();
    };

    $scope.isSet = function (tabId) {
        return $scope.tab === tabId;
    };


    $scope.contracts = [{
        cust_id: "23412355-2",
        site: "Adam Denisov",
        file_name: "File Name.csv",
    },
    {
        cust_id: "23412355-2",
        site: "Adam Denisov",
        file_name: "File Name.csv",
    },
    {
        cust_id: "23412355-2",
        site: "Adam Denisov",
        file_name: "File Name.csv",
    },
    {
        cust_id: "23412355-2",
        site: "Adam Denisov",
        file_name: "File Name.csv",
    },
    {
        cust_id: "23412355-2",
        site: "Adam Denisov",
        file_name: "File Name.csv",
    },
    {
        cust_id: "23412355-2",
        site: "Adam Denisov",
        file_name: "File Name.csv",
    },

    ]


    $scope.getContracts = () => {
        console.log($scope.selectedSiteId)
        var urlEnd = $scope.selectedSiteId;
        if ($scope.tab === 'BA') {
            urlEnd = $scope.baID;
            if (!urlEnd) {
                return
            }
        }
        let url = 'http://apiptsdemo.devmll.com/getContractListByCustId?custId=1&custType=' + $scope.tab + '&siteId=' + urlEnd;
        // let url = 'http://4607df07.ngrok.io/api/v1/getContractListByCustId?custId=1&custType=' + $scope.tab + '&siteId=' + urlEnd;
        console.log(url)
        $http({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'uid': SessionService.uid,
                'access_token': SessionService.access_token,
                'client': SessionService.client
            },
            data: { test: 'test' }
        }).then(function (res) {
            console.log('getcontracts', res);
            if (res.data['success']) {
                
                if ($scope.tab === 'BA') {
                    $scope.bacontractList = res.data.data;
                } else {
                    $scope.contractList = res.data.data;
                }
                // $scope.$broadcast('onSiteListReceived',res.data.data.list);
                
            } else {
                alert(res.data['message']);
            }

        }).catch(err => {
            console.log(err)
            ToasterService.showError('Error', 'Something went wrong, Try again later.');
        });
    }

    $scope.downloadSampleFile = () => {
        var id = $scope.selectedSiteId
        var type = 'SITE'
        if (!$scope.selectedSiteId && $scope.tab === 'CUSTOMER') {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Please select SITE name');
            return;
        } else if (!$scope.baID && $scope.tab === 'BA') {
            $scope.toggleView = true;
            ToasterService.clearToast();
            ToasterService.showError('Error', 'Please select BA name');
            id = $scope.baID
            type = 'BA'
            return;
        }

        if ($scope.ctype == null || $scope.ctype.length == 0) {
            ToasterService.showError('Error', 'Please select Contract Type *');
            return;
        }

        var id = $scope.selectedSiteId
        var type = 'SITE'
        if ($scope.tab === 'BA') {
            id = $scope.baID
            type = 'BA'
        }

        var a = document.createElement("a");
        let url = 'http://apiptsdemo.devmll.com:8003/api/v1/contract/download-samplefile/'+id+'/'+type+'/'+$scope.ctype
        a.href = url;
        a.download = 'contract_sample.xlsx';
        a.click();   
    }

    $scope.fetchBAList = () => {
        if (!$scope.baID && $scope.tab === 'BA') {
            return;
        }
        $http({
            method: 'POST',
            url: 'http://apiptsdemo.devmll.com/induction/getAllBaList',
            headers: {
                'Content-Type': 'application/json',
                'uid': SessionService.uid,
                'access_token': SessionService.access_token,
                'client': SessionService.client
            },
            data: { test: 'test' }
        })
            .then(function (res) {
                if (res.data['success']) {
                    $scope.baList = res.data.data.list;
                    // $scope.$broadcast('onSiteListReceived',res.data.data.list);
                    console.log(JSON.stringify($scope.baList))
                } else {
                    alert(res.data['message']);
                }

            }).catch(err => {
                $scope.toggleView = true;
            ToasterService.clearToast();
                ToasterService.showError('Error', 'Something went wrong, Try again later.');
                console.log(err)
            });

    };


    $scope.getSelectedBA = () => {
        var name = 'NA';
        angular.forEach($scope.baList,function(item,idx,shiftArray){
            if(item.id == $scope.baID){
              name = item.legal_name;
            }
        });
        return name;
    }

})