app.controller("DriveController", function ($scope, $http, $mdToast, $mdSidenav, $window, FDModuleService) {

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