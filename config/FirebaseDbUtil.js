const admin = require( "firebase-admin" );

// Fetch the service account key JSON file contents
const serviceAccount = require( "./covid-kit-project-firebase-adminsdk-mxgf9-f1058e5296.json" );

// Initialize the app with a service account, granting admin privileges
const firebase = admin.initializeApp( {
    credential: admin.credential.cert( serviceAccount ),
    databaseURL: "https://covid-kit-project.firebaseio.com/"
} );

module.exports = firebase;


// Creating New Account
// let db = firebase.database()
// let ref = db.ref( "/dateData" );
// console.log(ref.push().key);
// var newPostRef = ref.push( {
//     "accountId": "0002",
//     "name": "Sheaik",
//     "email": "Deva@gmail.com",
//     "password": "deva",
//     "contact": "11234",
// } );
//
//
// // Adding a new Device
// newPostRef = newPostRef.child( '/devices' );
//
// var newDeviceRef = newPostRef.push( {
//     "deviceId": "0001"
// } );
//
//
// // Adding New DateData
// var newDeviceRef = newDeviceRef.child( '/dateData' );
//
// var newDateData = newDeviceRef.push( {
//     "date": "23-12-2020"
// } );
//
// // Adding New Data
// newDateData = newDateData.child( '/data' );
//
// var newData = newDateData.push( {
//     "time": "4:05",
//     "maskPpresent": "yes",
//     "temperature": "78"
// } );