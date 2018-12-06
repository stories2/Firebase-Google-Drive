app.controller("DefaultPageController", function ($scope, $http, $mdToast, $mdSidenav, $window, FDModuleService) {

    FDModuleService.printLogMessage("DefaultPageController", "DefaultPageController", "init", LOG_LEVEL_INFO);

    $scope.listenAuthStateChanged = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                FDModuleService.printLogMessage("DefaultPageController", "listenAuthStateChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)

                $scope.$apply(function () {
                })
                // ...
            } else {
                // User is signed out.
                // ...
                FDModuleService.printLogMessage("DefaultPageController", "listenAuthStateChanged", "user not signed in", LOG_LEVEL_WARN)

                $scope.$apply(function () {
                })
            }
        });
    }
});