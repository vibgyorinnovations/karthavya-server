const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const DashboardDTO = require('../dto/DashboardDTO')
const DashboardService = require('../services/DashboardService')
const log4js = require('log4js')
const logger = log4js.getLogger()
const date = new Date()

logger.level = 'info'

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

// Configuring CORS
let corsConfig = { /*origin: 'http://localhost:3000/dashboard'*/ }

let dashboardDTO = new DashboardDTO()
const dashboardService = new DashboardService()

// Request to Fetch Present Day's Data
router.get('/', cors(corsConfig), (req, res) => {
    req.params.date = String(date.getDate()) + '-' + String(date.getMonth() + 1) + '-' + String(date.getFullYear())
    getDashboardData(req, res).then(() => res.end())
})

// Request to Add Data into the Database
router.post('/', cors(corsConfig), (req, res) => addDashboardData(req, res))

// Request to Fetch Current Week's Data
router.get('/week-data', cors(corsConfig), (req, res) => getWeeklyDashboardData(req, res))

// Request to Fetch a Particular Day's Data
router.get('/:date', cors(corsConfig), (req, res) => getDashboardData(req, res))

let addDashboardData = async (req, res) => {
    logger.info('Entering | DashboardController::addDashboardData')
    dashboardDTO = await dashboardService.addDashboardData(req.body, dashboardDTO)
    res.json(dashboardDTO.json)
    logger.info('Exiting | DashboardController::addDashboardData')
    res.end()
}

let getDashboardData = async (req, res) => {
    req.session.accountId = 'sjdhiadsivnvk'
    logger.info('Entering | DashboardController::getDashboardData')
    dashboardDTO = await dashboardService.getDashboardData(req.params.date, req.session.accountId, dashboardDTO)
    res.json(dashboardDTO.json)
    logger.info('Exiting | DashboardController::getDashboardData')
    res.end()
}

let getWeeklyDashboardData = async (req, res) => {
    req.session.accountId = 'sjdhiadsivnvk'
    logger.info('Entering | DashboardController::getWeeklyDashboardData')
    dashboardDTO = await dashboardService.getWeeklyDashboardData(req.session.accountId, dashboardDTO)
    res.json(dashboardDTO.json)
    logger.info('Exiting | DashboardController::getWeeklyDashboardData')
    res.end()
}

module.exports = router