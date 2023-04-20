'use strict';

const mongoose = require('mongoose');
 mongoose.Promise = require('bluebird');

const { MONGODB } = require('../../config');

module.exports = async () => { 
 
    await mongoose.connect(MONGODB );
    console.log('MongoDB connected at', MONGODB);
}; 