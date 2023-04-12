'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

/************* DB version Model ***********/
const versionSchema = new Schema({
    version: { type: Number, default: 0 }
}, { timestamps: false, versionKey: false});

module.exports = MONGOOSE.model('dbVersion', versionSchema); 