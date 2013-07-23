var express = require('express')
  , http = require('http')
  , path = require('path')
  , routes = require('./routes')
  , pg = require('pg')
  , chainsController = require('./controllers/chains_controller');

var app = express();

// CONTROLLERS

app.controllers = {
  chains: new chainsController(app)
};

// CONFIG

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ROUTES

app.get('/', routes.index);
app.get('/chains/longest', app.controllers.chains.longest);
app.post('/chains', app.controllers.chains.create);

// HTTP SERVER

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// DB

app.query = function(query, values, next, cb) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      next(err);
    }

    client.query(query, values, function(err, result) {
      if (err) {
        done();
        next(err);
      }

      done();
      cb(result);
    });
  });
};
