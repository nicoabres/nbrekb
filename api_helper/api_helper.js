// Manually added modules
var axios = require('axios');
var mongoose = require('mongoose');

// Connect to our mongodb database using mongoose
mongoose.connect('mongodb://localhost/local');

// Get our Kill model
var Kill = require('../models/kill');
var Corporation = require('../models/corporation');
var Agent = require('../models/agent');
var Robot = require('../models/robot');
var Zone = require('../models/zone');

// Start getKills function
function getKills() {
	// Get the first page of the API so we can find the last page
	var getKillboardKillData = async () => {
		try{
			return await axios.get('https://api.openperpetuum.com/killboard/kill');
		} catch (error) {
			console.error(error);
		}
	};

	// Get the last page from the first page of the API
	var getLastPage = async () => {
		var killboardKillData = await getKillboardKillData();

		return await killboardKillData.data.page_count;
	};

	// Loop thorugh all available pages of the API using the last page
	var getKillPages = async () => {
		var killPages = [];
		var lastPage = await getLastPage();
		var page = 1;

		while (page <= lastPage) {
			console.log(`Getting kill page ${page} out of ${lastPage} kill pages.`)
			var kills = await axios.get(`https://api.openperpetuum.com/killboard/kill?order-by[0][type]=field&order-by[0][field]=date&order-by[0][direction]=desc&page=${page}`);
			killPages.push(kills.data._embedded.kill);
			page++;
		}

		return killPages;
	};

	// Iterate though each page of kills and get the just the invdividual kills
	getKillPages().then(function (killPages) {
		var kills = [];

		killPages.forEach(killPage => {
			killPage.forEach(kill => {
				kills.push(kill);
			})
		})

		kills.forEach(kill => {
			var newKill = new Kill({
				uid: kill.uid,
				damageReceived: kill.damageReceived,
				date: kill.date,
				id: kill.id,
				agentID: kill._embedded.agent.id,
				corporationID: kill._embedded.corporation.id,
				robotID: kill._embedded.robot.id,
				zoneID: kill._embedded.zone.id,
				attackers: kill._embedded.attackers
			});

			Kill.find({ id: kill.id }, function(error, result) {
				if (result.length) {
					console.log('Kill already exists');
				} else {
					newKill.save(function(error) {
						if (error) {
							console.error(error);
						} else {
							console.log('Kill successfully added');
						}
					})
				}
			})
		})
	})
}
// End getKills function

// Start getCorporations function
function getCorporations() {
	// Get the first page of the API so we can find the last page
	var getKillboardCorporationData = async () => {
		try {
			return await axios.get('https://api.openperpetuum.com/killboard/corporation');
		} catch (error) {
			console.error(error);
		}
	};

	// Get the last page from the first page of the API
	var getLastPage = async () => {
		var killboardCorporationData = await getKillboardCorporationData();

		return await killboardCorporationData.page_count;
	};

	// Loop thorugh all available pages of the API using the last page
	var getCorporationPages = async () => {
		var corporationPages = [];
		var lastPage = await getLastPage();
		var page = 1;

		while (page < = lastPage) {
			console.log(`Getting corporation page ${page} out of ${lastPage} corporation pages`);
			var corporations = await axios.get(`https://api.openperpetuum.com/killboard/corporation?page=${page}`);
			corporationPages.push(corporations.data._embedded.corporation);
			page++;
		}

		return corporationPages;
	};

	getCorporationPages().then(function(corporationPages) {
		var corporations = [];

		corporationPages.forEach(corporationPage => {
			corporationPage.forEach(corporation => {
				corporations.push(corporation);
			})
		})

		corporations.forEach(corporation => {
			var newCorporation = new Corporation({
				name: corporation.name,
				id: corporation.id
			});

			Corporation.find({ id: corporation.id }, function(error, result) {
				if (result.length) {
					console.log('Corporation already exists');
				} else {
					newCorporation.save(function(error) {
						if (error) {
							console.error(error);
						} else {
							console.log('Corporation successfully added.');
						}
					})
				}
			})
		})
	})
}
// End getCorporations function

