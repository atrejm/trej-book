import { Express, Request, Response, NextFunction, response } from 'express'
import asyncHandler from "express-async-handler"
import { HydratedDocument, Model, PopulatedDoc } from 'mongoose';
import { IUser } from '../models/User';
import { body, validationResult } from 'express-validator'
import { IPost } from '../models/Post';
import { IProfile } from '../models/Profile';
import { ObjectId } from 'mongodb';
import { IComment } from '../models/Comment';

const UserModel: Model<IUser> = require('../models/User');
const PostModel: Model<IPost> = require('../models/Post');
const ProfileModel: Model<IProfile> = require('../models/Profile');

exports.getPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const post = await PostModel.findById(req.params.postid);

    post?
        res.json(post)
        :
        res.json({error: "Post not found"})
        
})

exports.getPostsFromUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("getting posts from user", req.params)
    const user = await UserModel.findById(req.params.profileid);
    // const profile: HydratedDocument<IProfile> | null = await ProfileModel
    //     .findById(req.params.profileid)
    //     .populate("posts")
    //     .sort({dateposted: 'descending'});

    const posts: HydratedDocument<IPost>[] | null = await PostModel
        .find({author: user?.id})
        .sort({dateposted: "descending"})
    
    user?
        res.json({ 
            user: user,
            posts: posts 
        })
    :
        res.json({
            error: "Profile not found, this request requires a User ID, or the provided User has not created a profile yet"
        });
})

exports.createPost = [
    body("title")
        .trim()
        .matches(/^[A-Za-z0-9 .,'!&?%]+$/),
    
    body("content")
        .trim()
        .matches(/^[A-Za-z0-9 .,'!&?%]+$/),
    
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        const hasErrors = !result.isEmpty();
        console.log("Processing request with body:", req.body)
        
        if(hasErrors) {
            res.json({error: result.array()})
        } else {        
            const user: HydratedDocument<IUser> | null = await UserModel.findOne({profile: req.params.profileid});
            const userProfile: HydratedDocument<IProfile> | null = await ProfileModel.findById(user?.profile);
            
            if(!user || !userProfile) {
                res.json({error: "User not found"})
            } else {
                //@ts-ignore
                if(user.id !== req.user.id) {
                    throw(new Error("Unauthorized"));
                }

                const post: HydratedDocument<IPost> = new PostModel({
                    author: user,
                    title: req.body.title,
                    content: req.body.content
                })

                userProfile.posts.push(post._id);

                await Promise.all([
                    user.save(),
                    userProfile.save(),
                    post.save()
                ])
                
                res.json({created: post})
            }
        }
})]

exports.deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const post = await PostModel.findById(req.params.id)
                                    .populate<{ author: {profile: IProfile} }>({
                                        path: 'author',
                                        populate: {
                                            path: 'profile'
                                        }
                                    })
                                    .exec()
    //const user = await UserModel.findById(post?.author).populate("profile");
    if (post) {
        // This block searchest through the post's author document to delete the post from their list of posts
        const posts = post.author.profile.posts;
        console.log(post.author.profile.posts, post._id)
        const indexToDelete = posts.findIndex((element) => JSON.stringify(element) === JSON.stringify(post._id)
        )
        console.log(indexToDelete);
        if(indexToDelete >= 0) {
            posts.splice(indexToDelete, 1)
            const update = {posts: posts}
            console.log(update);
            await PostModel.findByIdAndDelete(post._id)
            const profile = await ProfileModel.findOneAndUpdate({_id:post.author.profile}, update);
        }
    }

    res.json({deleted: post});
})

interface PostUpdate {
    title: string,
    content: string,
    published: boolean,
    rating: number,
    comments: [IComment]
}

exports.updatePost = [
    body("title")
        .optional()
        .trim()
        .matches(/^[A-Za-z0-9 .,'!&?%]+$/),
    
    body("content")
        .optional()
        .trim()
        .matches(/^[A-Za-z0-9 .,'!&?%]+$/),

    body("published")
        .optional() 
        .isBoolean(),

    body("rating")
        .optional()
        .isNumeric(),

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        console.log("Editing Post");
        const result = validationResult(req);
        const errors = !result.isEmpty()

        if(errors) {
            res.json({ errors: result.array() });
        } else {
            const update: PostUpdate = req.body;
            await PostModel.findByIdAndUpdate(req.params.id, update);
            const post: HydratedDocument<IPost> | null = await PostModel.findById(req.params.id);

            res.json({ updatedPost: post})
        }
})]