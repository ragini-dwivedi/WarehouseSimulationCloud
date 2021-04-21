let express = require('express');
// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
AWS.config.apiVersions = {
    robomaker: '2018-06-29'
};
let robo_maker = new AWS.RoboMaker();
let router = express.Router();

/* GET Create aws credentials. */
router.get('/get_simulation', function(req, res, next) {
    let params = {
        maxResults: '10'
    };

    robo_maker.listSimulationJobs(params, function(err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            result = [];
            for (i = 0; i < data.simulationJobSummaries.length; i++){
                if (data.simulationJobSummaries[i].robotApplicationNames[0] == "deliverychallenge_robot"){
                    result[i] = data.simulationJobSummaries[i];
                }
            }

            res.send({
                message: {
                    simulations: result,
                    account_id: 257034989243,
                    error: null
                }
            })
        }
    });
});

/* POST Create aws credentials. */
router.post('/start_simulation', function(req, res, next) {
    let params = {
        UserName: req.body.username
    };
});

/* POST Create aws credentials. */
router.post('/stop_simulation', function(req, res, next) {
    let params = {
        UserName: req.body.username
    };
});

/* GET Create aws credentials. */
router.get('/list_robots', function(req, res, next) {
    let params = {
        maxResults: '10'
    };

    robo_maker.listRobotApplications(params, function(err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            result = [];
            for (i = 0; i < data.robotApplicationSummaries.length; i++){
                if (data.robotApplicationSummaries[i].name == "deliverychallenge_robot"){
                    result[i] = data.robotApplicationSummaries[i];
                }
            }

            res.send({
                message: {
                    simulations: result,
                    account_id: 257034989243,
                    error: null
                }
            })
        }
    });
});




module.exports = router;