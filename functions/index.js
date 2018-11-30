//Global
global.define = require('./Settings/DefineManager')
//For firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//For logging
var log = require('fancy-log');


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

    log.info(global.define.LOGGING_STRING_FORMAT, "index", "helloWorld", "this is test message with info level")
    log.warn("this is", "warn", 1)
    log.error("oh no!")

    response.send("Hello from Firebase! - logging test");
});
