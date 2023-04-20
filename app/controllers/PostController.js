"use strict";

const path = require('path');
const CONFIG = require('../../config');
const { createErrorResponse, createSuccessResponse } = require("../helpers");
const mongoose = require("mongoose");
const { MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, LOGIN_TYPES, EMAIL_TYPES, TOKEN_TYPES, USER_TYPE, OTP_EXPIRY_TIME, DEFAULT_PROFILE_IMAGE, FILE_UPLOAD_TYPE, USER_ACTIVITY_STATUS, TRAIL_KEYS, OTP_TYPE, ISVERIFIED, DEVICE_TYPES, DEEP_LINK_CUSTOM_SCHEME } = require('../utils/constants');
const { userService, postService, friendService, sessionService, fileUploadService, trailService, chatService, messageService } = require('../services');
const { compareHash, encryptJwt, sendEmail, generateOTP, addMinutesToDate, hashPassword } = require('../utils/utils');
const { log } = require('console');

const commonFunctions = require('../utils/utils');
const sideFunctions = require('./sideFunctions');


/**************************************************
 ***************** user controller ***************
 **************************************************/
let postController = {};

/**
 * function to get server response.
 * @param {*} payload 
 * @returns 
 */
postController.getServerResponse = async (payload) => {
    return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
};
postController.checkServer = async (payload) => {
    return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);
};


postController.sendRequest = async (payload) => {
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
        await friendService.create({
            sender: payload.user._id,
            receiver: payload.userId,
            status: userStatus,

        });

        return createSuccessResponse(MESSAGES.AUTH_IS_WORKING_FINE);
    }
}


postController.addChat =async(payload)=>{
 let isChat=  await chatService.find( {
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{ $eq:payload.userId }  }},
        {users:{$elemMatch:{ $eq:payload.user._id }  }},
    ]
   }  )
    if (isChat.length > 0) {
   } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [payload.user._id, payload.userId],
    };
    console.log(chatData);
    
    const createdChat = await chatService.create(chatData);
    const FullChat = await chatService.findOne({ _id: createdChat._id });
    console.log(FullChat); 
}

return createSuccessResponse(MESSAGES.SUCCESS);

}

postController.getAllChats= async( payload )=>{
  let result= await chatService.find( 
    {users:{$elemMatch:{ $eq:payload.user._id }  }} 
    )
  

    return createSuccessResponse(result ,MESSAGES.SUCCESS);


}


postController.sendMessage=async (payload)=>{
    try {
    let {chatId, content} =payload;

    let newMessage = {
        sender: payload.user._id,
        content: content,
        chat: chatId,
      };
        let message = await  messageService.create(newMessage);
    
   
    
        await chatService.findOneAndUpdate( {_id: chatId}, { latestMessage: message });
    
        return createSuccessResponse(MESSAGES.SUCCESS);
    } catch (error) {
        
        throw new Error(error.message);
    }
    
}


postController.acceptRequest = async (payload) => {
    let { userId } = payload
    let checkRequest = await friendService.findOneAndUpdate({ receiver: payload.user._id, sender: userId, status: 0 }, {
        $set: {
            status: 1
        }
    })
    if (checkRequest) {
        return createSuccessResponse(MESSAGES.ALREADY_EXISTS);
    }
    else {


        return createSuccessResponse(MESSAGES.UPDATED_DATA);
    }
}



 

/**
 * function to check user auth.
 * @param {*} payload 
 * @returns 
 */
postController.checkUserAuth = async (payload) => {

    return createSuccessResponse(MESSAGES.AUTH_IS_WORKING_FINE);
};

/**
 * function to test email service.
 * @param {*} payload 
 * @returns 
 */
postController.testEmail = async (payload) => {
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
 

 

postController.addPost = async (payload) => {
    let newimage;
    try {

        if (payload.file.originalname) {
            const multerImage = await fileUploadService.uploadFileToLocal(payload, payload.file.originalname);
            newimage = multerImage.path;
        }
        const { caption } = payload;
        console.log(payload.user._id);

        let ans = await postService.create({
            userId: payload.user._id,
            image: newimage,
            caption: caption,
            likes: [],
            Comment: []
        });
        console.log(ans, "**********");



        return createSuccessResponse(MESSAGES.SUCCESS, ans);
    }
    catch (err) {
        return createErrorResponse(err.message, ERROR_TYPES.ALREADY_EXISTS)
    }

};



postController.getAllPosts = async (payload) => {
    console.log(payload.user);

    const allposts = await postService.find({ userId: payload.user._id });
    console.log(allposts);
    return createSuccessResponse(MESSAGES.SUCCESS, allposts);

}


postController.likePost = async (payload) => {
    try {

        let postToLike = payload.postId;
        let loginedperson = payload.user._id;

        let idToUpdate = postService.findOne({ _id: postToLike })

        let isFollower = sideFunctions.checkFollower(loginedperson, idToUpdate.userId);
        let isPublicAccount = sideFunctions.accountPublic(idToUpdate.userId);
        if (isFollower || isPublicAccount || (loginedperson == mongoose.Types.ObjectId(idToUpdate.userId))) {
            await postService.findOneAndUpdate({ _id: postToLike }, {
                $push: {
                    likes: loginedperson
                }
            })

            return createSuccessResponse(MESSAGES.SUCCESS)
            //    return createSuccessResponse()
        }
        else {
            return createErrorResponse(ERROR_TYPES.UNAUTHORIZED);
        }
    }

    catch (err) {
        return createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
    }
    // let userExist=await userService.find()
}




postController.commentPost = async (payload) => {
    try {

        let postToComment = payload.postId;
        let loginedperson = payload.user._id;

        let idToUpdate = postService.findOne({ _id: postToComment })

        let isFollower = sideFunctions.checkFollower(loginedperson, idToUpdate.userId);
        let isPublicAccount = sideFunctions.accountPublic(idToUpdate.userId);
        console.log(payload.comment, "*****************");
        if (isFollower || isPublicAccount || (loginedperson == mongoose.Types.ObjectId(idToUpdate.userId))) {
            await postService.findOneAndUpdate({ _id: postToComment },
                { $push: { Comments: { commentId: loginedperson, comment: payload.comment } } }, // update operation to add a new comment to the array

            )
            0
            return createSuccessResponse(MESSAGES.SUCCESS)
            //    return createSuccessResponse()
        }
        else {
            return createErrorResponse(ERROR_TYPES.UNAUTHORIZED);
        }
    }

    catch (err) {
        return createErrorResponse(err.message, ERROR_TYPES.BAD_REQUEST)
    }
    // let userExist=await userService.find()
}








module.exports = postController; 