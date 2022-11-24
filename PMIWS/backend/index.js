const express = require('express')
const server = express()
const PORT = 8090 
const bodyParser = require("body-parser")
const expressSession = require('cookie-session')
const router = require('./routes')
const fileUpload = require('express-fileupload');
server.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);
server.use(expressSession({
    secret: 'hackathon-group',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
  });
server.use(require('./configs/middleware'))

server.use(bodyParser.urlencoded({ extended: false, limit: '50MB' }))
server.use(bodyParser.json({ limit: '50MB' }))
server.use('/api/', router)

server.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

server.get('*', (req, res) => {
    res.end(`<h1>Server is started</h1>`)
})

server.listen(PORT, () => console.log('Server is started. Port ' + PORT + '.'))