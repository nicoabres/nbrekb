// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var mongoose = require('mongoose');
var moment = require('moment');

// Get our Kill model
var Kill = require('../models/kill');

/* GET home page. */
router.get('/', function(req, res, next) {
  Kill.aggregate([
    {
      $lookup: {
        from: 'agents',
        localField: 'agentID',
        foreignField: 'id',
        as: 'agent'
      }
    },
    {
      $unwind: "$agent"
    },
    {
      $lookup: {
        from: 'corporations',
        localField: 'corporationID',
        foreignField: 'id',
        as: 'corporation'
      }
    },
    {
      $unwind: "$corporation"
    },
    {
      $lookup: {
        from: 'robots',
        localField: 'robotID',
        foreignField: 'id',
        as: 'robot'
      }
    },
    {
      $unwind: "$robot"
    },
    {
      $lookup: {
        from: 'zones',
        localField: 'zoneID',
        foreignField: 'id',
        as: 'zone'
      }
    },
    {
      $unwind: "$zone"
    }
  ])
  .limit(10)
  .sort({date: 'desc'})
  .exec(function (error, results) {
    if (error) {
      console.error(error)
    } else {
      res.render('index', { title: 'Home | nbreKB', kills: results, moment: moment});
    }
  })
});

module.exports = router;
