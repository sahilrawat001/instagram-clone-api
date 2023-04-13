'use strict';

const mongoose = require('mongoose');
 mongoose.Promise = require('bluebird');

const { MONGODB } = require('../../config');

module.exports = async () => { 
 
    await mongoose.connect(MONGODB.URL );
    console.log('MongoDB connected at', MONGODB.URL);
}; 