'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const CONFIG = require('../../config');
const { FILE_UPLOAD_TYPE, NORMAL_PROJECTION } = require('../utils/constants');
const userModel = require('../models/userModel');
const moment = require('moment-timezone');
const S3UploadStream = require('s3-upload-stream')
const { syncWait } = require('../utils/utils')
var url = require('url');


AWS.config.update({ accessKeyId: CONFIG.S3_BUCKET.accessKeyId, secretAccessKey: CONFIG.S3_BUCKET.secretAccessKey });
let s3Bucket = new AWS.S3();

const fileUploadService = {};

/**
 * function to upload a file to s3(AWS) bucket.
 */
fileUploadService.uploadFileToS3 = (payload, fileName, bucketName) => {
    return new Promise((resolve, reject) => {
        s3Bucket.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: payload.file.buffer,
            ContentType: payload.file.mimetype
            // ACL: 'public-read',
        }, function (err, data) {
            if (err) {
                console.log('Error here', err);
                return reject(err);
            }
            resolve(data.Key);
            // resolve(data.Location);
        });
    });
};

/**
 * function to upload file to local server.
 */
fileUploadService.uploadFileToLocal = async (payload, fileName, pathToUpload, pathOnServer) => {
    let directoryPath = pathToUpload ? pathToUpload : path.resolve(__dirname + `../../..${CONFIG.PATH_TO_UPLOAD_FILES_ON_LOCAL}`);
    // create user's directory if not present.
    fileName  =Date.now()+fileName;
    console.log(directoryPath, '----*****');
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
    let fileSavePath = `${directoryPath}/${fileName}`;
    let writeStream = fs.createWriteStream(fileSavePath);
    return new Promise((resolve, reject) => {
        writeStream.write(payload.file.buffer);
        writeStream.on('error', function (err) {
            reject(err);
        });
        writeStream.end(function (err) {
            if (err) {
                reject(err);
            } else {
                let fileUrl = pathToUpload ? `${CONFIG.SERVER_URL}${pathOnServer}/${fileName}` : `${CONFIG.SERVER_URL}${CONFIG.PATH_TO_UPLOAD_FILES_ON_LOCAL}/${fileName}`;
                var q = url.parse(fileUrl, true);
                 console.log(q);
                 console.log(q.pathname);
                 resolve(q);
            }
        });
    });
};

/**
 * function to upload a file on either local server or on s3 bucket.
 */
fileUploadService.uploadFile = async (payload, pathToUpload, pathOnServer) => {
    let fileExtention = payload.file.originalname.split('.')[1];
    let fileName = `upload_${Date.now()}.${fileExtention}`, fileUrl = '';
    if (payload.type == FILE_UPLOAD_TYPE.USER_MEAL) {
        fileName = `uploads/images/fuel/fuel_${Date.now()}.${fileExtention}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.PROFILE_IMAGE) {
        fileExtention = (fileExtention) ? fileExtention : 'png';
        fileName = `profiles/profile_${Date.now()}.${fileExtention}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.CAPTURE_IMAGE) {
        fileExtention = (fileExtention) ? fileExtention : 'png';
        fileName = `events/${payload.eventId}/sc_${Date.now()}.${fileExtention}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.EVENT_RECORDING) {
        fileExtention = (fileExtention) ? fileExtention : 'mp4';
        fileName = `events/${payload.eventId}/recordings/recording_${Date.now()}.${fileExtention}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.POSTURE) {
        let user = await userModel.findOne({ _id: payload.userId });
        let userTZ = user.timeZone || CONFIG.DEFAULT_TZ;
        let date = new Date(moment().tz(userTZ).startOf("day"))
        date = date.getTime();
        fileExtention = (fileExtention) ? fileExtention : 'png';
        let UpdatedFileName = `ps_${Date.now()}.${fileExtention}`;
        fileName = `postures/${payload.userId}/${date}/${UpdatedFileName}`;
    }
    if (CONFIG.UPLOAD_TO_S3_BUCKET.toLowerCase() === 'true') {
        fileUrl = await fileUploadService.uploadFileToS3(payload, fileName, CONFIG.S3_BUCKET.bucketName);
    } else {
        fileUrl = await fileUploadService.uploadFileToLocal(payload, fileName, pathToUpload, pathOnServer);
    }
    return fileUrl;
};

/**
 * function to get a file from s3(AWS) bucket.
 */
fileUploadService.getS3File = async (payload, bucketName) => {
    return new Promise((resolve, reject) => {
        s3Bucket.getObject({ Bucket: bucketName || CONFIG.S3_BUCKET.bucketName, Key: payload.path }, function (err, data) {
            if (err) {
                if (err && err.code == "AccessDenied") {
                    resolve({ not_found: true });
                }
                else {
                    console.log("S3 file getting error", err);
                    reject(new Error("S3 file getting error"));
                }
            }
            else {
                resolve(data)
            }
        });
    })
};

module.exports = fileUploadService;