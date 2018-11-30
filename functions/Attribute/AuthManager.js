exports.verifyAuthToken = function(request, response, next) {
    var responseManager = require('../Utils/ResponseManager')
    const adminManager = require('../Utils/FirebaseAdminManager')
    const admin = adminManager.getAdminSDK()

    try {
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.log.debug("AuthManager", "verifyAuthToken", "token verified uid: " + decodedToken.uid)
                request.user = decodedToken
                admin.auth().getUser(decodedToken.uid)
                    .then(function (userRecord) {
                        global.log.info("AuthManager", "verifyAuthToken", "we found user info")
                        userRecordData = userRecord.toJSON()
                        userRecordDataStr = JSON.stringify(userRecordData)
                        request.userRecordData = userRecordData
                        global.log.debug("AuthManager", "verifyAuthToken", "user info decoded : " + userRecordDataStr)
                        return next();
                    })
                    .catch(function (error) {
                        global.log.error("AuthManager", "verifyAuthToken", "cannot verify user: " + JSON.stringify(error))

                        responseManager.unauthorized(response, {})
                    })
            })
            .catch(function (error) {
                global.log.error("AuthManager", "verifyAuthToken", "cannot verify token: " + JSON.stringify(error))

                responseManager.unauthorized(response, {})
            })
    }
    catch (exception) {
        global.log.error("AuthManager", "verifyAuthToken", "server crashed: " + JSON.stringify(exception))

        responseManager.internalServerError(response, {})
    }
}