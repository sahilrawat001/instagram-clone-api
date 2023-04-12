'use strict';

/***********************************
**** node module defined here *****
***********************************/
require('dotenv').config();
const EXPRESS = require("express");
const { SERVER } = require('./config');

/** creating express server app for server. */
const app = EXPRESS();

/********************************
***** Server Configuration *****
********************************/
const server = require('http').Server(app);

/** Server is running here */
let startNodeserver = async () => {
    await require('./app/startup/expressStartup')(app); // express startup.
    
    return new Promise((resolve, reject) => {
        server.listen(SERVER.PORT, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

startNodeserver().then(() => {
    console.log('Node server running on', SERVER.URL);
}).catch((err) => {
    console.log('Error in starting server', err);
    process.exit(1);
});

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error);
});