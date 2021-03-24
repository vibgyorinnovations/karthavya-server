const log4js = require( "log4js" );
const logger = log4js.getLogger();
const AccountsDao = require( '../dao/AccountsDao' );
const Accounts = require( '../models/Accounts' );

logger.level = 'info';

const ACCOUNT_IS_EMPTY = 'Account Id is Empty';

const NAME_IS_EMPTY = 'Name is Empty';

const EMAIL_IS_EMPTY = 'Email is Empty';

const CONTACT_IS_EMPTY = 'Contact is Empty';

const PASSWORD_IS_EMPTY = 'Password is Empty';

class AccountsService{
    accountsDao = new AccountsDao();

    constructor() {
    }

    async addAccount(reqBody, accountsDTO){
        logger.info('Entering | AccountsService::addAccount');

        let accounts = new Accounts(reqBody.accountId, reqBody.name, reqBody.email, '0', reqBody.password, reqBody.contact, []);
        accountsDTO.accountData = accounts;
        accountsDTO.success = true;

        if(accounts.accountId == null || accounts.accountId === ''){
            accountsDTO.success = false;
            accountsDTO.description = ACCOUNT_IS_EMPTY;
        }
        if(accounts.name == null || accounts.name === ''){
            accountsDTO.success = false;
            accountsDTO.description = accountsDTO.description + ' ' + NAME_IS_EMPTY;
        }
        if(accounts.email == null || accounts.email === ''){
            accountsDTO.success = false;
            accountsDTO.description = accountsDTO.description + ' ' + EMAIL_IS_EMPTY;
        }
        if(accounts.contact == null || accounts.contact === ''){
            accountsDTO.success = false;
            accountsDTO.description = accountsDTO.description + ' ' + CONTACT_IS_EMPTY;
        }
        if(accounts.password == null || accounts.password === ''){
            accountsDTO.success = false;
            accountsDTO.description = accountsDTO.description + ' ' + PASSWORD_IS_EMPTY;
        }
        if( !accountsDTO.success ){
            accountsDTO.status = 500;
            logger.info('Exiting | AccountsService::addAccount | Values Missing');
            accountsDTO.accountData = null;
            return accountsDTO;
        }
        else{
            accountsDTO = await this.accountsDao.addAccount(accountsDTO);
            logger.info('Exiting | AccountsService::addAccount');
            return accountsDTO;
        }
    }

    async getAccount(accountsDTO){
        logger.info('Entering | AccountsService::getAccount');
        logger.info('Exiting | AccountsService::getAccount');
        return  accountsDTO;
    }

    async updateAccount(reqBody, accountsDTO){
        logger.info('Entering | AccountsService::updateAccount');
        logger.info('Exiting | AccountsService::updateAccount');
        return accountsDTO;
    }
}

module.exports = AccountsService;