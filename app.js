var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');



const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
const dbName = 'datadb'

async function run() {
  await client.connect()
  console.log('Connect succesfully to server')
  const db = client.db(dbName)
  return db
}

run()
  .then((db) => {


    var indexRouter = require('./routes/index')(db);
    var usersRouter = require('./routes/users')(db);
    var todosRouter = require('./routes/todos')(db);



    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));


    // app.use(function (req, res, next) {
    //   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    //   res.header('Expires', '-1');
    //   res.header('Pragma', 'no-cache');

    //   next();
    // });

    app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
    });


    app.use('/', indexRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/todos', todosRouter);


    var debug = require('debug')('mongodbbread:server');
    var http = require('http');
    const routes = require('./routes/index');

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);


    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
  }).catch((err) => {
    console.log(err)
  })