// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var moment = require('moment');

// Get our models
var Zone = require('../models/zone');
var Kill = require('../models/kill');

/* GET corporations listing. */
router.get('/', function(req, res, next) {
  if (!req.query.id) {
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

    var zoneListAggregate = Zone.aggregate([
      {
        '$sort': {'name': 1}
      }
    ])

    Kill.find({}, function (error, kills) {
      Zone.aggregatePaginate(zoneListAggregate, paginateOptions).then(function (zones) {
        res.render('zone_list', { title: 'Zones | nbreKB', zones: zones, kills: kills})
      })
    })
  } else {
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
        '$match': {
          '$or': [
            {'zoneID': parseInt(req.query.id)},
            {'attackers._embedded.zone.id': parseInt(req.query.id)}
          ]
        }
      },
      {
        '$sort': {
          'date': -1
        }
      },
      {
        '$lookup': {
          'from': 'agents',
          'localField': 'agentID',
          'foreignField': 'id',
          'as': 'agent'
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

    Zone.aggregate([
      {
        '$match': {
          'id': parseInt(req.query.id)
        }
      }
    ]).exec(function (error, zoneInfo) {
      var zoneInfo = zoneInfo[0]

      Kill.countDocuments({'zoneID': parseInt(req.query.id)}).then(function (totalLosses) {
        Kill.countDocuments({'attackers._embedded.zone.id': parseInt(req.query.id)}).then(function (totalKills) {
          Kill.aggregatePaginate(killListAggregate, paginateOptions).then(function (kills) {
            res.render('zone', {title: zoneInfo.name + ' | Agent | nbreKB', kills: kills, zoneInfo: zoneInfo, totalLosses: totalLosses, totalKills: totalKills, moment: moment})
          })
        })
      })
    })
  }
})

module.exports = router;