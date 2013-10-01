var express = require('express')
  , http = require('http')
  , path = require('path')
  , pg = require('pg').native
  , fs = require('fs')
  , zlib = require('zlib')
  , chainsController = require('../controllers/chains_controller')
  , Validator = require('./validator');

var app = express();

// VALIDATOR
app.validator = new Validator(app);

// CONTROLLERS

app.controllers = {
  chains: new chainsController(app)
};

// CONFIG

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, '../public') }));
app.use(express.static(path.join(__dirname, '../public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ROUTES

app.get('/', function(req, res){
  res.render('index', {
    environment: process.env.NODE_ENV || 'development',
    title: 'THE STARTUP'
  });
});

app.get('/chains/longest', app.controllers.chains.longest);
app.get('/chains/random', app.controllers.chains.random);
app.post('/chains', app.controllers.chains.create);

// DB

var dbString;

if ('development' == app.get('env')) {
  dbString = process.env.DATABASE_URL;
}

if ('production' == app.get('env')){
  dbString = process.env.HEROKU_POSTGRESQL_VIOLET_URL;
}

app.query = function(query, values, next, cb) {
  pg.connect(dbString, function(err, client, done) {
    if (err) {
      next(err);
    }

    client.query(query, values, function(err, result) {
      if (err) {
        console.log(err);
        done();
        next(err);
      }

      done();
      cb(result);
    });
  });
};

// HTTP SERVER

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
