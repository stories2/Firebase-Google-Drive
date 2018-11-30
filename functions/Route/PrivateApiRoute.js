exports.echo = function (request, response) {
    var responseManager = require('../Utils/ResponseManager')

    responseManager.ok(response, {})
}