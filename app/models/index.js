'use strict';

/********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    DBVersionModel: require('./dbVersionModel'),
    SessionModel: require('./sessionModel'),
    UserModel: require('./userModel'),  
};