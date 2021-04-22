var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create_development_environment', function(req, res, next) {
  res.render('create_development_environment', { title: 'Warehouse Simulation Cloud' });
});

router.get('/view_simulations', function(req, res, next) {
  res.render('view_simulations', { title: 'Warehouse Simulation Cloud' });
});

router.get('/view_simulation_logs', function(req, res, next) {
  res.render('view_simulation_logs', { title: 'Warehouse Simulation Cloud' });
});

module.exports = router;
