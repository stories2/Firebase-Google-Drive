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
 response.send("Hello from Firebase!");
});
