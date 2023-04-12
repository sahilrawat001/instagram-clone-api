'use strict';

let RESPONSE = {
    ERROR: {
        DATA_NOT_FOUND: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 404,
                msg: msg,
                status: false,
                type: 'DATA_NOT_FOUND',
            };
        },
        BAD_REQUEST: (msg,data) => {
            let obj = {
                statusCode: 400,
                status: false,
                msg: msg || '',
                type: 'BAD_REQUEST',
            }
            if(data){
                obj = {...obj, data}
            }
            return obj;
        },
        MONGO_EXCEPTION: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 100,
                msg: msg,
                status: false,
                type: 'MONGO_EXCEPTION',
            };
        },
        ALREADY_EXISTS: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 400,
                msg: msg,
                status: false,
                type: 'ALREADY_EXISTS',
            };
        },
        FORBIDDEN: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 403,
                msg: msg,
                status: false,
                type: 'Forbidden',
            };
        },
        INTERNAL_SERVER_ERROR: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 500,
                msg: msg,
                status: false,
                type: 'INTERNAL_SERVER_ERROR',
            };
        },
        UNAUTHORIZED: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 401,
                msg: msg,
                status: false,
                type: 'UNAUTHORIZED',
            };
        }
    },
    SUCCESS: {
        MISSCELANEOUSAPI: (msg, data) => {
            let obj = {
                statusCode: 200,
                status: true,
                msg: msg || "",
                type: 'SUCCESS',
            }
            if(data){
                obj = {...obj, data}
            }
            return obj;
        }
    }
};

/**
 * function to create a valid SUCCESS response object.
 * @param {*} message message that has to be pass in the response object.
 */
function createSuccessResponse(message, data) {
    return RESPONSE.SUCCESS.MISSCELANEOUSAPI(message, data);
}

/**
 * function to create a valid ERROR response object.
 * @param {*} message message that has to be pass in the response object.
 */
function createErrorResponse(message, errorType, data) {
    return RESPONSE.ERROR[errorType](message, data);
}

module.exports = {
    createErrorResponse: createErrorResponse,
    createSuccessResponse: createSuccessResponse
};
