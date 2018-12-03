exports.fileUpload = function(request, response) {
    const fileManager = require('../Core/FileManager')
    var responseManager = require('../Utils/ResponseManager')

    fileManager.preprocessUploader(request, response, 
        function (fileObject, bucketManager) {
            fileManager.saveFile2GoogleStorage(fileObject, bucketManager, request.userRecordData)
        })

    responseManager.ok(response, {})
}

exports.fileDownload = function (request, response) {
    var responseManager = require('../Utils/ResponseManager')

    responseManager.ok(response, {})
}