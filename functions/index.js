//Global
global.define = require('./Settings/DefineManager')
global.log = require('./Utils/LogManager')
//For firebase
const functions = require('firebase-functions');
//Packages
const cors = require('cors')({origin: true})
const express = require('express')
//Modules
const authAttribute = require('./Attribute/AuthManager')
const rawBodyAttribute = require('./Attribute/RawbodyManager')
// const adminManager = require('./Utils/FirebaseAdminManager')
//Express
const privateApi = express()
//From Route
const testRoute = require('./Route/TestRoute')
const privateApiRoute = require('./Route/PrivateApiRoute')

exports.helloWorld = functions.https.onRequest(testRoute.helloWorld);

privateApi.use(cors)
privateApi.use(authAttribute.verifyAuthToken)
privateApi.use(rawBodyAttribute.getRawBodyManager)
privateApi.post('/', privateApiRoute.echo)
exports.privateApi = functions.https.onRequest(privateApi);