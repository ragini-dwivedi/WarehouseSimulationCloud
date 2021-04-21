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


/* GET Create aws credentials. */
router.get('/get_simulation_logs', function(req, res, next) {
    let params = {
        maxResults: '10'
    };
});

module.exports = router;