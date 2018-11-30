//Global
global.define = require('./Settings/DefineManager')
global.log = require('./Utils/LogManager')
//For firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./service-account.json"); //Firebase project secret key
//From Route
const testRoute = require('./Route/TestRoute')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().project.database,
    storageBucket: functions.config().project.storage,
    projectId: functions.config().project.project_id
});

exports.helloWorld = functions.https.onRequest(testRoute.helloWorld);