angular.module('app').controller('roleAccessCtrl', function ($scope, RosterService, RouteService, $timeout, ToasterService, $interval, $filter) {

    $scope.init = function () {
        $scope.getTableData();
    }


    $scope.tableRow = [];
    $scope.moduleColumn = []
    $scope.roleModuleAccess = [];

    $scope.postData = {
        "roleAccess": []
    }

    $scope.roleObj = {
        role_id : 2,
        module_id : 1,
        delete_status:0,
        edit_status:1,
        view_status:1
    }
    
    
    
    
    

    $scope.getTableData = () => {
        RosterService.userRoles((res) => {
            console.log('res', res)
            $scope.tableRow = res['data']['roles']
            $scope.moduleColumn = res['data']['modules']
            $scope.roleModuleAccess = res['data']['roles_module_access']
        })
    }

    $scope.onCheckboxChange = (index, userRole, moduleName, status) => {
        console.log(index, userRole, moduleName, status)
        // get the role_id and module_id, toggle values of the element from id
    }

    $scope.onSave = (index) => {
        console.log(index)
    }

    $scope.ObjPush = (index) => {
       console.log(index) 
    }

})