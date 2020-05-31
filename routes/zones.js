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
	Zone.aggregate([
		{
			'$match': {
				'id': parseInt(req.query.id)
			}
		}
	])
	.exec(function (error, zoneInfo) {
		if (error) {
			console.error(error)
		} else {
      var zoneInfo = zoneInfo[0]
			Kill.aggregate([
				{
					'$match': {
						'zoneID': parseInt(req.query.id)
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
			.exec(function (error, zoneKills) {
				if (error) {
					console.error(error)
				} else {
          console.log(zoneInfo)
					res.render('zone', { title: zoneInfo.name + ' | Zone | nbreKB', zoneKills: zoneKills, zoneInfo: zoneInfo, moment: moment });
				}
			})
		}
	})
})

module.exports = router;