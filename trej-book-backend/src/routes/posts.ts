import { Request, Response, NextFunction } from "express";
import passport from "passport";

const express = require("express");
var router = express.Router();

const { getPostsFromUser, getPost, createPost, deletePost, updatePost } = require('../controllers/PostController')

/* GET home page. */

router.get('/:profileid/', getPostsFromUser);

router.post('/:profileid/', passport.authenticate('jwt', {session: false}), createPost)

router.get('/:profileid/posts/:postid', getPost);

router.delete('/:id', deletePost)

router.put('/:id', updatePost)


module.exports = router;
