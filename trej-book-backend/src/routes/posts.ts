import { Request, Response, NextFunction } from "express";

const express = require("express");
var router = express.Router();

const { getPostsFromUser, getPost, createPost, deletePost, updatePost } = require('../controllers/PostController.ts')

/* GET home page. */

router.get('/:profileid/', getPostsFromUser);

router.post('/:profileid/', createPost)

router.get('/:profileid/posts/:postid', getPost);

router.delete('/:id', deletePost)

router.put('/:id', updatePost)


module.exports = router;
