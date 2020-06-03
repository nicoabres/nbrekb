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

		var robotListAggregate = Robot.aggregate([
			{
				'$sort': {'name': 1}
			}
		])

		Kill.find({}, function (error, kills) {
			Robot.aggregatePaginate(robotListAggregate, paginateOptions).then(function (robots) {
				res.render('robot_list', { title: 'Robots | nbreKB', robots: robots, kills: kills})
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
				  {'robotID': parseInt(req.query.id)},
				  {'attackers._embedded.robot.id': parseInt(req.query.id)}
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

		Robot.aggregate([
			{
				'$match': {
					'id': parseInt(req.query.id)
				}
			}
		]).exec(function (error, robotInfo) {
			var robotInfo = robotInfo[0]

			Kill.countDocuments({'robotID': parseInt(req.query.id)}).then(function (totalLosses) {
				Kill.countDocuments({'attackers._embedded.robot.id': parseInt(req.query.id)}).then(function (totalKills) {
					Kill.aggregatePaginate(killListAggregate, paginateOptions).then(function (kills) {
						res.render('robot', {title: robotInfo.name + ' | Agent | nbreKB', kills: kills, robotInfo: robotInfo, totalLosses: totalLosses, totalKills: totalKills, moment: moment})
					})
				})
			})
		})
	}
})

module.exports = router;