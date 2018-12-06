app.controller("DriveController", function ($scope, $http, $mdToast, $mdSidenav, $window, FDModuleService) {

    $scope.currentPath = "/"
    $scope.directoryStructure = {}
    $scope.floatingBtnIsOpen = false
    $scope.file = {}
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

    $scope.goBack = function () {
        $scope.currentPath = moveBackPath($scope.currentPath)
        getDirectoryStructure($scope.currentPath)
    }

    $scope.enterTo = function (folderName) {
        $scope.currentPath = enterTo($scope.currentPath, folderName)
        getDirectoryStructure($scope.currentPath)
    }
    
    $scope.showFileDetail = function (fileObject) {
        FDModuleService.printLogMessage("DriveController", "showFileDetail", "open file: " + JSON.stringify(fileObject), LOG_LEVEL_DEBUG)
        if($scope.isOpenRight() != true){
            $scope.toggleRight()
        }
        setFileObject(fileObject)
    }

    function setFileObject(fileObject) {
        $scope.file = fileObject
    }
    
    function enterTo(currentPath, folderName) {
        FDModuleService.printLogMessage("DriveController", "enterTo", "path: " + currentPath + " -> " + folderName, LOG_LEVEL_DEBUG)
        return currentPath + folderName + "/"
    }
    
    function moveBackPath(currentPath) {
        if(currentPath == "/") {
            return
        }
        var path = currentPath.split("/")
        path.pop()
        FDModuleService.printLogMessage("DriveController", "movePath", "path: " + JSON.stringify(path), LOG_LEVEL_DEBUG)

        path.pop()
        currentPath = path.join("/") + "/"
        return currentPath
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
                getFileInfo(data)
            },
            function (error) {
                FDModuleService.printLogMessage("DriveController", "getDirectoryStructure", "cannot get dir structure: " + JSON.stringify(error), LOG_LEVEL_ERROR)
            }
        )
    }
    
    function getFileInfo(data) {
        $scope.directoryStructure = data["data"]["data"]

        for(const key in $scope.directoryStructure) {
            FDModuleService.printLogMessage("DriveController", "getFileInfo", "key: " + key + " is file: " + ($scope.directoryStructure[key] == TYPE_FILE), LOG_LEVEL_DEBUG)

            if($scope.directoryStructure[key] == TYPE_FILE) {

                var payload = {}

                FDModuleService.getReq(
                    API_GET_FILE_INFO + key,
                    payload,
                    function (data) {
                        FDModuleService.printLogMessage("DriveController", "getFileInfo", key + " file info: " + JSON.stringify(data), LOG_LEVEL_DEBUG)
                        initFileInfo(key, data)
                    },
                    function (error) {
                        FDModuleService.printLogMessage("DriveController", "getFileInfo", "cannot get file info: " + JSON.stringify(error), LOG_LEVEL_ERROR)
                    }
                )
            }
        }
    }

    function initFileInfo(key, data) {
        $scope.directoryStructure[key] = data["data"]["data"]
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