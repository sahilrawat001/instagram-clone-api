'use strict';

const { postModel } = require('./../models')
let postService = {};

/**
* function to create.
*/
postService.create = async (payload) => {
    return await new postModel(payload).save();
};

/**
* function to insert.
*/
postService.insertMany = async (payload) => {
    return await postModel.insertMany(payload);
};

/**
* function to find.
*/
postService.find = async (criteria, projection = {}) => {
    return await postModel.find(criteria, projection).populate({
        path: "userId",
        select: 'userName profilePic '
    }).populate({

        path: "likes",
        select: 'userName profilePic'
    }).populate(
        {
            path: 'Comments.commentId',
            select : ' userName profilePic'
        }
    );
};

/**
* function to find one.
*/
postService.findOne = async (criteria, projection = {}) => {
    return await postModel.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
postService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await postModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
postService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await postModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
postService.deleteOne = async (criteria) => {
    return await postModel.deleteOne(criteria);
};

/**
* function to delete Many.
*/
postService.deleteMany = async (criteria) => {
    return await postModel.deleteMany(criteria);
};

/**
* function to apply aggregate on postModel.
*/
postService.aggregate = async (query) => {
    return await postModel.aggregate(query);
};

module.exports = postService;