'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
    
/************* User Model ***********/
const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:"users",
        required :true
    },
    image: {
        type: String,
         required :true
    },
    caption:{
     type:String
    },
    likes:[ {
        type: Schema.Types.ObjectId,
        unique:true,
        ref: "users",
         
    }],
    Comments: [
        {
        commentId: {
            
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        comment:{type:String}
        }
    ]
   
 
 
},
   { timestamps: true}
);

module.exports = MONGOOSE.model('posts', postSchema);                                         