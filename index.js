const express = require('express')
const app = express()
const dashboardController = require('./controllers/DashboardController')
const bodyParser = require('body-parser')
const log4js = require('log4js')
const logger = log4js.getLogger()
const sessions = require('express-session')

logger.level = 'info'

const port = 5000

logger.info('Server Available at port:' + port)

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(sessions({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: false,
}))

// Get Request from /
app.get('/', function (req, res) {
    logger.info('Get Request to /')
    res.end('Server Running Successfully at port ' + port)
})

// Login Routes
app.get('/login', function (req, res) {
    logger.info('Get Request to /login')
    res.end('Login Page')
})

// Dashboard Routes
app.use('/dashboard', dashboardController)

// Handling 404 Requests
app.use(function (req, res) {
    logger.info('404 error... Page not found')
    res.json({
        status: '404',
        description: 'Page Not Found'
    })
    res.end()
})

app.listen(port)
