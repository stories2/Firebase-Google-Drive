exports.getRawBodyManager = function (request, response, next) {
    var responseManager = require('../Utils/ResponseManager')

    try {
        if (
            request.rawBody === undefined &&
            request.method === 'POST' &&
            request.headers['content-type'].startsWith('multipart/form-data')
        ) {
            getRawBody(
                request,
                {
                    length: request.headers['content-length'],
                    limit: global.define.UPLOAD_FILE_SIZE_LIMIT_5MB,
                    encoding: contentType.parse(request).parameters.charset,
                },
                function(err, string) {
                    if (err) {
                        responseManager.internalServerError(response, {})
                        return
                    }
                    global.log.info("RawbodyManager", "getRawBodyManager", "raw body converted")
                    request.rawBody = string
                    next()
                }
            )
        } else {
            global.log.info("RawbodyManager", "getRawBodyManager", "just pass raw body")
            next()
        }
    }
    catch (except) {
        responseManager.internalServerError(response, {})
    }
}