const log4js = require( "log4js" );
const logger = log4js.getLogger();
const Data = require('../models/Data');
const DateData = require('../models/DateData');
const Devices = require('../models/Devices');
const Accounts = require('../models/Accounts');

logger.level = 'info';

class DashboardFunctions{
    constructor() {
    }
    processDashboardData(accounts){
        logger.info('Entering | DashboardFunctions::precessDashboardData');
        let dataObject = {
            noOfEntries: 0,
            noOfPeopleWearingMask: 0,
            noOfPeopleNotWearingMask: 0,
            maxTemperature: 0,
            minTemperature: 0,
            avgTemperature: 0,
            noOfPeopleWithNormalTemperature: 0,
            noOfPeopleWithAbnormalTemperature: 0
        };

        let MIN_NORMAL_TEMPERATURE = 35.0;
        let MAX_NORMAL_TEMPERATURE = 37.2;
        let devices = accounts.devices;
        for( let item of devices){
            let device = item.dateData.data;
            for( let data of device){
                // Incrementing No. of Entries for each data
                dataObject.noOfEntries++;

                // Incrementing No. of People Wearing Masks when maskPresent is yes
                if(data.maskPresent.toLocaleLowerCase() === 'yes'){
                    dataObject.noOfPeopleWearingMask++;
                }

                // Incrementing No. of People Not Wearing Masks when maskPresent is no
                if(data.maskPresent.toLocaleLowerCase() === 'no'){
                    dataObject.noOfPeopleNotWearingMask++;
                }

                // Finding the maxTemperature
                if(dataObject.maxTemperature < parseInt(data.temperature)){
                    dataObject.maxTemperature = parseInt(data.temperature);
                }

                // Setting the minTemperature to the current data Temperature for the 1st time
                if(dataObject.noOfEntries === 1){
                    dataObject.minTemperature = parseInt(data.temperature);
                }

                // Finding the minTemperature
                if(dataObject.minTemperature > parseInt(data.temperature)){
                    dataObject.minTemperature = parseInt(data.temperature);
                }

                // Summing the total temperature to find average Temperature
                dataObject.avgTemperature += parseInt(data.temperature);

                // Calculating the Normal and Abnormal temperature count
                if(data.temperature < MIN_NORMAL_TEMPERATURE || data.temperature > MAX_NORMAL_TEMPERATURE){
                    dataObject.noOfPeopleWithAbnormalTemperature++;
                } else{
                    dataObject.noOfPeopleWithNormalTemperature++;
                }
            }
        }
        dataObject.avgTemperature = dataObject.avgTemperature / dataObject.noOfEntries;

        logger.info('Exiting | DashboardFunctions::precessDashboardData');
        return dataObject;
    }

    pad(value, width, character) {
        character = character || '0';
        value = value + '';
        return value.length >= width ? value : new Array(width - value.length + 1).join(character) + value;
    }
}

module.exports = DashboardFunctions;