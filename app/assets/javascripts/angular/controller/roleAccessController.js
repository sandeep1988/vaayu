angular.module('app').controller('roleAccessCtrl', function ($scope, RosterService, RouteService, $timeout, ToasterService, $interval, $filter) {

    $scope.init = function () {
        $scope.getTableData();
    }

    $scope.tableRow = [];
    $scope.moduleColumn = []
    $scope.roleModuleAccess = [];

    $scope.getTableData = () => {
        RosterService.userRoles((res) => {
            console.log('res', res)
            $scope.tableRow = res['data']['roles']
            $scope.moduleColumn = res['data']['modules']
            $scope.roleModuleAccess = res['data']['roles_module_access']
        })
    }

})