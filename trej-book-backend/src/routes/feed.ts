const express = require("express");
var router = express.Router();

const { getFeed } = require("../controllers/FeedController.ts")

router.get('/:userid', getFeed)

module.exports = router;