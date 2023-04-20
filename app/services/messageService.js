'use strict';

const { messageModel } = require('./../models')
let messageService = {};

/**
* function to create.
*/
messageService.create = async (payload) => {
    return await new messageModel(payload).save();
};

/**
* function to insert.
*/
messageService.insertMany = async (payload) => {
    return await messageModel.insertMany(payload);
};

/**
* function to find.
*/
messageService.find = async (criteria, projection = {}) => {
    return await messageModel.find(criteria, projection).populate('users','userName');

    /*
    // .populate({
    //     path: "users",
    //     select: 'userName profilePic '
    // }) 

    */
};

/**
* function to find one.
*/
messageService.findOne = async (criteria, projection = {}) => {
    return await messageModel.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
messageService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await messageModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
messageService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await messageModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
messageService.deleteOne = async (criteria) => {
    return await messageModel.deleteOne(criteria);
};

/**
* function to delete Many.
*/
messageService.deleteMany = async (criteria) => {
    return await messageModel.deleteMany(criteria);
};

/**
* function to apply aggregate on messageModel.
*/
messageService.aggregate = async (query) => {
    return await messageModel.aggregate(query);
};

module.exports = messageService;