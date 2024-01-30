import { IRouter } from 'express';
import Router from 'express'

const { getProfile, updateProfile, getFriendsFromProfile } = require('../controllers/ProfileController')
const { getPostsFromUser } = require('../controllers/PostController');
var express = require('express');
var router: IRouter = express.Router();

router.get('/:id/friends', getFriendsFromProfile)

router.get('/:id', getProfile);

router.put('/:id', updateProfile)

module.exports = router;