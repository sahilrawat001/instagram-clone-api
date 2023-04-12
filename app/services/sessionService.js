const { sessionModel } = require('../models');

let sessionService = {};

/**
 * function to create user's session in the database.
 */
sessionService.createSession = async (dataToUpdate) => {
    return await sessionModel(dataToUpdate).save();
};

/**
 * function to update user's session in the database.
 */
sessionService.updateSession = async (criteria, dataToUpdate) => {
    return await sessionModel.findOneAndUpdate(criteria, dataToUpdate, { new: true, upsert: true }).lean();
};

/**
 * function to verify a user's session.
 */
sessionService.verifySession = async (userId, userToken) => {
    let userSession = await sessionModel.findOne({ userId, userToken }).lean();
    if (userSession) {
        return true;
    }
    return false;
};

/**
 * function to fetch user's session.
 */
sessionService.getSession = async (criteria) => {
    return await sessionModel.findOne(criteria).populate('userId').lean();
};

/**
 * function to remove session of a user when user is deleted from system.
 */
sessionService.removeSession = async (criteria) => {
    return await sessionModel.findOneAndRemove(criteria);
};

sessionService.deleteSession = async (criteria) => {
    return await sessionModel.findOneAndDelete(criteria);
}

sessionService.findSession = async (criteria, projection={}) => {
    return await sessionModel.find(criteria, projection);
}

sessionService.aggregateSession = async (criteria) => {
    return await sessionModel.aggregate(criteria);
}

module.exports = sessionService;