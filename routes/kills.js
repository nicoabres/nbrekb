// Express related modules
var express = require('express');
var router = express.Router();

// Manually added modules
var moment = require('moment');

// Get our models
var Kill = require('../models/kill');

/* GET robot listing. */
router.get('/', function(req, res, next) {
	if (!req.query.id) {
		res.redirect('/')
	} else {
		Kill.aggregate([
			{
				'$match': {
					'id': parseInt(req.query.id)
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
		]).exec(function (error, killInfo) {
			var killInfo = killInfo[0]
			res.render('kill', {title: killInfo.robot.name + ' | ' + killInfo.agent.name + ' | nbreKB', killInfo: killInfo, moment:moment })
		})
	}
})

module.exports = router;