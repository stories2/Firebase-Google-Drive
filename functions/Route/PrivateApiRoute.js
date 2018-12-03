exports.fileUpload = function(request, response) {
    const fileManager = require('../Core/FileManager')
    const dbManager = require('../Core/DBManager')
    var responseManager = require('../Utils/ResponseManager')

    fileManager.preprocessUploader(request, response, 
        function (uploadList, fieldList) {
            global.log.debug("PrivateApiRoute", "fileUpload<preprocessUploader>", "file upload process finished: " + JSON.stringify(uploadList))

            dbManager.registerFile2DB(request, uploadList, fieldList, function () {
                responseManager.ok(response, uploadList)
            })
        })
}

exports.fileDownload = function (request, response) {
    const fileManager = require('../Core/FileManager')
    var responseManager = require('../Utils/ResponseManager')

    fileManager.getDownloadLink(request, function (signedDownloadLink) {
        responseManager.ok(response, {
            success: signedDownloadLink !== undefined && signedDownloadLink != null,
            data: {
                link: signedDownloadLink
            }
        })
    })
}

exports.fileInfo = function (request, response) {
    var responseManager = require('../Utils/ResponseManager')
    const dbManager = require('../Core/DBManager')

    dbManager.getFileInfo(request, function (fileSnapshotInfo) {
        responseManager.ok(response, {
            success: fileSnapshotInfo !== undefined && JSON.stringify(fileSnapshotInfo) != null,
            data: fileSnapshotInfo
        })
    })
}

exports.fileMove = function (request, response) {
    var responseManager = require('../Utils/ResponseManager')
    const dbManager = require('../Core/DBManager')

    dbManager.moveFile(request, function () {
        responseManager.ok(response, {
            success: true,
            data: undefined
        })
    })
}