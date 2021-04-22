let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let aws_cloudRouter = require('./routes/aws_cloud');
let aws_robomaker = require('./routes/aws_robomaker');
let aws_cloudwatch = require('./routes/aws_cloudwatch');
let robotcontroller = require('./routes/robot_controller');
let robotinteraction = require('./routes/robot_interaction');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({origin: null, credentials: true}));

//allow access control
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '.');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

const url = 'mongodb+srv://warehouse:warehouse_simulation@warehouse-simulation.pypjo.mongodb.net/warehouse?retryWrites=true&w=majority';

// Database Name
const dbName = 'warehouse-simulation';
const client = new MongoClient(url);

// Use connect method to connect to the server
client.connect(function(err) {
  console.log('Connected successfully to server');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/aws_user', aws_cloudRouter);
app.use('/aws_robomaker', aws_robomaker);
app.use('/aws_cloudwatch', aws_cloudwatch);
app.use('/robot_controller', robotcontroller);
app.use('/robot_interaction', robotinteraction);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
