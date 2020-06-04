// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var mongoose = require('mongoose');
var moment = require('moment');

// Get our models
var Kill = require('../models/kill');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.query.page) {
    var paginateOptions = {
      page: 1,
      limit: 10
    }
  } else {
    var paginateOptions = {
      page: req.query.page,
      limit: req.query.limit
    }
  }

  var killListAggregate = Kill.aggregate([
    {
      '$lookup': {
        'from': 'agents',
        'localField': 'agentID',
        'foreignField': 'id',
        'as': 'agent'
      }
    },
    {
      '$sort': {
        'date': -1
      }
    },
    {
      '$lookup': {
        'from': 'corporations',
        'localField': 'corporationID',
        'foreignField': 'id',
        'as': 'corporation'
      }
    },
    {
      '$lookup': {
        'from': 'robots',
        'localField': 'robotID',
        'foreignField': 'id',
        'as': 'robot'
      }
    },
    {
      '$lookup': {
        'from': 'zones',
        'localField': 'zoneID',
        'foreignField': 'id',
        'as': 'zone'
      }
    },
    {
      '$unwind': '$agent'
    },
    {
      '$unwind': '$corporation'
    },
    {
      '$unwind': '$robot'
    },
    {
      '$unwind': '$zone'
    }
  ])

  Kill.aggregatePaginate(killListAggregate, paginateOptions).then(function (kills) {
    res.render('index', {title: 'Home | nbreKB', kills: kills, moment: moment})
  })
});

module.exports = router;
