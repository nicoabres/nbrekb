// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var moment = require('moment');

// Get our models
var Corporation = require('../models/corporation');
var Kill = require('../models/kill');

var corporationListAggregate

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

    Corporation.aggregatePaginate({}, paginateOptions).then(function (corporations) {
      console.log(corporations)
      res.render('corporation_list', {title: 'Corporations | nbreKB', corporations: corporations})
    }).catch(function(error) {
      console.error(error)
    })
    // Corporation.find({}, function (error, corporations) {
    //   res.render('corporation_list', {title: 'Corporations | nbreKB', corporations: corporations})
    // })
  } else {
    Corporation.aggregate([
      {
        '$match': {
          id: parseInt(req.query.id)
        }
      }, {
        '$lookup': {
          'from': 'agents', 
          'localField': 'id', 
          'foreignField': 'corporationID', 
          'as': 'members'
        }
      }
    ])
    .exec(function (error, corporationInfo) {
      var corporationInfo = corporationInfo[0]
      var members = []

      corporationInfo.members.forEach(member => {
        members.push(member.id)
      })

      Kill.aggregate([
        {
          '$match': {
            '$and': [
              {
                'agentID': {
                  '$in': members
                }
              },
              {
                'corporationID': parseInt(corporationInfo.id)
              }
            ]
          }
        },
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
      .sort({date: 'desc'})
      .exec(function (error, corporationLosses) {
        if (error) {
          console.error(error)
        } else {
          Kill.aggregate([
            {
              '$match': {
                '$and': [
                  {
                    'attackers._embedded.agent.id': {
                      '$in': members
                    }
                  },
                  {
                    "attackers.hasKillingBlow": true
                  }
                ]
              }
            },
            {
              $lookup: {
                from: 'agents',
                localField: 'agentID',
                foreignField: 'id',
                as: 'agent'
              }
            },
            {
              $unwind: '$agent'
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
              $unwind: '$corporation'
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
          .sort({date: 'desc'})
          .exec(function (error, corporationKills) {
            if (error) {
              console.error(error)
            } else {
              var corporationKillingBlows = []
              corporationKills.forEach(kill => {
                kill.attackers.forEach(attacker => {
                  if (attacker.hasKillingBlow) {
                    if (members.includes(attacker._embedded.agent.id)) {
                      corporationKillingBlows.push(kill)
                    }
                  }
                })
              })
              res.render('corporation', { title: corporationInfo.name + ' | Corporation | nbreKB', corporationInfo: corporationInfo, corporationLosses:corporationLosses, corporationKills: corporationKillingBlows, moment: moment });
            }
          })
        }
      })
    })
  }
});

module.exports = router;