// Start getAgents function
function getAgents() {
	// Just get the first page of data so we can find the last page
	var getKillboardAgentData = async () => {
		try {
			return await axios.get('https://api.openperpetuum.com/killboard/agent');
		} catch (error) {
			console.error(error);
		}
	};

	// Get the last page from the first page of the API
	var getLastPage = async () => {
		var killboardAgentData = await getKillboardAgentData();

		return await killboardAgentData.data.page_count;
	};

	// Loop though all available pages of the API using the last page
	var getAgentPages = async () => {
		var agentPages = [];
		var lastPage = await getLastPage();
		var page =1;

		while (page <= lastPage) {
			console.log(`Getting agent page ${page} out of ${lastPage} pages`);
			var agents = await axios.get(`https://api.openperpetuum.com/killboard/agent?page=${page}`);
			agentPages.push(agents.data._embedded.agent);
			page++;
		}

		return agentPages;
	};

	// Do something with the pages
	getAgentPages().then(function(agentPages) {
		var agents = [];

		agentPages.forEach(agentPage => {
			agentPage.forEach(agent => {
				agents.push(agent);
			}
		}

		agents.forEach(agent => {
			var newAgent = new Agent({
				name: agent.name,
				id: agent.id,
				corporationID: agent._embedded.corporation.id
			});

			Agent.find({ id: agent.id }, function(error, result) {
				if (result.length) {
					console.log('Agent already exists');
				} else {
					newAgent.save(function(error) {
						if (error) {
							console.error(error);
						} else {
							console.log('Agent successfully added');
						}
					})
				}
			})
		})
	})
}
// End getAgents function

// Start getRobots function
function getRobots() {
	// Just get the first page of data so we can find the last page
	var getKillboardRobotData = async () => {
		try {
			return await axios.get('https://api.openperpetuum.com/killboard/robot');
		} catch (error) {
			console.error(error);
		}
	};

	// Get the last page from the first page of the API
	var getLastPage = async () => {
		var killboardRobotData = awit getKillboardRobotData();

		return await killboardRobotData.data.page_count;
	};

	// Loop though all available pages of the API using the last page
	var getRobotPages = async () => {
		var robotPages = [];
		var lastPage = await getLastPage();
		var page = 1;

		while (page <= lastPage) {
			console.log(`Getting robot page ${page} out of ${lastPage} robot pages`);
			var robots = await axios.get(`https://api.openperpetuum.com/killboard/robot?page=${page}`);
			robotPages.push(robots.data._embedded.robot);
			page++;
		}

		return robotPages;
	};

	// Do something with the pages
	getRobotPages().then(function(robotPages) {
		robotPages.forEach(robotPage => {
			robotPage.forEach(robot => {
				if (robot.id == 41) {
					robot.name = 'Baphomet MK2'
				} else if (robot.id == 61) {
					robot.name = 'Lithus MK2'
				} else if (robot.id == 56) {
					robot.name = 'Vagabond MK2'
				} else if (robot.id == 51) {
					robot.name = 'Termis MK2'
				} else if (robot.id == 40) {
					robot.name = 'Artemis MK2'
				} else if (robot.id == 60) {
					robot.name = 'Prometheus MK2'
				} else if (robot.id == 50) {
					robot.name = 'Yagel MK2' 
				} else if (robot.id == 55) {
					robot.name = 'Mesmer MK2'
				} else if (robot.id == 46) {
					robot.name = 'Seth MK2'
				} else if (robot.id == 45) {
					robot.name = 'Kain MK2'
				} else if (robot.id == 38) {
					robot.name = 'Cameleon MK2'
				} else if (robot.id == 43) {
					robot.name = 'Arbalest MK2'
				} else if (robot.id == 48) {
					robot.name = 'Intakt MK2'
				} else if (robot.id == 53) {
					robot.name = 'Riveler MK2'
				} else if (robot.id == 58) {
					robot.name = 'Zenith MK2'
				} else if (robot.id == 63) {
					robot.name = 'Sequer MK2'
				} else if (robot.id == 39) {
					robot.name = 'Ictus MK2'
				} else if (robot.id == 44) {
					robot.name = 'Waspish MK2'
				} else if (robot.id == 49) {
					robot.name = 'Gropho MK2'
				} else if (robot.id == 54) {
					robot.name = 'Ictus MK2'
				} else if (robot.id == 42) {
					robot.name = 'Tyrannos MK2'
				} else if (robot.id == 59) {
					robot.name = 'Symbiont MK2'
				} else if (robot.id == 47) {
					robot.name = 'Cameleon MK2'
				} else if (robot.id == 52) {
					robot.name = 'Troiar MK2'
				} else if (robot.id == 57) {
					robot.name = 'Castel MK2'
				} else if (robot.id == 62) {
					robot.name = 'Argano MK2'
				} else if (robot.id == 64) {
					robot.name = 'Arbalest PR'
				}

				robots.push(robot);
			})
		})

		robots.forEach(robot => {
			var newRobot = new Robot({
				name: robot.name,
				definition: robot.definition,
				id: robot.id
			});

			Robot.find({ id: robot.id }, function(error, result) {
				if (result.length) {
					console.log('Robot already exists');
				} else {
					newRobot.save(function(error) {
						if (error) {
							console.error(error);
						} else {
							console.log('Robot successfully added');
						}
					})
				}
			})
		})
	})
}
// End getRobots function

// Start getZones function
function getZones() {
	// Just get the first page of data so we can find the last page
	var getKillboardZoneData = async () => {
		try {
			return await axios.get('https://api.openperpetuum.com/killboard/zone');
		} catch (error) {
			console.error(error)
		}
	};

	// Get the last page from the first page of the API
	var getLastPage = async () => {
		var KillboardZoneData = await getKillboardZoneData();

		return await KillboardZoneData.data.page_count;
	};

	// Loop though all available pages of the API using the last page
	var getZonePages = async () => {
		var zonePages = [];
		var lastPage = await getLastPage();
		var page = 1;

		while (page <= lastPage) {
			console.log(`Getting zone page ${page} out of ${lastPage} zone pages`);
			var zones = await axios.get(`https://api.openperpetuum.com/killboard/zone?page=${page}`);
			zonePages.push(zones.data._embedded.zone);
			page++;
		}

		return zonePages;
	};

	// Do something with the pages
	getzonePages().then(function(zonePages) {
		var zones = [];

		zonePages.forEach(zonePage => {
			zonePage.forEach(zone => {
				zones.push(zone);
			})
		})

		zones.forEach(zone => {
			var newZone = new Zone({
				name: zone.name,
				definition: zone.definition,
				id: zone.id
			});

			Zone.find({ id: zone.id }, function(error, result) {
				if (result.length) {
					console.log('Zone already exists');
				} else {
					newZone.save(function(error) {
						if (error) {
							console.error(error);
						} else {
							console.log('Zone successfully added');
						}
					})
				}
			})
		})
	})
}

getKills();
getCorporations();
getAgents();
getZones();
getRobots();

setInterval(function() {
  getKills();
  getCorporations();
  getAgents();
  getZones();
  getRobots();
}, 600000);