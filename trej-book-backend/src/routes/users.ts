import { IRouter } from 'express';
import Router from 'express'

const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/UserController.ts')
const { getPostsFromUser } = require('../controllers/PostController.ts');
var express = require('express');
var router: IRouter = express.Router();

/* GET home page. */
router.get('/', getAllUsers);

router.post('/', createUser);

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser)

//router.get('/:id/posts', getPostsFromUser)

module.exports = router;
