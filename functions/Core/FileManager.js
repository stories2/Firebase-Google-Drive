exports.preprocessUploader = function (request, response, callbackFunc) {
    const admin = global.admin
    const os = require('os')
    const Busboy = require('busboy')
    const path = require('path')
    const fs = require('fs')
    const bucketManager = admin.storage().bucket()
    const uniqueManager = require('../Utils/UniqueManager')

    const busboy = new Busboy({headers: request.headers})
    const tmpdir = os.tmpdir()

    const fields = []
    const uploads = {}
    var saveFile2GoogleStorageFunc = this.saveFile2GoogleStorage
    var userRecordData = request.userRecordData

    busboy.on('field', function (fieldname, val) {
        global.log.debug("FileManager", "preprocessUploader<file>", "processed field: " + fieldname + " / " + val)
        fields[fieldname] = val
    })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        global.log.debug("FileManager", "preprocessUploader<file>", "processed file name: " + filename + " field name: " + fieldname + " encoding: " + encoding + " mimetype: " + mimetype)

        const filePath = path.join(tmpdir, filename)
        // uploads[fieldname] = filePath

        var fileStream = fs.createWriteStream(filePath)
        var fileBuffer = new Buffer('')

        file.on('data', function (data) {
            fileBuffer = Buffer.concat([fileBuffer, data])
        })

        file.on('end', function () {
            const fileObject = {
                fieldname,
                originalname: filename,
                encoding,
                mimetype,
                buffer: fileBuffer,
                uuid: uniqueManager.generateUUID()
            }
            global.log.debug("FileManager", "preprocessUploader<end>", "file object buffer length: " + fileObject.buffer.length + " uuid: " + fileObject.uuid)

            var currentDate = new Date()

            uploads[fieldname] = {
                fieldname: fieldname,
                originalname: filename,
                encoding: encoding,
                mimetype: mimetype,
                uuid: fileObject.uuid,
                length: fileObject.buffer.length,
                uploaderUid: userRecordData.uid,
                uploaderDisplayName: userRecordData.displayName,
                uploadSec: currentDate.getTime() / 1000,
                uploadDateTimeStr: currentDate.toISOString()
            }

            saveFile2GoogleStorageFunc(fileObject, bucketManager, request.userRecordData)
                .then(function (signedDownloadUrl) {
                    global.log.debug("FileManager", "preprocessUploader<end>", "file saved and url generated: " + signedDownloadUrl)
                })
                .catch(function (error) {
                    global.log.error("FileManager", "preprocessUploader<end>", "cannot save to google storage")
                })
            request.file = fileObject
        })

        file.pipe(fileStream)
    })

    busboy.on('finish', function () {
        for(const name in uploads) {
            const file = uploads[name]
            global.log.debug("FileManager", "preprocessUploader<finish>", "file " + file + " upload finished")
        }

        if(callbackFunc !== undefined) {
            callbackFunc(uploads)
        }
        else {
            global.log.warn("FileManager", "preprocessUploader<finish>", "callback func is undefined")
        }
    })

    busboy.end(request.rawBody)
    request.pipe(busboy)
}

