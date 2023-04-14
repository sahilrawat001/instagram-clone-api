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
    dob: { type: Date , default:Date.now()},
     email: { type: String},
    mobile: {
        type:Number ,
    },
    password: { 
        type:String,
    },
    isPublic: {
        type: Boolean,
        default:true
    },
    userBio: {
        type: String,     
        default:''
    },
    profilePic: {
        type: String,
        default:''
    }
},
);

module.exports = MONGOOSE.model('users', userSchema);                                         