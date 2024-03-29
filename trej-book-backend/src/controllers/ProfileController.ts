import { HydratedDocument, Model, Types, UpdateWriteOpResult } from "mongoose";
import { IProfile } from "../models/Profile";
import { IUser } from "../models/User";
import { IPost } from "../models/Post"
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";


const UserModel: Model<IUser>= require('../models/User');
const ProfileModel: Model<IProfile> = require('../models/Profile');
const PostModel: Model<IPost> = require('../models/Post')

exports.getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const profile: HydratedDocument<IProfile> | null = await ProfileModel.findById(req.params.id).populate("user").populate("posts");

    if(profile) {
        const posts: HydratedDocument<IPost>[] | null = await PostModel
            .find({author: profile.user})
            .sort({dateposted: "descending"})

        if(posts)
            //@ts-expect-error
            profile.posts = posts;
    
    res.json(profile);
    } else {
        res.json({error: "profile not found"})
    }

})

exports.getFriendsFromProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const profile: HydratedDocument<IProfile> | null = await ProfileModel.findById(req.params.id).populate("friends").limit(15); 
    console.log("correct routing")
    res.json(profile?.friends);
})

exports.updateProfile = [
    body("bio")
        .optional()
        .trim()
        .escape(),

    body("profilePicURL")
        .optional()
        .isURL(),

    body("friend")
        .optional()
        .isObject(),
    
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        const hasErrors = !result.isEmpty();

        if(hasErrors) {
            const errors = result.array();
            res.json({errors: errors});

        } else {
            const fields = req.body;
            const profile: HydratedDocument<IProfile> | null = await ProfileModel.findById(req.params.id).populate("user");
            interface UpdateResponse {
                friendStatus?: object | undefined;
                success?: [string];
                updatedProfile?: HydratedDocument<IProfile> | null;
            }
            let response: UpdateResponse = {};

            if(profile && fields.friend)
                response.friendStatus = await handleFriendUpdate(profile, fields.friend);
            
            if(profile) {
                delete fields.friend;
                const updatedProfile: UpdateWriteOpResult = await ProfileModel.updateOne({_id: profile._id}, fields);
                updatedProfile ? response.updatedProfile = await ProfileModel.findById(profile._id).populate("user") : null;
            }
            console.log(response);
            res.json(response)
        }
    })       
]

export enum RequestType {
    Add = "add",
    Remove = "remove",
}

export interface FriendUpdate{
    requestType: RequestType
    id: Types.ObjectId | IUser
}

export async function handleFriendUpdate(profile: HydratedDocument<IProfile>, request : FriendUpdate) {
    const friend: HydratedDocument<IUser> | null = await UserModel.findById(request.id).populate("profile");
    console.log("Current friends list is: ", profile.friends)
    console.log("Friend to delete is: ", friend?.firstname, friend?._id)
            if(!friend)
                throw(new Error("User not found"))
            

    const friendProfile: HydratedDocument<IProfile> | null = await ProfileModel.findById(friend.profile);
            
            if(!friendProfile) 
                throw(new Error("User Profile not found"))
    
    switch (request.requestType) {
        case RequestType.Add:
            console.log(`${profile._id} adding ${friend.username}`)
            const alreadyFriends: HydratedDocument<IUser> | null = await ProfileModel.findOne({_id:profile._id, friends: friend.id})

            if(alreadyFriends)
                //@ts-ignore TS doesn't understand that the profile document was populated()
                return {error: `${friend.username} is already friends with ${profile.user.username}`}

            profile.friends.push(friend._id);
            await profile.save();
            handleFriendUpdate(friendProfile, {requestType: RequestType.Add, id:profile.user});

            return {success: [`Added friend: ${friend.username}`]}
        
        case RequestType.Remove:
            console.log(profile._id, "removing friend:", friend.profile._id)
            // Check that the id is a valid friend
            const areFriends: HydratedDocument<IUser> | null = await ProfileModel.findOne({_id:profile._id, friends: friend.id});

            if(!areFriends)
                //@ts-ignore
                return {error: `${friend.username} isn't friends with ${profile.user.username}`}
            
            console.log("before splice: ", profile.friends);
            const indexOfFriendToRemove = profile.friends.findIndex((user) => JSON.stringify(user) === JSON.stringify(friend._id));
            profile.friends.splice(indexOfFriendToRemove, 1);
            console.log("after splice:", profile.friends);
            await profile.save();
            handleFriendUpdate(friendProfile, {requestType: RequestType.Remove, id: profile.user});

            return {success: [`Removed Friend: ${friend.username}`]}
    
        default:
            break;
    }
    //throw new Error("Function not implemented.");
}
