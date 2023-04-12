'use strict';

const express = require('express');
const cors = require('cors');
const routes = require('../routes');
const routeUtils = require('../utils/routeUtils');
const { log, logger} = require('../utils/utils');
 
module.exports = async (app) => {
    app.use(cors());
    app.use(require("body-parser").json({ limit: '50mb' }));
    app.use(require("body-parser").urlencoded({ limit: '50mb', extended: true }));

    /** middleware for each api call to logging**/
    app.use((request, response, next) => {
        const start = process.hrtime.bigint();

        response.on('finish', () => {

            let end = process.hrtime.bigint();
            let seconds = Number(end - start) / 1000000000;
            let message = `${request.method} ${response.statusCode} ${request.url} took ${seconds} seconds`;

            if ( response.statusCode >= 200 && response.statusCode <= 299 ) {
                log.success(message);
            } else if( response.statusCode >= 400 ) {
                log.error(message);

                let payload = {
                    
                    params: ((request.params || {}).value || {}),
                    query: ((request.query || {}).value || {})
                };
                let apiRequestData = `${request.method} ${request.route.path} ${response.statusCode} | ${response.statusMessage} ${request.body.error ? request.body.error.message : ""} | ${JSON.stringify(payload)}`
                
                logger.error(apiRequestData);
            } else {
                log.info(message);
            }
        });
        next();
    });

    /********************************
    ***** For handling CORS Error ***
    *********************************/
    app.all('/*', (request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message');
        response.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
        response.header('Access-Control-Max-Age', 1800);
        next();
    }); 

    // serve static folder.
    // app.use('/public', express.static('public'));

    // await require('./db_redis')(); //initialise redis.
    // await require('./cronScheduler')(); // initialize cron jobs.
    await require('./db_mongo')(); // initialize mongodb.  
    // await dbMigrations.migerateDatabase(); // migrate database.
    await routeUtils.route(app, routes); // initalize routes.
};