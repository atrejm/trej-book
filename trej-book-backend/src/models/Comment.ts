import { Types, ObjectId, Schema, SchemaTypes, model } from "mongoose";
const mongoose = require('mongoose');

export interface IComment {
    author: Types.ObjectId,
    post: Types.ObjectId,
    content: string,
    dateposted: Date,
    rating: number
}

const CommentSchema = new Schema<IComment>({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    content: {type: String},
    dateposted: [{type: Date, default: Date.now()}],
    rating: {type: Number, default: 0},
})

module.exports = model<IComment>("Comment", CommentSchema);