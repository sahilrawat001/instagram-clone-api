'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { default: mongoose } = require('mongoose');
 
/************* User Model ***********/
const userSchema = new Schema({
    fullName: { type: String },
    userName: {
        type: String,
    unique:true
    },
    dob: { type: Date },
     email: { type: String},
    mobile: {
        type:Number ,
    },
    password: { 
        type:String,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        status:{type:"string" ,default:"pending"}

        }
    ],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        status: { type: "string", default: "pending" }

    }
    ],
    isPublic: {
        type: Boolean,
        default:true
    },
    userBio: {
        type: String,       
    },
    profilePic: {
        type:String
    }
},
);

module.exports = MONGOOSE.model('users', userSchema);                                         