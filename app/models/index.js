'use strict';
 /********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    DBVersionModel: require('./dbVersionModel'),
    sessionModel: require('./sessionModel'),
    UserModel: require('./userModel'),
    friendModel: require('./friendsSchema'),
    postModel :require("./PostModel")
};
 