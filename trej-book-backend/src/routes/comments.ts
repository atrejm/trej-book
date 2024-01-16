import { Request, Response, NextFunction } from "express";

const { getAllCommentsFromPost, createCommentByPostId, getComment } = require("../controllers/CommentController");
const express = require("express");
var router = express.Router();

/* GET home page. */
router.get('/:postid', getAllCommentsFromPost);

router.post('/:postid', createCommentByPostId);

router.get('/:postid/:commentid', getComment)

module.exports = router;
