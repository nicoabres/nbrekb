// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var moment = require('moment');

// Get our models
var Corporation = require('../models/corporation');
var Kill = require('../models/kill');

/* GET corporations listing. */
router.get('/', function(req, res, next) {
    res.render('zone', { title: 'Zone | nbreKB' });
})