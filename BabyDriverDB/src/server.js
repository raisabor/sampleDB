const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const cookieParser = require('cookie-parser');
const sessionSystem = require('./session-system');

let corsOptions = {
    origin:function(origin, callback) {
        callback(null, true);
    },
    credentials:true
}

const config = {
    name: 'babydriver-backend',
    port: 3000,
    host: '0.0.0.0',
};

const app = express();

const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(ExpressAPILogMiddleware(logger, { request: true }));
app.use(cookieParser());

sessionSystem.setupServer(app);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the BabyDriver Backend REST API');
});

const userDataRoutes = require('./user-data-routes');
const sessionRoutes = require('./session-routes');
const childDataRoutes = require('./child-data-routes');
const pickupRoutes = require('./pickup-routes');

app.get('/user/:id?', userDataRoutes);
app.get('/users', userDataRoutes);
app.put('/user', userDataRoutes);
app.post('/user/email', userDataRoutes);
app.post('/user/password', userDataRoutes);

app.post('/user/session', sessionRoutes);
app.delete('/user/session', sessionRoutes);

app.put('/child', childDataRoutes);
app.post('/child/age/:id', childDataRoutes);
app.post('/child/height/:id', childDataRoutes);
app.post('/child/school/:id', childDataRoutes);
app.get('/child/:id?', childDataRoutes);

app.get('/pickups/assigned', pickupRoutes);
app.get('/pickups/requested', pickupRoutes);
app.get('/pickups/:id?', pickupRoutes);
app.post('/pickups/status', pickupRoutes);
app.put('/pickups', pickupRoutes);

app.use(function(err, req, res, next) {
    if (err.error_message && err.error_code && err.error_code == 500) {
        logger.error(err.error_message);
    }
    next(err);
});

app.use(function(err, req, res, next) {
    if (err.error_message && err.error_code) {
        res.status(err.error_code);
        res.send({
            code: err.error_code,
            error: err.error_message
        });
    } else {
        res.status(500);
        res.send({
            code: 500,
            error: err
        });
    }
});

app.use(function(req, res, next) {
    res.status(404);
    res.send({
        code: 404,
        error: 'No such route'
    });
});

//connecting the express object to listen on a particular port as defined in the config object. 
app.listen(config.port, config.host, (e) => {
    if (e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
