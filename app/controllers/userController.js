"use strict";

const path = require('path');
const CONFIG = require('../../config');
const { createErrorResponse, createSuccessResponse } = require("../helpers");
const mongoose = require("mongoose");
const { MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, LOGIN_TYPES, EMAIL_TYPES, TOKEN_TYPES, USER_TYPE, OTP_EXPIRY_TIME, DEFAULT_PROFILE_IMAGE, FILE_UPLOAD_TYPE, USER_ACTIVITY_STATUS, TRAIL_KEYS, OTP_TYPE, ISVERIFIED, DEVICE_TYPES, DEEP_LINK_CUSTOM_SCHEME } = require('../utils/constants');
const { userService, sessionService, fileUploadService, trailService } = require('../services');
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


userController.uploadFile = async (payload) => {

    const abc = await fileUploadService.uploadFileToLocal(payload, payload.file.originalname);
    console.log(payload.file);
    return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
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

        return createSuccessResponse(MESSAGES.SUCCESS, token);
    }
    catch (err) {
        return createErrorResponse(err.message, ERROR_TYPES.ALREADY_EXISTS)
    }

};



module.exports = userController;