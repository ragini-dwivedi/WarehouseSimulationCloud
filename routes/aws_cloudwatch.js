let express = require('express');
// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
AWS.config.apiVersions = {
    cloudwatchlogs: '2014-03-28',
    // other service API versions
};

let cloudwatchlogs = new AWS.CloudWatchLogs();
let router = express.Router();

/* GET get simulation logs based on filter. */
router.get('/get_simulation_logs/:simulationName', function(req, res, next) {
    let params = {
        logGroupName: '/aws/robomaker/SimulationJobs',
        descending: true,
        limit: '50',
        logStreamNamePrefix: req.params.simulationName
    };

    cloudwatchlogs.describeLogStreams(params, function(err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            res.send({
                message: data,
                error: null
            })
        }
    });
});

/* GET get simulation logs based on filter. */
router.get('/view_simulation_logs/:simulationName', function(req, res, next) {
    let params = {
        logGroupName: '/aws/robomaker/SimulationJobs',
        descending: true,
        limit: '50',
        logStreamNamePrefix: req.params.simulationName
    };

    cloudwatchlogs.describeLogStreams(params, function(err, data) {
        if (err) {
            res.render('view_simulation_logs', { message: err, error: err.stack, simulation_id: req.params.simulationName });
        } else {
            res.render('view_simulation_logs', { message: data, error: null, simulation_id: req.params.simulationName });
        }
    });
});


/* POST get log events from stream name. */
router.post('/get_logs_events', function(req, res, next) {
    let streamName = req.body.streamName;
    let simulationName = req.body.simulationName;
    let params = {
        logGroupName: '/aws/robomaker/SimulationJobs',
        logStreamName: streamName + "/" + simulationName + "/simulation-deliverychallenge_sumulation/SimulationApplicationLogs",
        limit: '50',
        startFromHead: true
    };

    cloudwatchlogs.getLogEvents(params, function(err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            let params = {
                logGroupName: '/aws/robomaker/SimulationJobs',
                logStreamName: streamName + "/" + simulationName + "/robot-deliverychallenge_robot/RobotApplicationLogs",
                limit: '7000',
                startFromHead: true
            };

            cloudwatchlogs.getLogEvents(params, function(err, result) {
                if (err) {
                    res.send({
                        message: err,
                        error: err.stack
                    });
                } else {
                    res.send({
                        message: {
                            simulation_delivery: data,
                            robot_application: result,
                            total_records: data.events.length + result.events.length
                        },
                        error: null
                    });
                }
            });
        }
    });
});

module.exports = router;