import { Express, Request, Response, NextFunction, response } from 'express'
import asyncHandler from "express-async-handler"
import { Model } from 'mongoose';
import { IUser } from '../models/User';
import { IProfile } from '../models/Profile';
import { IPost } from '../models/Post';
import { ObjectId } from 'mongodb';

const UserModel: Model<IUser> = require("../models/User");
const ProfileModel: Model<IProfile> = require("../models/Profile")
const PostModel: Model<IPost> = require("../models/Post")

exports.getFeed = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //@ts-expect-error
    const { friends } : { friends : ObjectId[]} = await ProfileModel.findOne({user : req.params.userid}, "friends");
    console.log([...friends, new ObjectId(req.params.userid)]);
    const posts = await PostModel
        .find({author:{$in: [...friends, new ObjectId(req.params.userid)]}})
        .sort({dateposted: 'descending'})
        .limit(20);

    res.json(posts)
})