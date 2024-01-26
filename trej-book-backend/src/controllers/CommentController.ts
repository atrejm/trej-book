import { body, param, validationResult } from "express-validator";
import asyncHandler from 'express-async-handler'
import { CONTENT_REGEX } from "../helpers/globals";
import { NextFunction, Request, Response } from "express";
import { IPost } from "../models/Post";
import { HydratedDocument, Model } from "mongoose";
import { IComment } from "../models/Comment";
import { IUser } from "../models/User";

const PostModel:Model<IPost> = require('../models/Post');
const CommentModel: Model<IComment> = require('../models/Comment')
const UserModel: Model<IUser> = require('../models/User')

exports.getAllCommentsFromPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    const post: HydratedDocument<IPost> | null = await PostModel
        .findById(req.params.postid)
        .populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        });
    console.log("id: ", req.params, post);

    res.json(post?.comments)
})

exports.createCommentByPostId = [
    body("content")
        .matches(CONTENT_REGEX),
    
    body("author"),

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = !validationResult(req).isEmpty();
        
        console.log(req.body);

        if (errors) {
            res.json(validationResult(req))
        } else {
            const post: HydratedDocument<IPost> | null = await PostModel.findById(req.params.postid);

            console.log(post);
            if(post)
            {
                const author: HydratedDocument<IUser> | null = await UserModel.findById(req.body.author._id);
                if(!author) {
                    res.json({errors: `Author not found using id: ${req.body.author._id}`})
                }

                const comment: HydratedDocument<IComment>=
                    new CommentModel({
                        author: author,
                        post: post,
                        content: req.body.content,
                    })
                    
                post.comments.push(comment);
                await comment.save();
                await post.save();
    
                res.json({
                    postID: post._id,
                    comment: comment,
                    updatedComments: post.comments})
            } else {
                res.json({error: "Post not found"});
            }
        }
    })
]

exports.getComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const comment = await CommentModel.findById(req.params.commentid);

    comment
        ?
        res.json(comment)
        :
        res.json({error: "Comment not found"})
})

exports.deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const comment = await CommentModel.findByIdAndDelete(req.params.commentid);

    comment
        ?
        res.json(comment)
        :
        res.json({error: "Comment not found"})
})