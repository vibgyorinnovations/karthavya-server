const express = require( 'express' );
const router = express.Router();
const bodyParser = require( 'body-parser' );
const AccountsDTO = require( '../dto/AccountsDTO' );
const AccountsService = require('../services/AccountsService');
const log4js = require( "log4js" );
const logger = log4js.getLogger();

logger.level = 'info';

let accountsDTO = new AccountsDTO();
const accountsService = new AccountsService();

router.use( bodyParser.json() );
router.use( bodyParser.urlencoded( { extended: false } ) );

router.post('/', (req, res) => addAccount(req, res));

router.get('/', (req, res) => getAccount(req, res));

router.put('/', (req, res) => updateAccount(req, res));

let addAccount = async (req, res) => {
    logger.info('Entering | AccountsController::addAccount');
    accountsDTO = await accountsService.addAccount(req.body, accountsDTO);
    res.json(accountsDTO.json);
    logger.info('Exiting | AccountsController::addAccount');
    res.end();
}

let getAccount = async (req, res) => {
    logger.info('Entering | AccountsController::getAccount');
    logger.info('Exiting | AccountsController::getAccount');
}

let updateAccount = async (req, res) => {
    logger.info('Entering | AccountsController::updateAccount');
    logger.info('Exiting | AccountsController::updateAccount');
}

module.exports = router;