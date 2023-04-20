'use strict';

const { chatModel } = require('./../models')
let chatService = {};

/**
* function to create.
*/
chatService.create = async (payload) => {
    return await new chatModel(payload).save();
};

/**
* function to insert.
*/
chatService.insertMany = async (payload) => {
    return await chatModel.insertMany(payload);
};

/**
* function to find.
*/
chatService.find = async (criteria, projection = {}) => {
    return await chatModel.find(criteria, projection).populate('users','userName');

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
chatService.findOne = async (criteria, projection = {}) => {
    return await chatModel.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
chatService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await chatModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
chatService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await chatModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
chatService.deleteOne = async (criteria) => {
    return await chatModel.deleteOne(criteria);
};

/**
* function to delete Many.
*/
chatService.deleteMany = async (criteria) => {
    return await chatModel.deleteMany(criteria);
};

/**
* function to apply aggregate on chatModel.
*/
chatService.aggregate = async (query) => {
    return await chatModel.aggregate(query);
};

module.exports = chatService;