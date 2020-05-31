// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var mongoose = require('mongoose');
var moment = require('moment');

// Get our models
var Kill = require('../models/kill');
var Agent = require('../models/agent');

// Set out aggregation query
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

      Agent.aggregatePaginate(agentListAggregate, paginateOptions).then(function (agents) {
        console.log(agents)
        res.render('agent_list', {title: 'Agents | nbreKB', agents: agents})
      }).catch(function(error) {
        console.error(error)
      })
    } else {
      Agent.aggregate([
          {
              '$match': {
                  id: parseInt(req.query.id)
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
      ])
      .exec(function (error, agentInfo) {
          if (error) {
              console.error(log)
          } else {
              var agentInfo = agentInfo[0]
              Kill.aggregate([
                  {
                      '$match': {
                          'attackers._embedded.agent.id': parseInt(agentInfo.id)
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
                      '$unwind': '$agent'
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
                      '$unwind': "$robot"
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
                      '$unwind': "$zone"
                    }
              ])
              .sort({date: 'desc'})
              .exec(function (error, agentKills) {
                  if (error) {
                      console.error(error)
                  } else {
                      var agentKillingBlows = []
                      agentKills.forEach(kill => {
                          kill.attackers.forEach(attacker => {
                              if (attacker.hasKillingBlow) {
                                  if (agentInfo.id == attacker._embedded.agent.id) {
                                      agentKillingBlows.push(kill)
                                  }
                              }
                          })
                      })
                      
                      Kill.aggregate([
                          {
                              '$match': {
                                  'agentID': agentInfo.id
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
                              '$unwind': "$agent"
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
                              '$unwind': "$corporation"
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
                              '$unwind': "$robot"
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
                              '$unwind': "$zone"
                          }
                      ])
                      .sort({date: 'desc'})
                      .exec(function (error, agentLosses) {
                          if (error) {
                              console.error(error)
                          } else {
                              res.render('agent', {title: agentInfo.name + ' | Agent | nbreKB', agentInfo: agentInfo, agentKillingBlows: agentKillingBlows, agentLosses: agentLosses, moment:moment })
                          }
                      })
                  }
              })
          }
      })
    }
});

module.exports = router;
