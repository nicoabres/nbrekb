// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var moment = require('moment');

// Get our models
var Robot = require('../models/robot');
var Kill = require('../models/kill');

/* GET robot listing. */
router.get('/', function(req, res, next) {
	Robot.aggregate([
		{
			'$match': {
				'id': parseInt(req.query.id)
			}
		}
	])
	.exec(function (error, robotInfo) {
		if (error) {
			console.log(error)
		} else {
			var robotInfo = robotInfo[0]
			Kill.aggregate([
				{
					'$match': {
						'robotID': parseInt(req.query.id)
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
					'$unwind': '$robot'
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
					'$unwind': '$zone'
				}
			])
			.sort({date: 'desc'})
			.exec(function (error, robotLosses) {
				if (error) {
					console.error(error)
				} else {
					Kill.aggregate([
						{
							'$match': {
								'attackers._embedded.robot.id': parseInt(req.query.id)
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
							'$unwind': '$robot'
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
							'$unwind': '$zone'
						}
					])
					.sort({date: 'desc'})
					.exec(function (error, robotKills) {
						if (error) {
							console.error(error)
						} else {
							var robotKillingBlows = []
							robotKills.forEach(kill => {
								kill.attackers.forEach(attacker => {
									if (attacker.hasKillingBlow) {
										if (attacker._embedded.robot.id == req.query.id) {
											robotKillingBlows.push(kill)
										}
									}
								})
							})
							res.render('robot', { title: robotInfo.name + ' | Robot | nbreKB', robotInfo: robotInfo, robotLosses: robotLosses, robotKills: robotKillingBlows, moment: moment });
						}
					})
				}
			})
		}
	})
})

module.exports = router;