'use strict';

const { friendModel } = require('./../models')
let friendService = {};

/**
* function to create.
*/
friendService.create = async (payload) => {
    return await new friendModel(payload).save();
};

/**
* function to insert.
*/
friendService.insertMany = async (payload) => {
    return await friendModel.insertMany(payload);
};

/**
* function to find.
*/
friendService.find = async (criteria, projection = {}) => {
    return await friendModel.find(criteria, projection).lean();
};

/**
* function to find one.
*/
friendService.findOne = async (criteria, projection = {}) => {
    return await friendModel.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
friendService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await friendModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
friendService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await friendModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
friendService.deleteOne = async (criteria) => {
    return await friendModel.deleteOne(criteria);
};

/**
* function to delete Many.
*/
friendService.deleteMany = async (criteria) => {
    return await friendModel.deleteMany(criteria);
};

/**
* function to apply aggregate on friendModel.
*/
friendService.aggregate = async (query) => {
    return await friendModel.aggregate(query);
};

module.exports = friendService;