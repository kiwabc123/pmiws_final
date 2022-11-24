const express = require('express')
const server = express()
const PORT = 8216 
const bodyParser = require("body-parser")
const expressSession = require('cookie-session')
const router = require('./routes')

server.use(expressSession({
    secret: 'hackathon-group',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))
server.use(require('./configs/middleware'))

server.use(bodyParser.urlencoded({ extended: false, limit: '50MB' }))
server.use(bodyParser.json({ limit: '50MB' }))

server.use('/',express.static('dist'));
server.use('/api/', router)

server.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// server.get('*', (req, res) => {
//     res.end(`<h1>Server is started</h1>`)
// })

server.listen(PORT, () => console.log('Server is started. Port ' + PORT + '.'))