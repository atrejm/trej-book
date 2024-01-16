import { body, param, validationResult } from "express-validator";
import asyncHandler from 'express-async-handler'
import { CONTENT_REGEX } from "../helpers/globals";
import { NextFunction, Request, Response } from "express";
import { IPost } from "../models/Post";
import { HydratedDocument, Model } from "mongoose";
import { IComment } from "../models/Comment";

const PostModel:Model<IPost> = require('../models/Post');
const CommentModel: Model<IComment> = require('../models/Comment')

exports.getAllCommentsFromPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    const post: HydratedDocument<IPost> | null = await PostModel.findById(req.params.postid, "title comments");
    console.log("id: ", req.params, post);

    res.json({
        post: post,
        comments: post?.comments
    })
})

exports.createCommentByPostId = [
    body("content")
        .matches(CONTENT_REGEX),

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = !validationResult(req).isEmpty();
        
        if (errors) {
            res.json({errors: errors})
        } else {
            const post: HydratedDocument<IPost> | null = await PostModel.findById(req.params.postid);

            if(post)
            {
                const comment: HydratedDocument<IComment>=
                    new CommentModel({
                        author: post.author,
                        post: post,
                        content: req.body.content,
                    })
                    
                post.comments.push(comment);
                await comment.save();
                await post.save();
    
                res.json({
                    postID: post._id,
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