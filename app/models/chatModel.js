const MONGOOSE = require("mongoose");

const chatModel = MONGOOSE.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: MONGOOSE.Schema.Types.ObjectId, ref: "users" }],
    latestMessage: {
      type: MONGOOSE.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: MONGOOSE.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = MONGOOSE.model("Chat", chatModel);


 