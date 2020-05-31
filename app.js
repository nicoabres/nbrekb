// Express related modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Manually added modules
var axios = require('axios');
var mongoose = require('mongoose');

// Connect to our mongodb database using mongoose
mongoose.connect('mongodb://localhost/local');

// Get our Kill model
var Kill = require('./models/kill');
var Corporation = require('./models/corporation');
var Agent = require('./models/agent');
var Robot = require('./models/robot');
var Zone = require('./models/zone');

// Get all kills from OP API
function getKills() {
  // Just get the first page of data so we can find the last page
  var getKillboardKillData = async () => {
    try {
      return await axios.get('https://api.openperpetuum.com/killboard/kill')
    } catch (error) {
      console.error(error)
    }
  }

  // Get the last page from the first page of the API
  var getLastPage = async () => {
    var killboardKillData = await getKillboardKillData();

    return await killboardKillData.data.page_count;
  }

  // Loop though all available pages of the API using the last page
  var getKillPages = async () => {
    var killPages = [];
    var lastPage = await getLastPage();
    var page = 1;

    while (page <= lastPage) {
      console.log(`Getting kill page ${page} out of ${lastPage} kill pages`);
      var kills = await axios.get(`https://api.openperpetuum.com/killboard/kill?order-by[0][type]=field&order-by[0][field]=date&order-by[0][direction]=desc&page=${page}`);
      killPages.push(kills.data._embedded.kill);
      page++;
    };

    return killPages;
  };

  // Do something with the pages
  getKillPages().then(function(killPages) {
    var kills = [];

    killPages.forEach(killPage => {
      killPage.forEach(kill => {
        kills.push(kill);
      });
    });

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
      })

      Kill.find({ id: kill.id }, function(error, result) {
        if (result.length) {
          console.log('Kill already exists')
        } else {
          newKill.save(function(error) {
            if (error) {
              console.error(error)
            } else {
              console.log('Kill successfuly added')
            }
          })
        }
      })
    })
  });
};

// Get all corporations from OP API
function getCorporations() {
  // Just get the first page of data so we can find the last page
  var getKillboardCorporationData = async () => {
    try {
      return await axios.get('https://api.openperpetuum.com/killboard/corporation')
    } catch (error) {
      console.error(error)
    }
  }

  // Get the last page from the first page of the API
  var getLastPage = async () => {
    var killboardCorporationData = await getKillboardCorporationData();

    return await killboardCorporationData.data.page_count;
  }

  // Loop though all available pages of the API using the last page
  var getCorporationPages = async () => {
    var corporationPages = [];
    var lastPage = await getLastPage();
    var page = 1;

    while (page <= lastPage) {
      console.log(`Getting corporation page ${page} out of ${lastPage} corporation pages`);
      var corporations = await axios.get(`https://api.openperpetuum.com/killboard/corporation?page=${page}`);
      corporationPages.push(corporations.data._embedded.corporation);
      page++;
    };

    return corporationPages;
  };

  // Do something with the pages
  getCorporationPages().then(function(corporationPages) {
    var corporations = [];

    corporationPages.forEach(corporationPage => {
      corporationPage.forEach(corporation => {
        corporations.push(corporation);
      });
    });

    corporations.forEach(corporation => {
      var newCorporation = new Corporation({
        name: corporation.name,
        id: corporation.id
      })

      Corporation.find({ id: corporation.id }, function(error, result) {
        if (result.length) {
          console.log('Corporation already exists')
        } else {
          newCorporation.save(function(error) {
            if (error) {
              console.error(error)
            } else {
              console.log('Corporation successfuly added')
            }
          })
        }
      })
    })
  });
}

