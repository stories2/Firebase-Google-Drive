app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, FDModuleService) {

    $scope.title = "Firebase Drive";

    FDModuleService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);
});