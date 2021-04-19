const log4js = require( "log4js" );
const logger = log4js.getLogger();
const firebase = require( '../config/FirebaseDbUtil' );

const accountsConstants = require( '../constants/AccountsConstants' );
const devicesConstants = require( '../constants/DevicesConstants' );
const dateDataConstants = require( '../constants/DateDataConstants' );
//const Crypto = require('../config/EncryptDecryptUtil');

const Accounts = require( '../models/Accounts' );
const Devices = require( '../models/Devices' );
const DateData = require( '../models/DateData' );
const Data = require( '../models/Data' );

logger.level = 'info';

const database = firebase.database();

// Refactoring Constants
const DATABASE_INSERTION_OPERATION_FAILED = 'Database Insertion Operation Failed';
const DATA_ADDED_SUCCESSFULLY = 'Data Added Successfully';
const DATABASE_RETRIEVAL_OPERATION_FAILED = 'Database Retrieval Operation Failed';
const DATA_RETRIEVED_SUCCESSFULLY = 'Data Retrieved Successfully';
const NO_DEVICE_AVAILABLE = 'No Device Available';
const NO_DATA_AVAILABLE = 'No Data Available';

class DashboardDao {
    constructor() {}
        // Adding data to the dashboard
    async addDashboardData( dashboardDTO ) {
        logger.info( 'Entering | DashboardDao::addDashboardData' );

        let accounts = dashboardDTO.dashboardData;
        let devices = accounts.devices;
        let dateData = devices.dateData;
        let data = dateData.data;

        try {
            let deviceRef = await database.ref( '/' + accountsConstants.DEVICES + '/' + devices.deviceId );
            let dateRef = await database.ref( '/' + devicesConstants.DATE_DATA );
            // let cipherText = this.crypto.encrypt(dateData.date)
            // console.log( cipherText )
            // console.log( this.crypto.decrypt(cipherText) )
            await deviceRef.orderByChild( dateDataConstants.DATE ).equalTo( /*this.crypto.encrypt(*/ dateData.date )
                .once( 'value' ).then( async( snapshot ) => {
                    if ( snapshot.val() != null ) {
                        dateRef = await dateRef.child( /*this.crypto.decrypt(*/ snapshot.val()[ Object.keys( snapshot.val() )[ 0 ] ][ dateDataConstants.DATA ] );
                    } else {
                        let dateRefKey = ( await dateRef.push() ).key;
                        let date = {};
                        dateRef = await dateRef.child( dateRefKey );
                        date[ dateDataConstants.DATE ] = /*this.crypto.encrypt(*/ dateData.date;
                        date[ dateDataConstants.DATA ] = /*this.crypto.encrypt(*/ dateRefKey;
                        await deviceRef.push( date );
                    }
                    await dateRef.push( {
                        time: /*this.crypto.encrypt(*/ data.time,
                        maskPresent: /*this.crypto.encrypt(*/ data.maskPresent,
                        temperature: /*this.crypto.encrypt(*/ data.temperature
                    } );
                } );
        } catch ( e ) {
            console.log( e );
            dashboardDTO.success = false;
            dashboardDTO.status = 500;
            dashboardDTO.description = DATABASE_INSERTION_OPERATION_FAILED;
        }
        if ( dashboardDTO.success ) {
            dashboardDTO.status = 201;
            dashboardDTO.description = DATA_ADDED_SUCCESSFULLY;
        }

        dashboardDTO.dashboardData = null;
        logger.info( 'Exiting | DashboardDao::addDashboardData' );
        return dashboardDTO;
    }

    async getDashboardData( dashboardDTO ) {
        logger.info( 'Entering | DashboardDao::getDashboardData' );

        let accounts = new Accounts( dashboardDTO.dashboardData.accountId, null, null, null, null, null, dashboardDTO.dashboardData.devices );
        let devices = new Devices( null, accounts.devices.dateData );
        let dateData = new DateData( devices.dateData.date, null );

        try {
            let accountRef = await database.ref( '/' + accountsConstants.ACCOUNTS + '/' + accounts.accountId + '/' + accountsConstants.DEVICES );
            let deviceRef = await database.ref( '/' + accountsConstants.DEVICES );
            let dateDataRef = await database.ref( '/' + devicesConstants.DATE_DATA );

            // Getting DeviceId of all devices
            await accountRef.once( "value" ).then( async( snapshot ) => {
                let devicesArr = [];
                if ( snapshot.val() != null ) {
                    let count = 0;
                    // Iterating for each DeviceId
                    for ( const deviceId of snapshot.val() ) {
                        let dateDataTemp = new DateData( dateData.date, null );
                        let deviceTemp = new Devices( null, dateDataTemp );
                        let dataArr = [];
                        let deviceRefChild = await deviceRef.child( /*this.crypto.decrypt(*/ deviceId + '/' );
                        // Getting the DateDataId of a Date of a Device
                        await deviceRefChild.orderByChild( dateDataConstants.DATE ).equalTo( dateData.date ).once( 'value' ).then( async( snapshot ) => {
                            if ( snapshot.val() != null ) {
                                let dataRef = await dateDataRef.child( /*this.crypto.decrypt(*/ snapshot.val()[ Object.keys( snapshot.val() )[ 0 ] ][ dateDataConstants.DATA ] );
                                // Getting the Data from the Date
                                await dataRef.once( 'value' ).then( ( snapshot ) => {
                                    if ( snapshot.val() != null ) {
                                        // Iterating over all the
                                        for ( const key of Object.keys( snapshot.val() ) ) {
                                            let data = new Data( /*this.crypto.decrypt(*/ snapshot.val()[ key ].time, /*this.crypto.decrypt(*/ snapshot.val()[ key ].maskPresent, /*this.crypto.decrypt(*/ snapshot.val()[ key ].temperature );
                                            dataArr.push( data );
                                        }
                                    }
                                } );
                                count++;
                            }
                        } )
                        dateDataTemp.data = dataArr;
                        deviceTemp.deviceId = deviceId;
                        devicesArr.push( deviceTemp );
                    }
                    if ( count === 0 ) {
                        dashboardDTO.success = false;
                        dashboardDTO.status = 200;
                        dashboardDTO.description = NO_DATA_AVAILABLE;
                    }
                } else {
                    dashboardDTO.success = false;
                    dashboardDTO.status = 200;
                    dashboardDTO.description = NO_DEVICE_AVAILABLE;
                }
                accounts.devices = devicesArr;
                dashboardDTO.dashboardData = accounts;
            } );

        } catch ( e ) {
            console.log( e );
            dashboardDTO.success = false;
            dashboardDTO.status = 500;
            dashboardDTO.description = DATABASE_RETRIEVAL_OPERATION_FAILED;
        }
        if ( dashboardDTO.success ) {
            dashboardDTO.status = 200;
            dashboardDTO.description = DATA_RETRIEVED_SUCCESSFULLY;
        }
        logger.info( 'Exiting | DashboardDao::getDashboardData' );
        return dashboardDTO;
    }
}

module.exports = DashboardDao;