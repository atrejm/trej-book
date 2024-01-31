import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { IUser } from "./models/User";
import { JwtPayload } from "jsonwebtoken";
import { DoneCallback } from "passport";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var chatRouter = require('./routes/chat');
var profileRouter = require('./routes/profile');
var feedRouter = require('./routes/feed');


require('dotenv').config();

const UserModel: Model<IUser> = require('./models/User')
var passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
}
passport.use(new JwtStrategy(opts, async function(jwt_payload: JwtPayload, done: DoneCallback) {
  try {
    const user = await UserModel.findById(jwt_payload.sub);

    if(user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false); 
  }
}))


// connect mongoose to MongoDB
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_DB);
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var cors = require('cors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options('/', cors())
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/chat', chatRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/feed', feedRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
interface ResponseError extends Error {
  status?: number;
}
app.use(function(err: ResponseError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
