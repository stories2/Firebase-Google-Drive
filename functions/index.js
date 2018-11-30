//For firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//For logging
const { createLogger, format, transports } = require('winston');
global.logManager = createLogger({
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [new transports.Console()]
})


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
    //only 'info', 'warn', 'error' working
    global.logManager.log('debug', 'test message %s', 'my string');

    global.logManager.log('silly', "127.0.0.1 - there's no place like home");
    global.logManager.log('debug', "127.0.0.1 - there's no place like home");
    global.logManager.log('verbose', "127.0.0.1 - there's no place like home");
    global.logManager.log('info', "127.0.0.1 - there's no place like home");
    global.logManager.log('warn', "127.0.0.1 - there's no place like home");
    global.logManager.log('error', "127.0.0.1 - there's no place like home");
    global.logManager.info("127.0.0.1 - there's no place like home");
    global.logManager.warn("127.0.0.1 - there's no place like home");
    global.logManager.error("127.0.0.1 - there's no place like home");
    response.send("Hello from Firebase!");
});