exports.saveFile2GoogleStorage = function (fileObject, bucketManager, userRecordData) {
    var util = require('util')
    var convertManager = require('../Utils/ConvertManager')

    var processPromise = new Promise(function (resolve, reject) {
        if(fileObject == null) {
            global.log.warn("FileManager", "saveFile2GoogleStorage", "file object is null, reject this")
            reject(global.define.PROMISE_FILE_UPLOAD_REJECT_EMPTY_FILE)
        }

        global.log.debug("FileManager", "saveFile2GoogleStorage", "file will save as: " + fileObject.uuid)

        var fileSavePath = util.format(global.define.FORMAT_FILE_SAVE_PATH, userRecordData.uid, fileObject.uuid)
        global.log.debug("FileManager", "saveFile2GoogleStorage", "file save path: " + fileSavePath + " mimetype: " + fileObject.mimetype)

        var fileUploader = bucketManager.file(fileSavePath)
        var blobStream = fileUploader.createWriteStream({
            metadata: {
                contentType: fileObject.mimetype
            }
        })

        blobStream.on('error', function (error) {
            global.log.error("FileManager", "saveFile2GoogleStorage", "cannot save file: " + JSON.stringify(error))
            reject(global.define.PROMISE_FILE_UPLOAD_REJECT_SAVE_FILE_ERROR)
        })

        blobStream.on('finish', function () {
            global.log.info("FileManager", "saveFile2GoogleStorage", "file saved")

            var tomorrowDate = new Date()
            tomorrowDate.setDate(tomorrowDate.getDate() + 1)
            var tomorrowDateTimeStr = convertManager.date2FormattedDateTimeStr(tomorrowDate, global.define.FORMAT_DATE_TIME_YYYY_MM_DD)
            global.log.debug("FileManager", "saveFile2GoogleStorage", "formatted datetime: " + tomorrowDateTimeStr)

            fileUploader.getSignedUrl({
                action: 'read',
                expires: tomorrowDateTimeStr
            })
                .then(function (signedDownloadUrl) {
                    global.log.debug("FileManager", "saveFile2GoogleStorage", "download link: " + signedDownloadUrl + " until: " + tomorrowDateTimeStr)

                    resolve(signedDownloadUrl)
                })
                .catch(function (error) {
                    global.log.error("FileManager", "saveFile2GoogleStorage", "cannot generate download link: " + JSON.stringify(error))

                    reject(global.define.PROMISE_FILE_UPLOAD_REJECT_DOWNLOAD_URL_ERROR)
                })
        })

        blobStream.end(fileObject.buffer)
    })

    return processPromise
}

exports.getDownloadLink = function (request, callbackFunc) {
    const admin = global.admin
    const bucketManager = admin.storage().bucket()
    var convertManager = require('../Utils/ConvertManager')
    var util = require('util')

    var fileUUID = request.params["uuid"]
    var userRecordData = request.userRecordData

    if(fileUUID === undefined) {
        if(callbackFunc !== undefined) {
            global.log.warn("FileManager", "getDownloadLink", "request file uuid is null")
            callbackFunc(undefined)
            return
        }
        else {
            global.log.warn("FileManager", "getDownloadLink", "callback func is undefined")
        }
    }

    var fileSavePath = util.format(global.define.FORMAT_FILE_SAVE_PATH, userRecordData.uid, fileUUID)
    var fileManager = bucketManager.file(fileSavePath)
    var deadLineDate = new Date()
    deadLineDate.setDate(deadLineDate.getDate() + 1)
    var deadLineDateTimeStr = convertManager.date2FormattedDateTimeStr(deadLineDate, global.define.FORMAT_DATE_TIME_YYYY_MM_DD)
    global.log.debug("FileManager", "getDownloadLink", "file " + fileUUID + " granted download deadline datetime: " + deadLineDateTimeStr)

    fileManager.getSignedUrl({
        action: 'read',
        expires: deadLineDateTimeStr
    })
        .then(function (signedDownloadUrl) {
            global.log.debug("FileManager", "getDownloadLink", "download link: " + signedDownloadUrl + " until: " + deadLineDateTimeStr)
            if(callbackFunc !== undefined) {
                callbackFunc(signedDownloadUrl)
            }
            else {
                global.log.warn("FileManager", "getDownloadLink", "callback func is undefined")
            }
        })
        .catch(function (error) {
            global.log.error("FileManager", "getDownloadLink", "cannot generate download link: " + JSON.stringify(error))
            if(callbackFunc !== undefined) {
                callbackFunc(undefined)
            }
            else {
                global.log.warn("FileManager", "getDownloadLink", "callback func is undefined")
            }
        })

}