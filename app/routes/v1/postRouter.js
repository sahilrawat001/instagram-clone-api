'use strict';
const { Joi } = require('../../utils/joiUtils');
const CONSTANTS = require('../../utils/constants');
const { postController } = require('../../controllers');

module.exports = [
  
    {
        method: 'POST',
        path: '/v2/newchat',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                userId: Joi.string().required().description("user's id of friend you want  to add for chat"),
            },
            group: 'CHAT',
            description: 'Route to chat with friend',
            model: 'ADD_CHAT'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,

        handler: postController.addChat 
    },
    {
        method: 'POST',
        path: '/v2/allchats',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            // body: {
            //     userId: Joi.string().required().description("user's id of friend you want  to add for chat"),
            // },
            group: 'CHAT',
            description: 'Route to get all chats',
            model: 'ALL_CHAT'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,

        handler: postController.getAllChats 
    },
    {
        method: 'POST',
        path: '/v2/sendMessage',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                content: Joi.string().required().description("user's id of friend you want  to add for chat"),
                chatId:Joi.string().required()
            },
            group: 'CHAT',
            description: 'Route to get all chats',
            model: 'ALL_CHAT'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,

        handler: postController.sendMessage 
    },




    {
        method: 'POST',
        path: '/v2/sendrequest',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                userId: Joi.string().required().description("user's id of friend you want  to add"),
            },
            group: 'USER',
            description: 'Route to send request',
            model: 'SEND_REQUEST'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,

        handler: postController.sendRequest
    },


    {
        method: 'POST',
        path: '/v2/acceptrequest',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                userId: Joi.string().required().description("user's id of friend you want  to accept"),
            },
            group: 'USER',
            description: 'Route to send request',
            model: 'ACCEPT_REQUEST'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,

        handler: postController.acceptRequest
    },

   
    
    
  
    {
        method: 'POST',
        path: '/v2/addpost',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            formData: {
                file: Joi.file({ name: "file" }),
                body: {
                    caption: Joi.string().description(" user's name"),
                    userName: Joi.string().description(" username must be unique"),
                    likes: Joi.string().description("user's bio"),
                    comments: Joi.string().description('User\'s dob'),
                },

            },
            group: 'POSTS',
            description: 'Route to add new post',
            model: 'NEWPOST'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,
        handler: postController.addPost
    },

    {
        method: 'POST',
        path: '/v2/likepost',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                postId: Joi.string().description(" post that you wants to like")
            },

            group: 'POSTS',
            description: 'Route to add new post',
            model: 'likePost'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,
        handler: postController.likePost
    },
    {
        method: 'POST',
        path: '/v2/commentpost',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                postId: Joi.string().description(" post that you wants to comment"),
                comment: Joi.string().description(" comment for the post")
            },

            group: 'POSTS',
            description: 'Route to add new post',
            model: 'commentPost'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,
        handler: postController.commentPost
    },
    {
        method: 'POST',
        path: '/v2/showpost',
        joiSchemaForSwagger: {
            headers: {
                'authorization': Joi.string().required().description("User's JWT token.")
            },
            body: {
                postId: Joi.string().description(" all posts of the users")
            },

            group: 'POSTS',
            description: 'Route to add new post',
            model: 'showPosts'
        },
        auth: CONSTANTS.AVAILABLE_AUTHS.ALL,
        handler: postController.getAllPosts
    },

];