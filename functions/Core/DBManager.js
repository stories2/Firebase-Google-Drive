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

        admin.database().ref(dbPath).set(fileObject)

        global.log.info("DBManager", "registerFile2DB", "db set ok")
    }

    if(callbackFunc !== undefined) {
        callbackFunc()
    }
    else {
        global.log.warn("DBManager", "registerFile2DB", "callback func undefined")
    }
}