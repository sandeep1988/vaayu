angular.module('app').controller('roleAccessCtrl', function ($scope, RosterService, RouteService, $timeout, ToasterService, $interval, $filter) {

    $scope.init = function () {
        $scope.getTableData();
    }

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
               
        for(var i = 0; i < $scope.consolidatedObj['roleAccess'].length; i++){
            let newArray = ($scope.modifyObj(roleId, moduleId, status, $scope.roleObj))
            if($scope.consolidatedObj['roleAccess'][i]['role_id'] === roleId && $scope.consolidatedObj['roleAccess'][i]['module_id'] === moduleId){
                // $scope.consolidatedObj['roleAccess'].push(newArray)
                $scope.consolidatedObjCopy['roleAccess'].push(newArray)
            } else {
                console.log('in else')
                $scope.modifyObj(roleId, moduleId, status, $scope.roleObj)
                $scope.consolidatedObjCopy['roleAccess'].push(newArray)
            }
        }
        $scope.consolidatedObj['roleAccess'].push($scope.consolidatedObjCopy['roleAccess'])
        $scope.consolidatedObj['roleAccess'] = $scope.consolidatedObj['roleAccess'].flat()
        console.log('check obj',$scope.consolidatedObj['roleAccess']);
        
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

        console.log('modi',modifiedArray)
        return modifiedArray
    }

    $scope.onSave = (index) => {
        $scope.postData = {
            roleAccess: []
        }

        $scope.consolidatedObj['roleAccess'].forEach((ele) => {
            if(ele['role_id'] == index){
                $scope.postData['roleAccess'].push(ele)
            }    
        })
        console.log('check', $scope.postData['roleAccess'])
    }

    $scope.ObjPush = (index) => {
       console.log(index) 

    }

})