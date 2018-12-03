exports.fileUpload = function(request, response) {
    const fileManager = require('../Core/FileManager')
    var responseManager = require('../Utils/ResponseManager')

    fileManager.preprocessUploader(request, response, 
        function (uploadList) {
            global.log.debug("PrivateApiRoute", "fileUpload<preprocessUploader>", "file upload process finished: " + JSON.stringify(uploadList))

            responseManager.ok(response, uploadList)
        })
}

exports.fileDownload = function (request, response) {
    var responseManager = require('../Utils/ResponseManager')

    responseManager.ok(response, {})
}