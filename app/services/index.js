'use strict';

/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
module.exports = {
    dbService: require('./userService'),
    swaggerService: require('./swaggerService'),
    authService: require('./authService'),
    sessionService: require('./sessionService'),
    fileUploadService: require('./fileUploadService'),
    userService: require('./userService')
};