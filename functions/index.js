//Global
global.define = require('./Settings/DefineManager')
global.log = require('./Utils/LogManager')
//For firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');


var serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().project.database,
    storageBucket: functions.config().project.storage,
    projectId: functions.config().project.project_id
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

    global.log.info("index", "helloWorld", "this is info")
    global.log.debug("index", "helloWorld", "this is debug")
    global.log.warn("index", "helloWorld", "this is warn")
    global.log.error("index", "helloWorld", "this is error")

    response.send("Hello from Firebase! - logging test 2");
});
