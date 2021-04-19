const log4js = require( "log4js" );
const logger = log4js.getLogger();

const Accounts = require( '../models/Accounts' );
const Devices = require( '../models/Devices' );
const DateData = require( '../models/DateData' );
const Data = require( '../models/Data' );

const DashboardFunctions = require( '../modules/DashboardModules' );
const DashboardDao = require( '../dao/DashboardDao' );

// Refactoring Constants
const DEVICE_ID_IS_EMPTY = 'Device ID is Empty';
const DATE_IS_EMPTY = 'Date is Empty';
const TIME_IS_EMPTY = 'Time is Empty';
const TEMPERATURE_IS_EMPTY = 'Temperature is Empty';
const MASK_PRESENT_IS_EMPTY = 'Mask Present is Empty';
const THIS_SESSION_IS_NOT_AVAILABLE = 'This Session is not Available';
const NO_DATA_AVAILABLE = 'No Data Available';

logger.level = 'info';

const dashboardDao = new DashboardDao();
const dashboardFunctions = new DashboardFunctions();

class DashboardService {
    constructor() {}
    async addDashboardData( reqBody, dashboardDTO ) {
        logger.info( 'Entering | DashboardService::addDashboardData' );

        let accounts = new Accounts();
        let devices = new Devices();
        let dateData = new DateData();
        let data = new Data();
        let account = reqBody;

        data.time = account.devices.dateData.data.time;
        data.maskPresent = account.devices.dateData.data.maskPresent;
        data.temperature = account.devices.dateData.data.temperature;

        dateData.data = data;
        dateData.date = account.devices.dateData.date;

        devices.dateData = dateData;
        devices.deviceId = account.devices.deviceId;

        accounts.devices = devices;

        dashboardDTO.dashboardData = accounts;

        dashboardDTO.success = true;

        // Data Validation
        if ( devices.deviceId == null || devices.deviceId === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = dashboardDTO.description + ' ' + DEVICE_ID_IS_EMPTY;
        }
        if ( dateData.date == null || dateData.date === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = dashboardDTO.description + ' ' + DATE_IS_EMPTY;
        }
        if ( data.time == null || data.time === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = dashboardDTO.description + ' ' + TIME_IS_EMPTY;
        }
        if ( data.temperature == null || data.temperature === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = dashboardDTO.description + ' ' + TEMPERATURE_IS_EMPTY;
        }
        if ( data.maskPresent == null || data.maskPresent === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = dashboardDTO.description + ' ' + MASK_PRESENT_IS_EMPTY;
        }

        if ( !dashboardDTO.success ) {
            dashboardDTO.status = 500;
            logger.info( 'Exiting | DashboardService::addDashboardData | Values Missing' );
            return dashboardDTO;
        } else {

            dashboardDTO = await dashboardDao.addDashboardData( dashboardDTO );

            logger.info( 'Exiting | DashboardService::addDashboardData' );
            return dashboardDTO;
        }
    }

    async getDashboardData( date, accountId, dashboardDTO ) {
        logger.info( 'Entering | DashboardService::getDashboardData' );

        let accounts = new Accounts();
        let devices = new Devices();
        let dateData = new DateData();

        dateData.date = date;
        devices.dateData = dateData;
        accounts.devices = devices;
        accounts.accountId = accountId;
        dashboardDTO.dashboardData = accounts;

        dashboardDTO.success = true;

        if ( accounts.accountId == null || accounts.accountId === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = THIS_SESSION_IS_NOT_AVAILABLE;
        }
        if ( date == null || date === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.description = dashboardDTO.description + ' ' + DATE_IS_EMPTY;
        }
        if ( !dashboardDTO.success ) {
            dashboardDTO.dashboardData = {};
            logger.info( 'Exiting DashboardService::getDashboardData | Values Missing' );
            return dashboardDTO;
        } else {
            dashboardDTO = await dashboardDao.getDashboardData( dashboardDTO );

            if ( dashboardDTO.success ) {
                dashboardDTO.dashboardData = dashboardFunctions.processDashboardData( dashboardDTO.dashboardData );
            } else if ( dashboardDTO.description === NO_DATA_AVAILABLE ) {
                dashboardDTO.dashboardData = {};
            }

            logger.info( 'Exiting | DashboardService::getDashboardData' );
            return dashboardDTO;
        }
    }

    async getWeeklyDashboardData( accountId, dashboardDTO ) {
        logger.info( 'Entering | DashboardService::getWeeklyDashboardData' );

        let weekData = {};
        let accounts = new Accounts();
        accounts.accountId = accountId;
        dashboardDTO.success = true;

        if ( accounts.accountId == null || accounts.accountId === '' ) {
            dashboardDTO.success = false;
            dashboardDTO.setDescription = THIS_SESSION_IS_NOT_AVAILABLE;
        }
        if ( !dashboardDTO.success ) {
            logger.info( 'Exiting | DashboardService::getWeeklyDashboardData | Values Missing' );
            return dashboardDTO;
        } else {
            let dateObj = new Date();
            let currDate = dateObj.getDate();
            let currDay = dateObj.getDay();
            let currYear = dateObj.getFullYear();
            let currMonth = dateObj.getMonth() + 1;
            if ( currDate - currDay < 1 ) {
                let year = currYear
                let month = currMonth - 1;
                if ( dateObj.getMonth() === 0 ) {
                    year--;
                    month = 12;
                }
                let lastMonthDate = new Date( year, month, 0 ).getDate();
                let startDate = lastMonthDate + ( currDate - currDay )
                for ( let i = startDate; i <= lastMonthDate; i++ ) {
                    let date = dashboardFunctions.pad( i, 2, 0 ) + '-' + dashboardFunctions.pad( month, 2, 0 ) + '-' + year;
                    weekData[ date ] = ( await this.getDashboardData( date, accounts.accountId, dashboardDTO ) ).dashboardData;
                }
                currDay += ( currDate - currDay ) - 1;
            }

            for ( let i = currDate - currDay; i <= currDate; i++ ) {
                let date = dashboardFunctions.pad( i, 2, 0 ) + '-' + dashboardFunctions.pad( currMonth, 2, 0 ) + '-' + currYear;
                console.log( date );
                weekData[ date ] = ( await this.getDashboardData( date, accounts.accountId, dashboardDTO ) ).dashboardData;
            }
        }
        dashboardDTO.dashboardData = weekData;
        logger.info( 'Exiting | DashboardService::getWeeklyDashboardData' );
        return dashboardDTO;
    }
}

module.exports = DashboardService;