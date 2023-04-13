'use strict';

let dbService = {}; 

/**
* function to create.
*/ 
dbService.create = async (model, payload) => {
    return await new model(payload).save();
};

/**
* function to insert.
*/
dbService.insertMany = async (model, payload) => {
    return await model.insertMany(payload);
};

/**
* function to find.
*/
dbService.find = async (model, criteria, projection = {}) => {
    return await model.find(criteria, projection).lean();
};

/**
* function to find one.
*/
dbService.findOne = async (model, criteria, projection = {}) => {
    return await model.findOne(criteria, projection).lean();
};

/**
* function to update one.
*/
dbService.findOneAndUpdate = async (model, criteria, dataToUpdate, projection = {}) => {
    return await model.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update Many.
*/
dbService.updateMany = async (model, criteria, dataToUpdate, projection = {}) => {
    return await model.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
dbService.deleteOne = async (model, criteria) => {
    return await model.deleteOne(criteria);
};

/**
* function to delete Many.
*/
dbService.deleteMany = async (model, criteria) => {
    return await model.deleteMany(criteria);
};

/**
* function to apply aggregate on model.
*/
dbService.aggregate = async (model, query) => {
    return await model.aggregate(query);
};

module.exports = dbService;