// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var moment = require('moment');

// Get our models
var Corporation = require('../models/corporation');
var Kill = require('../models/kill');

/* POST corporations listing. */
router.post('/', function(req, res, next) {
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

  var corporationListAggregate = Corporation.aggregate([
    {
      '$match': {
        'name': {'$regex': req.body.searchEntry.toString(), '$options': 'i'}
      }
    },
    {
      '$sort': {'name': 1}
    }
  ])

  Kill.find({}, function(error, kills) {
    Corporation.aggregatePaginate(corporationListAggregate, paginateOptions).then(function (corporations) {
      res.render('corporation_list', {title: 'Corporations | nbreKB', corporations: corporations, kills: kills, searchEntry: req.body.searchEntry})
    })
  })
})

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

    var corporationListAggregate = Corporation.aggregate([
      {
        '$sort': {'name': 1}
      }
    ])

    Kill.find({}, function (error, kills) {
      Corporation.aggregatePaginate(corporationListAggregate, paginateOptions).then(function (corporations) {
        res.render('corporation_list', {title: 'Corporations | nbreKB', corporations: corporations, kills: kills})
      }).catch(function(error) {
        console.error(error)
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

    Corporation.aggregate([
      {
        '$match': {
          'id': parseInt(req.query.id)
        }
      },
      {
        '$lookup': {
          'from': 'agents',
          'localField': 'id',
          'foreignField': 'corporationID',
          'as': 'members'
        }
      }
    ]).exec(function (error, corporationInfo) {
      var corporationInfo = corporationInfo[0]
      var members = []

      corporationInfo.members.forEach(member => {
        members.push(member.id)
      })

      var killListAggregate = Kill.aggregate([
        {
          '$match': {
            '$or': [
              {'corporationID': parseInt(req.query.id)},
              {'attackers._embedded.agent.id': {'$in': members}}
            ]
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
        },
        {
          '$sort': {'date': -1}
        }
      ])

      Kill.countDocuments({'corporationID': parseInt(req.query.id)}).then(function (totalLosses) {
        Kill.countDocuments({'attackers._embedded.agent.id': {'$in': members}}).then(function(totalKills) {
          Kill.aggregatePaginate(killListAggregate, paginateOptions).then(function (kills) {
            res.render('corporation', { title: corporationInfo.name + ' | Corporation | nbreKB', corporationInfo: corporationInfo, kills: kills, moment: moment, totalLosses: totalLosses, totalKills: totalKills });
          })
        })
      })
    })
  }
});

/* GET agents page. */
router.get('/stats', function(req, res, next) {
  res.render('corporation_stats', {title: 'Corporation Stats | nbreKB'});
})

module.exports = router;