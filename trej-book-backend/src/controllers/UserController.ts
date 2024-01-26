import { Express, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { IUser } from '../models/User';
import { IProfile } from '../models/Profile';
import { body, validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';
import { RequestType, handleFriendUpdate } from './ProfileController';

const UserModel: Model<IUser>= require('../models/User');
const ProfileModel: Model<IProfile> = require('../models/Profile');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAllUsers= asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users: Array<IUser> = await UserModel.find({}).populate("profile");

    res.json({ users: users });
})

exports.getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser | null= await UserModel.findById(req.params.id).populate("profile");

    if (user) {
        res.json({ user: user });
    } else {
        res.json( {error: "User not found"})
    }
})

exports.createUser = [
    body("firstname")
        .trim()
        .isAlpha()
        .withMessage("Invalid First Name"),
    
    body("lastname")
        .trim()
        .isAlpha()
        .withMessage("Invalid Last Name"),
    
    body("username")
        .trim()
        .isAlphanumeric()
        .withMessage("Only Alphanumberic characters allowed in username")
        .isLength({min: 5, max: 25})
        .withMessage("Minimum user length is 5 characters"),
    
    body("password")
        .trim()
        .isAlphanumeric()
        .withMessage("Only Alphanumeric characters allowed in password"),
    
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid Email"),
    
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        const hasErrors = !result.isEmpty();
        console.log(result);


        if(hasErrors) {
            const errors = result.array();
            res.json({errors: errors});

        } else {
            console.log(req.body);
            const fields = req.body
            const userAlreadyExists = await UserModel.findOne({username: fields.username});
            if(userAlreadyExists) {
                res.json({errors: [{msg: "User already exists"}]})
                return;
            }
            const bCryptedPass = await bcrypt.hash(fields.password, 10);
            const user: HydratedDocument<IUser>= new UserModel({
                firstname: fields.firstname,
                lastname: fields.lastname,
                username: fields.username,
                password: bCryptedPass,
                email: fields.email,
                chats: [],
                profile: null
            });

            const url = await user.thumbnailURL;
            let thumbnailURL: string;
            if(url) {
                console.log(url);
                thumbnailURL = url;
            } else {
                thumbnailURL = "";
            }

            const profile: HydratedDocument<IProfile> = new ProfileModel({
                user: user._id,
                friends: [],
                bio: "",
                profilePicURL: thumbnailURL,
                posts: []
            });

            user.profile = profile._id;

            await user.save();
            await profile.save();

            res.json({success: {user: user, profile: profile}})
        }
    })       
]

exports.updateUser = [
    body("firstname")
        .optional()
        .notEmpty()
        .withMessage("First Name Can't be Empty")
        .trim()
        .isAlpha()
        .withMessage("Invalid First Name"),
    
    body("lastname")
        .optional()
        .notEmpty()
        .withMessage("Last Name Can't be Empty")
        .trim()
        .isAlpha()
        .withMessage("Invalid Last Name"),
    
    body("username")
        .optional()
        .notEmpty()
        .withMessage("Username Can't be Empty")
        .trim()
        .isAlphanumeric()
        .withMessage("Only Alphanumberic characters allowed in username"),
    
    body("password")
        .optional()
        .notEmpty()
        .withMessage("Password Can't be Empty")
        .trim()
        .isAlphanumeric()
        .withMessage("Only Alphanumeric characters allowed in password"),
    
    body("email")
        .optional()
        .notEmpty()
        .withMessage("Email Can't be Empty")    
        .trim()
        .isEmail()
        .withMessage("Invalid Email"),
    
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    /* Update User Info
    body: {
        {
            field: field1,
            newContent: content 
        },
        ...
    }*/
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();

    if(hasErrors) {
        const errors = result.array();
        res.json({errors: errors});

    } else {
        console.log(req.body);
        const update = req.body;
        const user = await UserModel.findOneAndUpdate({_id: req.params.id}, update);

        res.json({success: {updatedUser: user}})
    }
})]

exports.deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user : HydratedDocument<IUser> | null = await UserModel.findById(req.params.id).populate("profile");
    if (user) {
        //@ts-ignore ts doesn't understand the profile field is populated
        for await (const friend:HydratedDocument<User> of user.profile.friends) {
            const friendProfile = await ProfileModel.findOne({user:friend});
            if(friendProfile)
                await handleFriendUpdate(friendProfile, {requestType:RequestType.Remove, id: user._id})
        }

        await ProfileModel.deleteOne({_id: user.profile});
        await UserModel.deleteOne({_id: user._id});
        res.json({success: `Delete user: ${user.username}`});
    } else {
        res.json({ error: new Error(`Couldn't delete user with id ${req.params.id}`)})
    }
})

exports.login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const user = await UserModel.findOne({username: req.body.username}).populate("profile");
    
    if(!user) {
        res.json({error: "User not found"});
    } else {
        bcrypt.compare(req.body.password, user.password, (err, auth) => {
            if (auth === true) {
                const token = jwt.sign({sub: user._id}, process.env.SECRET_KEY)
                console.log("Getting user: ", user);
                res.json({
                    token: token,
                    user: user})
            } else {
                res.json({error: "Incorect password"});
            }
        })
    }
})