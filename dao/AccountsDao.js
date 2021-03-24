const log4js = require( "log4js" );
const logger = log4js.getLogger();
const firebase = require( '../config/FirebaseDbUtil' );
const accountsConstants = require( '../constants/AccountsConstants' );
const Crypto = require('../config/EncryptDecryptUtil');
const Accounts = require('../models/Accounts');

logger.level = 'info';

class AccountsDao{
    constructor() {
    }

    async addAccount(accountsDao){
        logger.info('Entering | AccountsDao::addAccount');
        logger.info('Exiting | AccountsDao::addAccount');
    }

    async getAccount(){
        logger.info('Entering | AccountsDao::getAccount');
        logger.info('Exiting | AccountsDao::getAccount');
    }

    async updateAccount(){
        logger.info('Entering | AccountsDao::updateAccount');
        logger.info('Exiting | AccountsDao::updateAccount');
    }
}

module.exports = AccountsDao;