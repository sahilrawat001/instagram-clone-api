"use strict";

const path = require('path');
const CONFIG = require('../../config');
const { createErrorResponse, createSuccessResponse } = require("../helpers");
const mongoose = require("mongoose");
const { MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, LOGIN_TYPES, EMAIL_TYPES, TOKEN_TYPES, USER_TYPE, OTP_EXPIRY_TIME, DEFAULT_PROFILE_IMAGE, FILE_UPLOAD_TYPE, USER_ACTIVITY_STATUS, TRAIL_KEYS, OTP_TYPE, ISVERIFIED, DEVICE_TYPES, DEEP_LINK_CUSTOM_SCHEME } = require('../utils/constants');
const { userService, friendService, sessionService, fileUploadService, trailService } = require('../services');
const { compareHash, encryptJwt, sendEmail, generateOTP, addMinutesToDate, hashPassword } = require('../utils/utils');
const { log } = require('console');

const commonFunctions = require('../utils/utils');


/**************************************************
 ***************** user controller ***************
 **************************************************/
let userController = {};

/**
 * function to get server response.
 * @param {*} payload 
 * @returns 
 */
userController.getServerResponse = async (payload) => {
    return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
};
userController.checkServer = async (payload) => {
    return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
};


userController.sendRequest = async (payload) => {
    let { userId } = payload
    let ans = await userService.findOne({ _id: payload.userId });
     if (!ans) {
        return createErrorResponse(MESSAGES.NO_USER_FOUND, ERROR_TYPES.FORBIDDEN)
    }
    let userStatus;
    if (ans.isPublic) {
        userStatus = 1
    }
    else {
        userStatus = -1
    }
    let checkRequest = await friendService.deleteOne({
            sender: payload.user._id,
            receiver: payload.userId
     
    })
    console.log(checkRequest);
    if (checkRequest.deletedCount) {
        return createSuccessResponse(MESSAGES.USER_ALREADY_EXISTS_AND_REMOVED);

    }
    else {
        let result = await friendService.create({
            sender: payload.user._id,
            receiver: payload.userId,
            status: userStatus,

        });
 
        return createSuccessResponse(MESSAGES.AUTH_IS_WORKING_FINE);
    }
}

userController.acceptRequest = async (payload) => {
    let { userId } = payload
     let checkRequest = await friendService.findOneAndUpdate({ receiver: payload.user._id, sender: userId ,status:0 }, {
        $set: {
            status: 1
        }
    })
    if(checkRequest){
    return createSuccessResponse(MESSAGES.ALREADY_EXISTS);
}
else {
 
 
        return createSuccessResponse(MESSAGES.UPDATED_DATA);
}
}



userController.updateProfile = async (payload) => {
    let image;
    try {

        if (payload.file.originalname) {
             const multerImage = await fileUploadService.uploadFileToLocal(payload, payload.file.originalname);
            image = multerImage.path;
        }
        const { userBio, fullName, profilePic, dob, isPublic, userName } = payload;
        let ans = await userService.findOneAndUpdate({ _id: payload.user._id }, {
            $set: {
                userBio,
                fullName,
                dob: new Date(dob) || dob,
                profilePic: image || profilePic,
                isPublic,
                userName

            }
        })
        console.log(ans);

        return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
    }
    catch (err) {
        return createErrorResponse(err.message, ERROR_TYPES.ALREADY_EXISTS)
    }
}

/**
 * function to check user auth.
 * @param {*} payload 
 * @returns 
 */
userController.checkUserAuth = async (payload) => {

    return createSuccessResponse(MESSAGES.AUTH_IS_WORKING_FINE);
};

/**
 * function to test email service.
 * @param {*} payload 
 * @returns 
 */
userController.testEmail = async (payload) => {
    await sendEmail({
        email: payload.email
    }, EMAIL_TYPES.WELCOME_EMAIL);
    return createSuccessResponse(MESSAGES.EMAIL_IS_WORKING_FINE);
};

/**
 * function to login a user.
 * @param {*} payload 
 * @returns 
 */
userController.loginUser = async (payload) => {
    // try {

    let ans = await userService.findOne({ $or: [{ userName: payload.userName }, { email: payload.email }] });
    console.log(ans);
    // let acceptUser=commonFunctions.compareHash(payload.password, ans.password)
    if (commonFunctions.compareHash(payload.password, ans.password)) {
        let token = commonFunctions.encryptJwt({ uniqueId: ans._id })
        await sessionService.createSession({
            userId: ans._id,
            token: token
        });

        return createSuccessResponse(MESSAGES.SUCCESS, { token });
    }
    else {
        return createErrorResponse(MESSAGES.INVALID_CREDENTIALS, ERROR_TYPES.FORBIDDEN)
    }
    // }
    // catch {
    //     return createErrorResponse(MESSAGES.SOMETHING_WENT_WRONG, ERROR_TYPES.BAD_REQUEST)      
    // }

};

userController.signupUser = async (payload) => {
    try {
        const { password } = payload;
        const hashedPassword = commonFunctions.hashPassword(password);
        payload.password = hashedPassword;

        let ans = await userService.create(payload);
        let token = commonFunctions.encryptJwt({ uniqueId: ans._id })
        await sessionService.createSession({
            userId: ans._id,
            token: token
        });


        return createSuccessResponse(MESSAGES.SUCCESS, token);
    }
    catch (err) {
        return createErrorResponse(err.message, ERROR_TYPES.ALREADY_EXISTS)
    }

};



module.exports = userController;