exports.preprocessUploader = function (request, response, callbackFunc) {
    const admin = global.admin
    const os = require('os')
    const Busboy = require('busboy')
    const path = require('path')
    const fs = require('fs')
    const bucketManager = admin.storage().bucket()

    const busboy = new Busboy({headers: request.headers})
    const tmpdir = os.tmpdir()

    const fields = []
    const uploads = {}

    busboy.on('field', function (fieldname, val) {
        global.log.debug("FileManager", "preprocessUploader<file>", "processed field: " + fieldname + " / " + val)
        fields[fieldname] = val
    })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        global.log.debug("FileManager", "preprocessUploader<file>", "processed file name: " + filename + " field name: " + fieldname + " encoding: " + encoding + " mimetype: " + mimetype)

        const filePath = path.join(tmpdir, filename)
        uploads[fieldname] = filePath

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
                buffer: fileBuffer
            }
            global.log.debug("FileManager", "preprocessUploader<end>", "file object buffer length: " + fileObject.buffer.length)

            if(callbackFunc !== undefined) {
                callbackFunc(fileObject, bucketManager)
            }
            else {
                global.log.warn("FileManager", "preprocessUploader<end>", "callback func is undefined")
            }

            request.file = fileObject
        })

        file.pipe(fileStream)
    })

    busboy.on('finish', function () {
        for(const name in uploads) {
            const file = uploads[name]
            global.log.debug("FileManager", "preprocessUploader<finish>", "file " + file + " upload finished")
        }
    })

    busboy.end(request.rawBody)
    request.pipe(busboy)
}