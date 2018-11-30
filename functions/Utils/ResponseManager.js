exports.ok = function(response, msg) {
    this.response(response, global.define.HTTP_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_OK, msg)
}

exports.badRequest = function(response, msg) {
    this.response(response, global.define.HTTP_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_BAD_REQUEST, msg)
}

exports.unauthorized = function(response, msg) {
    this.response(response, global.define.HTTP_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_UNAUTHORIZED, msg)
}

exports.internalServerError = function(response, msg) {
    this.response(response, global.define.HTTP_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, msg)
}

exports.response = function(response, type, code, msg) {
    response.setHeader('Content-Type', type)
    response.status(code).send(JSON.stringify(msg))
}