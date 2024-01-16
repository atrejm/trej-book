import { Request, Response, NextFunction } from "express";

const express = require("express");
var router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.json({ title: 'index' });
});


module.exports = router;

export {}