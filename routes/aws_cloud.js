let express = require('express');
// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
let iam = new AWS.IAM({apiVersion: '2010-05-08'});
let router = express.Router();

/* POST Create aws credentials. */
router.post('/create_account', function(req, res, next) {
    let params = {
        UserName: req.body.username
    };

    iam.createUser(params, function(err, user) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        }
        else {
            console.log(user);
            let params = {
                Password: req.body.password,
                PasswordResetRequired: false,
                UserName: req.body.username
            };
            iam.createLoginProfile(params, function(err, pwd) {
                if (err) {
                    res.send({
                        message: err,
                        error: err.stack
                    });
                }
                else {
                    console.log(pwd);
                    let params = {
                        GroupName: "robotmaker_user_group",
                        UserName: req.body.username
                    };
                    iam.addUserToGroup(params, function(err, data) {
                        if (err) {
                            res.send({
                                message: err,
                                error: err.stack
                            });
                        } else {
                            res.send({
                                message: {
                                    user: user,
                                    pwd: pwd,
                                    account_id: 257034989243,
                                    group: data,
                                    user_message: "User created successfully."
                                },
                                error: null
                            });
                        }
                    });
                }
            });
        }

    });
});

/* POST Update aws credentials. */
router.post('/update_password', function(req, res, next) {
    let params = {
        Password: req.body.password,
        UserName: req.body.username
    };

    iam.updateLoginProfile(params, function (err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            res.send({
                message: {
                    user: data,
                    account_id: 257034989243,
                    user_message: "User update successfully."
                },
                error: null
            });
        }
    });
});


/* POST Delete aws user account. */
router.post('/delete_account', function(req, res, next) {
    let params = {
        GroupName: "robotmaker_user_group",
        UserName: req.body.username
    };

    iam.removeUserFromGroup(params, function (err, data) {
        if (err) {
            res.send({
                message: err,
                error: err.stack
            });
        } else {
            iam.deleteLoginProfile({ UserName: req.body.username }, function (err, data) {
                if (err) {
                    res.send({
                        message: err,
                        error: err.stack
                    });
                } else {
                    iam.deleteUser({ UserName: req.body.username }, function (err, data) {
                        if (err) {
                            res.send({
                                message: err,
                                error: err.stack
                            });
                        } else {
                            res.send({
                                message: {
                                    user: data,
                                    account_id: 257034989243,
                                    user_message: "User account deleted successfully."
                                },
                                error: null
                            });
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;
