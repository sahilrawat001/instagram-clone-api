


'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { default: mongoose } = require('mongoose');

/************* Friends Model ***********/
const friendSchema = new Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: Number,
        enum: [-1, 0,1],
        // 1 for accepted  , -1 for pending ,
        default: -1,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
},
);

module.exports = MONGOOSE.model('friend', friendSchema);                                         



