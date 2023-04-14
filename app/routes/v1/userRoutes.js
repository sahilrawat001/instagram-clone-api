'use strict';
const { Joi } = require('../../utils/joiUtils');
const CONSTANTS = require('../../utils/constants');
const { userController } = require('../../controllers');

module.exports = [
	{
		method: 'POST',
		path: '/v1/user/update',
		joiSchemaForSwagger: {
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			formData: {
				file: Joi.file({ name: "file" }),
				body: {
					fullName: Joi.string().description(" user's name"),
					userName: Joi.string().description(" username must be unique"),
					userBio: Joi.string().description("user's bio"),
					dob: Joi.string().description('User\'s dob'),
					isPublic: Joi.number().valid(1, 0)
				},

			},
			group: 'FILE',
			description: 'Route to update user profile',
			model: 'files'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.updateProfile
	},

	{
		method: 'GET',
		path: '/v1/user/auth',
		joiSchemaForSwagger: {
			headers: {
				'authorization': Joi.string().required().description("User's JWT token.")
			},
			group: 'TEST',
			description: 'Route to user auth example',
			model: 'USER_AUTH'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.ALL,
		handler: userController.checkUserAuth
	},
	{
		method: 'POST',
		path: '/v1/sendrequest',
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

		handler: userController.sendRequest
	},


	{
		method: 'POST',
		path: '/v1/acceptrequest',
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

		handler: userController.acceptRequest
	},

	{
		method: 'POST',
		path: '/v1/testEmail',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().case('lower').email().optional().description("user's email"),
			},
			group: 'TEST',
			description: 'Route to test email',
			model: 'TEST_EMAIL'
		},
		handler: userController.testEmail
	},
	{
		method: 'POST',
		path: '/v1/login',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().description("user's email"),
				userName: Joi.string().description("user's username"),
				password: Joi.string().required().description('User\'s password')
			},
			group: 'USER',
			description: 'Route to login a user',
			model: 'Login'
		},
		handler: userController.loginUser
	},
	{
		method: 'POST',
		path: '/v1/signup',
		joiSchemaForSwagger: {
			body: {
				userName: Joi.string().required().description("user's username"),
				password: Joi.string().required().description('User\'s password'),
				email: Joi.string().email().required().description("useremail "),
				fullName: Joi.string().required().description(" full name"),
				mobile: Joi.string().pattern(/^\d{10}$/).required().description("mobile number"),
			},
			group: 'USER',
			description: 'Route for signup ',
			model: 'signup'
		},
		handler: userController.signupUser
	},
	{
		method: 'GET',
		path: '/v1/serverStatus',
		joiSchemaForSwagger: {
			group: 'TEST',
			description: 'Route to check server is working fine or not?',
			model: 'SERVER'
		},
		handler: userController.checkServer
	},
];