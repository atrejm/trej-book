import { IRouter } from 'express';
import Router from 'express'

const { getProfile, updateProfile } = require('../controllers/ProfileController.ts')
const { getPostsFromUser } = require('../controllers/PostController.ts');
var express = require('express');
var router: IRouter = express.Router();

router.get('/:id', getProfile);

router.put('/:id', updateProfile)

module.exports = router;