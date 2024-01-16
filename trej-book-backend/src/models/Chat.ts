import { Schema, SchemaTypes, model } from "mongoose";

const ChatSchema = new Schema({
    mainUser: {type: SchemaTypes.ObjectId, ref: "User"},
    chatMate: {type: SchemaTypes.ObjectId, ref: "User"},
    chatLog: [{userID: String}]
});

module.exports = model("Chat", ChatSchema);