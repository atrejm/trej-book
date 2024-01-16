import { Schema, Types, model } from "mongoose";
import { IUser } from "./User";
import { IComment } from "./Comment";

const mongoose = require('mongoose');

export interface IPost {
    author: Types.ObjectId,
    title: string,
    content: string,
    dateposted: Date,
    published: boolean,
    rating: number,
    comments: [Types.ObjectId | IComment]
}

const PostSchema : Schema<IPost> = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User"},
    title: {type: String, required: true, maxLength: 50},
    content: {type: String, required: true},
    dateposted: {type: Date, default: Date.now()},
    published: {type: Boolean, default: true},
    rating: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
})

module.exports = model("Post", PostSchema);