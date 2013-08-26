var _ = require('underscore');

function chainsController(app) {
  this.app = app;
  _.bindAll(this, 'longest', 'random', 'create');
}

chainsController.prototype.longest = function(req, res, next){
  var query = 'SELECT * FROM chains ORDER BY total_length DESC LIMIT 1;';

  this.app.query(query, null, next, function(result) {
    console.log(arguments);
    var longestChain = result.rows[0];
    longestChain.names = JSON.parse(longestChain.names);
    res.send(longestChain);
  });
};


chainsController.prototype.random = function(req, res, next){
  var query = 'SELECT * FROM chains ORDER BY RANDOM() LIMIT 1;';

  this.app.query(query, null, next, function(result) {
    console.log(arguments);
    var randomChain = result.rows[0];
    randomChain.names = JSON.parse(randomChain.names);
    res.send(randomChain);
  });
};

chainsController.prototype.create = function(req, res, next){
  if (!this.app.validator) {
    res.send(500, "Server has not finished loading the validator... please try again shortly");
  }

  var validationResult = this.app.validator.validate(req.body.names);

  if(validationResult !== true) {
    res.send(422, _.isString(validationResult) ? validationResult : "Invalid name chain");
    return;
  }

  var contributor_name = req.body.contributor_name;
  var names = JSON.stringify(req.body.names);
  var created_at = new Date();
  var total_length = req.body.names.length;
  var _this = this;

  this.app.query('SELECT MAX(total_length) FROM chains', null, next, function(result) {

    var max = result.rows[0].max || 0;

    if (total_length > max) {
      var query = 'INSERT INTO chains VALUES ($1, $2, $3, $4);';
      var values = [contributor_name, names, created_at, total_length];

      _this.app.query(query, values, next, function(result) {
        res.send(200);
      });
    } else {
      res.send(200);
    }

  });

};

module.exports = chainsController;
