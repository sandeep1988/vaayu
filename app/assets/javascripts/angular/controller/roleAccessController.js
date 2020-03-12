angular.module('app').controller('roleAccessCtrl', function ($scope, RosterService, RouteService, $timeout, ToasterService, $interval, $filter) {

    $scope.init = function () {
        $scope.getTableData();
    }
    $scope.toggleView = false;
    $scope.tableRow = [];
    $scope.moduleColumn = []
    $scope.roleModuleAccess = [];
    
    $scope.roleObj = {
        role_id : 2,
        module_id : 1,
        delete_status:0,
        edit_status:0,
        view_status:0
    }

    $scope.consolidatedObj = {
        roleAccess: []
    }

    $scope.consolidatedObjCopy = {
        roleAccess: []
    }
    

    $scope.getTableData = () => {
        RosterService.userRoles((res) => {
            $scope.tableRow = res['data']['roles']
            $scope.moduleColumn = res['data']['modules']
            $scope.roleModuleAccess = res['data']['roles_module_access']
            let firstEle = $scope.roleModuleAccess[0]['role_module_access'][0]
            delete firstEle.role_name;
            delete firstEle.status;
            firstEle['role_id'] = 0
            $scope.consolidatedObj['roleAccess'].push(firstEle)
            $scope.consolidatedObjCopy['roleAccess'] = [...$scope.consolidatedObj['roleAccess']]

        })
    }


    $scope.onCheckboxChange = (roleId, moduleId, status) => {
            var isPushValid = false;
            let newArray = ($scope.modifyObj(roleId, moduleId, status, $scope.roleObj))
            
            for(var i = 0; i < $scope.consolidatedObjCopy['roleAccess'].length; i++){
                if($scope.consolidatedObjCopy['roleAccess'][i]['role_id'] === roleId && $scope.consolidatedObjCopy['roleAccess'][i]['module_id'] === moduleId){
                    
                    $scope.consolidatedObjCopy['roleAccess'][i] = {...newArray}
                    isPushValid = false
                    break;
                }
            }

            var counter = 0
            for(var j = 0; j < $scope.consolidatedObjCopy['roleAccess'].length; j++){
                if($scope.consolidatedObjCopy['roleAccess'][j]['role_id'] != roleId || $scope.consolidatedObjCopy['roleAccess'][j]['module_id'] != moduleId){
                    counter += 1
                    isPushValid = false
                }
                if(counter === $scope.consolidatedObjCopy['roleAccess'].length){
                    isPushValid = true
                }
            }

            
            
            if(!!isPushValid){
                $scope.consolidatedObjCopy['roleAccess'].push(newArray)
            }

        
    }

    $scope.modifyObj = (roleId, moduleId, status, array) => {

        let tempEleId = roleId + '-' + moduleId + '-' + status;
        $scope.roleObj['role_id'] = roleId
        $scope.roleObj['module_id'] = moduleId
        var modifiedArray = {...array}
        if(document.getElementById(tempEleId).checked){
            if(status === 1){
                modifiedArray['view_status'] = 1
                var editStatus = roleId + '-' + moduleId + '-' + 2
                var deleteStatus = roleId + '-' + moduleId + '-' + 3
                modifiedArray['edit_status'] = +(document.getElementById(editStatus).checked)
                modifiedArray['delete_status'] = +(document.getElementById(deleteStatus).checked)

            } else if (status === 2){
                modifiedArray['edit_status'] = 1
                var viewStatus = roleId + '-' + moduleId + '-' + 1
                var deleteStatus = roleId + '-' + moduleId + '-' + 3
                modifiedArray['view_status'] = +(document.getElementById(viewStatus).checked)
                modifiedArray['delete_status'] = +(document.getElementById(deleteStatus).checked)


            } else if(status === 3){
                modifiedArray['delete_status'] = 1
                var viewStatus = roleId + '-' + moduleId + '-' + 1
                var editStatus = roleId + '-' + moduleId + '-' + 2
                modifiedArray['edit_status'] = +(document.getElementById(editStatus).checked)
                modifiedArray['view_status'] = +(document.getElementById(viewStatus).checked)
            }
        } else {
            if(status === 1){
                modifiedArray['view_status'] = 0
                var editStatus = roleId + '-' + moduleId + '-' + 2
                var deleteStatus = roleId + '-' + moduleId + '-' + 3
                modifiedArray['edit_status'] = +(document.getElementById(editStatus).checked)
                modifiedArray['delete_status'] = +(document.getElementById(deleteStatus).checked)

            } else if (status === 2){
                modifiedArray['edit_status'] = 0
                var viewStatus = roleId + '-' + moduleId + '-' + 1
                var deleteStatus = roleId + '-' + moduleId + '-' + 3
                modifiedArray['view_status'] = +(document.getElementById(viewStatus).checked)
                modifiedArray['delete_status'] = +(document.getElementById(deleteStatus).checked)


            } else if(status === 3){
                modifiedArray['delete_status'] = 0
                var viewStatus = roleId + '-' + moduleId + '-' + 1
                var editStatus = roleId + '-' + moduleId + '-' + 2
                modifiedArray['edit_status'] = +(document.getElementById(editStatus).checked)
                modifiedArray['view_status'] = +(document.getElementById(viewStatus).checked)
            }
        }

        return modifiedArray
    }

    $scope.onSave = (index) => {
        $scope.postData = {
            roleAccess: []
        }

        $scope.postData['roleAccess'] = $scope.consolidatedObjCopy['roleAccess'].filter((ele) => {
            return ele['role_id'] == index
        })
        console.log($scope.postData)

        RosterService.assignRoles($scope.postData, (res) => {
            $scope.toggleView = true;
            ToasterService.showSuccess('Success', res.message)
        }, (err) => {
            console.log('err', err)
        })
    }

})