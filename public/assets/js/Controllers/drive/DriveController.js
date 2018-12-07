app.controller("DriveController", function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, FDModuleService) {

    $scope.currentPath = "/"
    $scope.directoryStructure = {}
    $scope.floatingBtnIsOpen = false
    $scope.file = {}
    $scope.linkList = []
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

    $scope.downloadFile = function (fileObject) {
        FDModuleService.printLogMessage("DriveController", "downloadFile", "download file: " + JSON.stringify(fileObject), LOG_LEVEL_DEBUG)
        getDownloadLink(fileObject.uuid)
    }

    $scope.editPath = function () {
        var currnetPath = $scope.currentPath
        var confirm = $mdDialog.prompt()
            .title('경로 이동')
            .textContent('이동할 경로를 입력하세요')
            .placeholder('/')
            // .ariaLabel('Dog name')
            .initialValue($scope.currentPath)
            // .targetEvent(ev)
            .required(true)
            .ok('Go!')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function(result) {
            $scope.currentPath = result;
            getDirectoryStructure($scope.currentPath)
        }, function() {
            $scope.currentPath = currnetPath;
            getDirectoryStructure($scope.currentPath)
        });
    }

    function getDownloadLink(fileUUID) {

        var payload = {

        }

        FDModuleService.getReq(
            API_GET_FILE_DOWNLOAD_LINK + fileUUID,
            payload,
            function (data) {
                FDModuleService.printLogMessage("DriveController", "getDownloadLink", "link: " + JSON.stringify(data), LOG_LEVEL_DEBUG)
                initDownloadLinkList(data)
            },
            function (error) {
                FDModuleService.printLogMessage("DriveController", "getDownloadLink", "cannot get link: " + JSON.stringify(error), LOG_LEVEL_ERROR)
            }
        )
    }

    function initDownloadLinkList(data) {
        $scope.linkList = data["data"]["data"]["link"]
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