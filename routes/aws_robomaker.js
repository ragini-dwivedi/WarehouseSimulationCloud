let express = require('express');
// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
AWS.config.apiVersions = {
    robomaker: '2018-06-29'
};
let robo_maker = new AWS.RoboMaker();
let router = express.Router();
const { exec } = require("child_process");

const db = require('../utils/MysqlConfig');

function execute(command, callback) {
    exec(command, (err, stdout, stderr) => {
        if (err) {
            callback(null, err);
        } else if (stderr) {
            callback(null, stderr);
        } else {
            callback(stdout,null);
        }
    });
}

/* GET Create aws credentials. */
router.get('/get_simulation/:email', function(req, res, next) {
    let params = {
        maxResults: '30'
    };

    let email = req.params.email;

    let results = [];
    robo_maker.listSimulationJobs(params, function(err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            db.query(
                "SELECT * FROM simulation WHERE user_email=?;", [email],(err, result) => {
                    if (err) {
                        res.status(500).end("Error");
                        console.log(err);
                    } else {
                        let j = 0;
                        for (let i = 0; i < data.simulationJobSummaries.length; i++){
                            let sim = data.simulationJobSummaries[i].arn.split('/')[1];
                            if (result.some(item => item.simulationName === sim)) {
                                results[j] = data.simulationJobSummaries[i];
                                j = j + 1;
                            }
                        }

                        res.send({
                            message: {
                                simulations: results,
                                account_id: 257034989243,
                                error: null
                            }
                        })
                    }
                }
            );
        }
    });
});

/* POST Create aws credentials. */
router.post('/start_simulation/type/:type', function(req, res, next) {
    let type = req.params.type;
    let query = "";
    if (type === "1" || type === 1) {
        query = "aws robomaker create-simulation-job --max-job-duration-in-seconds 1200 --iam-role arn:aws:iam::257034989243:role/delivery-challenge-simulation-role-us-east-2 --robot-applications application=arn:aws:robomaker:us-east-2:257034989243:robot-application/deliverychallenge_robot/1618706857683,launchConfig=\"{packageName=delivery_robot_sample,launchFile=navigation_simulation.launch,streamUI=true}\" --simulation-applications application=arn:aws:robomaker:us-east-2:257034989243:simulation-application/deliverychallenge_sumulation/1618706844442,launchConfig=\"{packageName= delivery_challenge_simulation,launchFile=create_stage.launch,streamUI=true,environmentVariables={TURTLEBOT3_MODEL=burger}}\" --vpc-config assignPublicIp=true,subnets=subnet-f1c794bd,subnet-7bbe0310,subnet-99c42fe4,securityGroups=sg-080fc74a38d908d2d --region us-east-2";
    } else {
        query = "aws robomaker create-simulation-job --max-job-duration-in-seconds 1200 --iam-role arn:aws:iam::257034989243:role/delivery-challenge-simulation-role-us-east-2 --robot-applications application=arn:aws:robomaker:us-east-2:257034989243:robot-application/deliverychallenge_robot/1618706857683,launchConfig=\"{packageName=delivery_robot_sample,launchFile=slam_simulation.launch,streamUI=true,environmentVariables={TURTLEBOT3_MODEL=burger}}\" --simulation-applications application=arn:aws:robomaker:us-east-2:257034989243:simulation-application/deliverychallenge_sumulation/1618706844442,launchConfig=\"{packageName=delivery_challenge_simulation,launchFile=create_stage0.launch,streamUI=true,environmentVariables={TURTLEBOT3_MODEL=burger}}\" --vpc-config assignPublicIp=true,subnets=subnet-f1c794bd,subnet-7bbe0310,subnet-99c42fe4,securityGroups=sg-080fc74a38d908d2d --region us-east-2";
    }

    execute(query, function (message, error) {
        if (error) {
            res.send({
                message: error,
                error: error.message
            });
        } else {
            res.send({
                message: JSON.parse(message),
                error: null
            });
        }
    });
});

/* POST stop simulation. */
router.post('/stop_simulation/:simulationId', function(req, res, next) {
    let sim_Id = req.params.simulationId;
    let simulation_name = "arn:aws:robomaker:us-east-2:257034989243:simulation-job/" + sim_Id;

    let query = "aws robomaker cancel-simulation-job --job " + simulation_name + " --region us-east-2";
    execute(query, function (message, error) {
        if (error) {
            res.send({
                message: error,
                simulation_id: sim_Id,
                error: error.message
            });
        } else {
            res.send({
                message: "Simulation stopped successfully",
                simulation_id: sim_Id,
                error: null
            });
        }
    });
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

            let filteredResult = result.filter(function (el) {
                return el != null;
            });

            res.send({
                message: {
                    simulations: filteredResult,
                    account_id: 257034989243,
                    error: null
                }
            });
        }
    });
});




module.exports = router;
