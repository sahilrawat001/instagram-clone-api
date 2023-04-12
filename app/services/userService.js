'use strict';

const { UserModel } = require('./../models')
let userService = {};

/**
* function to create.
*/
userService.create = async (payload) => {
    return await new UserModel(payload).save();
};

/**
* function to insert.
*/
userService.insertMany = async (payload) => {
    return await UserModel.insertMany(payload);
};

/**
* function to find.
*/
userService.find = async (criteria, projection = {}) => {
    return await UserModel.find(criteria, projection).lean();
};

/**
* function to find one.
*/
userService.findOne = async (criteria, projection = {}) => {
    return await UserModel.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
userService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await UserModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
userService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await UserModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
userService.deleteOne = async (criteria) => {
    return await UserModel.deleteOne(criteria);
};

/**
* function to delete Many.
*/
userService.deleteMany = async (criteria) => {
    return await UserModel.deleteMany(criteria);
};

/**
* function to apply aggregate on UserModel.
*/
userService.aggregate = async (query) => {
    return await UserModel.aggregate(query);
};

module.exports = userService;