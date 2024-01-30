import { IRouter } from 'express';
import Router from 'express'

const { getAllUsers, getUser, createUser, updateUser, deleteUser, login } = require('../controllers/UserController')
const { getPostsFromUser } = require('../controllers/PostController');
var express = require('express');
var router: IRouter = express.Router();

/* GET home page. */
router.get('/', getAllUsers);

router.post('/login', login);

router.post('/', createUser);

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser)

//router.get('/:id/posts', getPostsFromUser)

module.exports = router;
