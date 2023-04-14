'use strict';

const { API_AUTH_KEY } = require('../../config');
const { decryptJwt } = require("../utils/utils");
const { createErrorResponse } = require("../helpers");
const { userModel, sessionModel } = require('../models');
const { MESSAGES, ERROR_TYPES, TOKEN_TYPES, AVAILABLE_AUTHS, USER_TYPE } = require('../utils/constants');
const userService = require('./userService');

let authService = {};

authService.validateApiKey = () => {
    return (request, response, next) => {
        if (request.headers['x-api-key'] == API_AUTH_KEY) {
            return next();
        }
        let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
        return response.status(responseObject.statusCode).json(responseObject);
    };
};

/**
 * function to authenticate user.
 */
authService.userValidate = (authType) => {
     return (request, response, next) => {
         validateUser(request, authType).then((isAuthorized) => {
             if(typeof(isAuthorized) == 'string'){
                let responseObject = createErrorResponse(MESSAGES.FORBIDDEN(request.method, request.url), ERROR_TYPES.FORBIDDEN);
                return response.status(responseObject.statusCode).json(responseObject);
            }
            if (isAuthorized) {
                return next();
            }
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch((err) => {
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};

/**
 * function to validate user's token and fetch its details from the system. 
 * @param {} request 
 */
let validateUser = async (request, authType) => {
    try {
           let session = await sessionModel.findOne({ token: (request.headers.authorization), tokenType: TOKEN_TYPES.LOGIN });
  
      
        if (!session || (session && session.tokenExpDate < new Date())) {
            return false;
        }

        if (authType == AVAILABLE_AUTHS.USER && session.userType != USER_TYPE.USER) {
            return false;
        }
         
        if (authType == AVAILABLE_AUTHS.ADMIN_USER && (session.userType !== USER_TYPE.USER && session.userType !== USER_TYPE.SUPER_ADMIN)) {
            return false;
        }
        
        if(authType == AVAILABLE_AUTHS.ADMIN && session.userType !== USER_TYPE.SUPER_ADMIN){
            return false;
        }  
         let user = await userService.findOne({ _id: session.userId }   )
         if (user) {
            user.session = session;
            request.user = user;
            return true;
        }
         return false;
    } catch (err) {
        console.log(err.message);
        return false;
    }
};

module.exports = authService;