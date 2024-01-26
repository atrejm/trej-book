import { createHash } from "crypto";
import { response } from "express";
import { HydratedDocument, ObjectId, Schema, Types, SchemaType, SchemaTypes, VirtualPathFunctions, VirtualType, VirtualTypeOptions, model, PopulatedDoc } from "mongoose";
import { IProfile } from "./Profile";
const mongoose = require('mongoose');

// Document interface
export interface IUser extends Express.User {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    profile: Types.ObjectId;
    chats: Array<Types.ObjectId>;
    thumbnailURL: string
}

const UserSchema :Schema = new Schema<IUser>({
    firstname: {type: String, required: true, maxLength: 25},
    lastname: {type: String, required: true, maxLength: 25},
    username: {type: String, required: true, minLength: 5, maxLength: 25},
    password: {type: String, required: true},
    email: {type: String, required: true},
    profile: {type: Schema.Types.ObjectId, ref: "Profile"},
    chats: [{type: Schema.Types.ObjectId, ref: "Chat"}]
})

// This virtual returns the Hash required to get prfile data from Gravatar API:
// https://docs.gravatar.com/profiles/json/ 
UserSchema.virtual('thumbnailURL').get(async function(): Promise<string> {
    const hash = createHash('sha256');
    hash.update(this.email);

    const res = await fetch(`https://www.gravatar.com/${hash.digest('hex')}.json`);
    if(!res.ok) {
        console.error("profile picture not found with associated email");
        return "";
    }
    const resJSON = await res.json();

    return resJSON.entry[0].thumbnailUrl;
    
})

UserSchema.virtual('url').get(function() {
    return (this._id);
})

module.exports = model<IUser>("User", UserSchema);