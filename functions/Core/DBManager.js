exports.registerFile2DB = function (request, uploadList, fieldList, callbackFunc) {
    var util = require('util')
    const admin = global.admin
    var userRecordData = request.userRecordData
    var uploadPlacePath = fieldList[global.define.FIELD_NAME_PATH]

    for(fieldName in uploadList) {
        var fileObject = uploadList[fieldName]
        fileObject["isDisabled"] = false

        var dbPath = util.format(global.define.DB_PATH_RESOURCES_UID_FILE_UUID, userRecordData.uid, uploadPlacePath, fileObject.uuid)
        global.log.debug("DBManager", "registerFile2DB", "db path: " + dbPath)
        var resourceListDbPath = util.format(global.define.DB_PATH_RESOURCES_LIST_UID_UUID, userRecordData.uid, fileObject.uuid)
        global.log.debug("DBManager", "registerFile2DB", "resource list db path: " + resourceListDbPath)

        admin.database().ref(dbPath).set(fileObject)
        admin.database().ref(resourceListDbPath).set(fileObject)

        global.log.info("DBManager", "registerFile2DB", "db set ok")
    }

    if(callbackFunc !== undefined) {
        callbackFunc()
    }
    else {
        global.log.warn("DBManager", "registerFile2DB", "callback func undefined")
    }
}

exports.getFileInfo = function (request, callbackFunc) {
    var admin = global.admin
    var util = require('util')

    var fileUUID = request.params["uuid"]
    var userRecordData = request.userRecordData

    var dbPath = util.format(global.define.DB_PATH_RESOURCES_LIST_UID_UUID, userRecordData.uid, fileUUID)

    global.log.debug("DBManager", "getFileInfo", "search db path: " + dbPath)

    admin.database().ref(dbPath).once("value", function (snapshot) {
        global.log.debug("DBManager", "getFileInfo", "file detail info: " + JSON.stringify(snapshot))

        if(callbackFunc !== undefined) {
            callbackFunc(snapshot)
        }
        else {
            global.log.warn("DBManager", "getFileInfo", "callback func is undefined")
        }
    })
}

exports.moveFile = function (request, callbackFunc) {
    var admin = global.admin
    var util = require('util')

    var fileUUID = request.params["uuid"]
    var userRecordData = request.userRecordData
    var requestData = request.body

    var dbPathSrc = util.format(global.define.DB_PATH_RESOURCES_UID_FILE_UUID, userRecordData.uid, requestData["src"], fileUUID)
    var dbPathDest = util.format(global.define.DB_PATH_RESOURCES_UID_FILE_UUID, userRecordData.uid, requestData["dest"], fileUUID)

    global.log.debug("DBManager", "moveFile", "move file from: " + dbPathSrc + " to: " + dbPathDest)

    admin.database().ref(dbPathSrc).once("value", function (fileObjectSnapshot) {
        global.log.debug("DBManager", "moveFile", "file detail info: " + JSON.stringify(fileObjectSnapshot))

        admin.database().ref(dbPathDest + "/").set(JSON.parse(JSON.stringify(fileObjectSnapshot)))
        admin.database().ref(dbPathSrc).set(null)

        if(callbackFunc !== undefined) {
            callbackFunc()
        }
        else {
            global.log.warn("DBManager", "moveFile", "callback func is undefined")
        }
    })
}