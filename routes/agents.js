// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var mongoose = require('mongoose');
var moment = require('moment');

// Get our models
var Kill = require('../models/kill');
var Agent = require('../models/agent');

/* GET agents page. */
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

    var agentListAggregate = Agent.aggregate([
      {
        '$lookup': {
            'from': 'corporations',
            'localField': 'corporationID',
            'foreignField': 'id',
            'as': 'corporation'
        }
      },
      {
        '$unwind': '$corporation'
      }
    ])

    Agent.aggregatePaginate(agentListAggregate, paginateOptions).then(function (agents) {
      res.render('agent_list', {title: 'Agents | nbreKB', agents: agents})
    }).catch(function(error) {
      console.error(error)
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
            {
              'agentID': parseInt(req.query.id)
            },
            {
              'attackers._embedded.agent.id': parseInt(req.query.id)
            }
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

    Agent.aggregate([
      {
        '$match': {
          'id': parseInt(req.query.id)
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
        '$unwind': '$corporation'
      }
    ]).exec(function (error, agentInfo) {
      var agentInfo = agentInfo[0]
      Kill.aggregatePaginate(killListAggregate, paginateOptions).then(function (kills) {
        res.render('agent', {title: agentInfo.name + ' | Agent | nbreKB', kills: kills, agentInfo: agentInfo, moment: moment})
      })
    })
  }
});

module.exports = router;
