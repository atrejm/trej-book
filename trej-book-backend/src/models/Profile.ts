import { createHash } from "crypto";
import { Types, ObjectId, Schema, SchemaTypes, model } from "mongoose";
import { IUser } from "./User";
import { IPost } from "./Post";
const mongoose = require('mongoose');

export interface IProfile {
    user: Types.ObjectId | IUser,
    bio: string,
    friends: [Types.ObjectId | IUser],
    profilePicURL: string | null,
    posts: [Types.ObjectId | IPost]
}

const ProfileSchema = new Schema<IProfile>({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    bio: {type: String},
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    profilePicURL: {type: String},
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
})

module.exports = model<IProfile>("Profile", ProfileSchema);