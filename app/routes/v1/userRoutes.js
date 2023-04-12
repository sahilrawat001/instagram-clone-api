'use strict';

const { Joi } = require('../../utils/joiUtils');
const CONSTANTS = require('../../utils/constants');
const { userController } = require('../../controllers');

module.exports = [
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
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.checkUserAuth
	}, {
		method: 'POST',
		path: '/v1/testEmail',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().case('lower').email().optional().description("user's email"),
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
				email: Joi.string().description("user's email"),
				userName:Joi.string().description("user's username"),
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
				email: Joi.string().required().description("useremail "),
				fullName: Joi.string().required().description(" full name"),
				mobile: Joi.string().pattern(/^\d{10}$/).required().description("mobile number"),
 			},
 			group: 'USER',
			description: 'Route for signup ',
			model: 'signup'
		},
		handler: userController.signupUser
	},
];