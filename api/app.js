const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const config = require('./config');
const { connectToMongo, setDb } = require('./client/mongodb');
const app = express();

(async () => {
  // connectDB();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(fileUpload());
  
  // Routes
  app.use('/customers', require('./routes/customers'));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  const conn = await connectToMongo(config.databases.mongo.db);
  setDb(conn, config.databases.mongo.db);
  
  console.log('db connected')
  app.listen(config.port, () => {
    console.log(`app listening at http://localhost:${config.port}`)
  });

  app.on('error', onError);
  app.on('listening', onListening);


  function onError(error) {
    console.log(error)
  }

  function onListening() {
    const addr = app.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

  process.on('SIGINT', () => {
    console.log('closing mongo connections');
    conn.close();
    process.exit();
  });
})();
