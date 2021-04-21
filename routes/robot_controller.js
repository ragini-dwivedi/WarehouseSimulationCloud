let express = require('express');
let router = express.Router();


/* Get Load robot controller screen. */
router.get('/load_controller', function(req, res, next) {
    res.render('robot_controller');
});

/* Get Load robot controller screen. */
router.get('/load_navigator', function(req, res, next) {
    res.render('robot_navigator');
});


module.exports = router;