// Get all agents from OP API
function getAgents() {
  // Just get the first page of data so we can find the last page
  var getKillboardAgentData = async () => {
    try {
      return await axios.get('https://api.openperpetuum.com/killboard/agent')
    } catch (error) {
      console.error(error)
    }
  }

  // Get the last page from the first page of the API
  var getLastPage = async () => {
    var killboardAgentData = await getKillboardAgentData();

    return await killboardAgentData.data.page_count;
  }

  // Loop though all available pages of the API using the last page
  var getAgentPages = async () => {
    var agentPages = [];
    var lastPage = await getLastPage();
    var page = 1;

    while (page <= lastPage) {
      console.log(`Getting agent page ${page} out of ${lastPage} pages`);
      var agents = await axios.get(`https://api.openperpetuum.com/killboard/agent?page=${page}`);
      agentPages.push(agents.data._embedded.agent);
      page++;
    };

    return agentPages;
  };

  // Do something with the pages
  getAgentPages().then(function(agentPages) {
    var agents = [];

    agentPages.forEach(agentPage => {
      agentPage.forEach(agent => {
        agents.push(agent);
      });
    });

    agents.forEach(agent => {
      var newAgent = new Agent({
        name: agent.name,
        id: agent.id,
        corporationID: agent._embedded.corporation.id
      })

      Agent.find({ id: agent.id }, function(error, result) {
        if (result.length) {
          console.log('Agent already exists')
        } else {
          newAgent.save(function(error) {
            if (error) {
              console.error(error)
            } else {
              console.log('Agent successfuly added')
            }
          })
        }
      })
    })
  });
};

// Get all robots from OP API
function getRobots() {
  // Just get the first page of data so we can find the last page
  var getKillboardRobotData = async () => {
    try {
      return await axios.get('https://api.openperpetuum.com/killboard/robot')
    } catch (error) {
      console.error(error)
    }
  }

  // Get the last page from the first page of the API
  var getLastPage = async () => {
    var killboardRobotData = await getKillboardRobotData();

    return await killboardRobotData.data.page_count;
  }

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
    };

    return robotPages;
  };

  // Do something with the pages
  getRobotPages().then(function(robotPages) {
    var robots = [];

    robotPages.forEach(robotPage => {
      robotPage.forEach(robot => {
        robots.push(robot);
      });
    });

    robots.forEach(robot => {
      var newRobot = new Robot({
        name: robot.name,
        definition: robot.definition,
        id: robot.id
      })

      Robot.find({ id: robot.id }, function(error, result) {
        if (result.length) {
          console.log('Robot already exists')
        } else {
          newRobot.save(function(error) {
            if (error) {
              console.error(error)
            } else {
              console.log('Robot successfuly added')
            }
          })
        }
      })
    })
  });
};

// Get all zones from OP API
function getZones() {
  // Just get the first page of data so we can find the last page
  var getKillboardZoneData = async () => {
    try {
      return await axios.get('https://api.openperpetuum.com/killboard/zone')
    } catch (error) {
      console.error(error)
    }
  }

  // Get the last page from the first page of the API
  var getLastPage = async () => {
    var killboardZoneData = await getKillboardZoneData();

    return await killboardZoneData.data.page_count;
  }

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
    };

    return zonePages;
  };

  // Do something with the pages
  getZonePages().then(function(zonePages) {
    var zones = [];

    zonePages.forEach(zonePage => {
      zonePage.forEach(zone => {
        zones.push(zone);
      });
    });

    zones.forEach(zone => {
      var newZone = new Zone({
        name: zone.name,
        definition: zone.definition,
        id: zone.id
      })

      Zone.find({ id: zone.id }, function(error, result) {
        if (result.length) {
          console.log('Zone already exists')
        } else {
          newZone.save(function(error) {
            if (error) {
              console.error(error)
            } else {
              console.log('Zone successfuly added')
            }
          })
        }
      })
    })
  });
};

setInterval(function() {
  getKills();
  getCorporations();
  getAgents();
  getRobots();
  getZones();
}, 600000);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var corporationsRouter = require('./routes/corporations');
var agentsRouter = require('./routes/agents');
var zonesRouter = require('./routes/zones');
var robotsRouter = require('./routes/robots');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/corporations', corporationsRouter);
app.use('/agents', agentsRouter);
app.use('/zones', zonesRouter);
app.use('/robots', robotsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
