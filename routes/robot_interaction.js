let express = require('express');
let router = express.Router();

/* GET get robot interaction GUI. */
router.get('/view_robot_interaction', function(req, res, next) {
    res.render('robot_interaction', { title: "Warehouse Simulation Cloud" });
});

/* GET get robot interaction GUI. */
router.get('/view_robot_navigation', function(req, res, next) {
    res.render('robot_navigation', { title: "Warehouse Simulation Cloud" });
});

module.exports = router;