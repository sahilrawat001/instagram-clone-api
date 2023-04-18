const { userService, postService, friendService, sessionService, fileUploadService, trailService } = require('../services');
const mongoose = require("mongoose");



let sideFunctions = {};


sideFunctions.checkFollower = async (user, follower) => {
    let ans = await friendService.findOne({ sender: follower, receiver: user, status: 1 });
    if (!ans) {
        return false;
    }
    else {
        return true;
    }

}


sideFunctions.accountPublic = async (userId) => {
    let ans = await userService.findOne({ _id: new mongoose.Types.ObjectId(userId), isPublic: true });
    if (!ans) {
        return false;
    }
    else {
        return true;
    }
}

module.exports = sideFunctions;