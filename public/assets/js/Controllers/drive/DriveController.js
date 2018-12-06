app.controller("DriveController", function ($scope, $http, $mdToast, $mdSidenav, $window, FDModuleService) {

    $scope.currentPath = "/"
    FDModuleService.printLogMessage("DriveController", "DriveController", "init", LOG_LEVEL_INFO);

    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };

    $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
    };

    $scope.toggleRight = buildToggler('right');

    $scope.onLoad = function () {
        getDirectoryStructure($scope.currentPath)
    }

    function getDirectoryStructure(currentPath) {

        var payload = {
            path: currentPath
        }

        FDModuleService.getReq(
            API_GET_DIRECTORY_STRUCTURE,
            payload,
            function (data) {
                FDModuleService.printLogMessage("DriveController", "getDirectoryStructure", "current dir structure: " + JSON.stringify(data), LOG_LEVEL_DEBUG)
            },
            function (error) {
                FDModuleService.printLogMessage("DriveController", "getDirectoryStructure", "cannot get dir structure", LOG_LEVEL_ERROR)
            }
        )
    }

    function buildToggler(navID) {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    FDModuleService.printLogMessage("DriveController", "buildToggler", "toggle " + navID + " is done", LOG_LEVEL_DEBUG)
                });
        };
    }
});