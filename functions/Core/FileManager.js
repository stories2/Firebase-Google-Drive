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
        global.log.debug("FileManager", "preprocessUploader", "processed field: " + fieldname + " / " + val)
        fields[fieldname] = val
    })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

    })

    busboy.on('finish', function () {

    })

    busboy.end(request.rawBody)
    request.pipe(busboy)
}