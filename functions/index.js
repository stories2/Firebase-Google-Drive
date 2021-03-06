//For firebase
const functions = require('firebase-functions');
//Packages
const cors = require('cors')({origin: true})
const express = require('express')
const bodyParser = require('body-parser')
//Modules
const authAttribute = require('./Attribute/AuthManager')
const rawBodyAttribute = require('./Attribute/RawbodyManager')
const adminManager = require('./Utils/FirebaseAdminManager')
//Express
const privateApi = express()
//From Route
const testRoute = require('./Route/TestRoute')
const privateApiRoute = require('./Route/PrivateApiRoute')

//Global
global.define = require('./Settings/DefineManager')
global.log = require('./Utils/LogManager')
global.admin = adminManager.getAdminSDK()

exports.helloWorld = functions.https.onRequest(testRoute.helloWorld);

privateApi.use(cors)
privateApi.use(authAttribute.verifyAuthToken)
privateApi.use(rawBodyAttribute.getRawBodyManager)
privateApi.get('/file/:uuid', privateApiRoute.fileInfo)
privateApi.get('/file/share/:uuid', privateApiRoute.fileDownload)
privateApi.post('/file/move/:uuid', privateApiRoute.fileMove)
privateApi.post('/file', [bodyParser.json(), bodyParser.urlencoded({
    extended: true,
})], privateApiRoute.fileUpload)
privateApi.get('/dir', privateApiRoute.scanDirectory)
exports.privateApi = functions.https.onRequest(privateApi);