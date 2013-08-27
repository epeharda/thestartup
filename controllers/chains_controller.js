var _ = require('lodash');

function chainsController(app) {
  this.app = app;
  _.bindAll(this, 'longest', 'random', 'create');
}

chainsController.prototype.longest = function(req, res, next){
  var query = 'SELECT * FROM chains ORDER BY total_length DESC LIMIT 1;';

  this.app.query(query, null, next, function(result) {
    var names = []
      , contributor_name = 'Anonymous';

    if (typeof result.rows[0] !== "undefined") {
      names = JSON.parse(result.rows[0].names);
      contributor_name = result.rows[0].contributor_name;
    }

    res.send({
      contributor_name: contributor_name,
      names: names
    });
  });
};


chainsController.prototype.random = function(req, res, next){
  var query = 'SELECT * FROM chains ORDER BY RANDOM() LIMIT 1;';

  this.app.query(query, null, next, function(result) {
    var names = []
      , contributor_name = 'Anonymous';

    if (typeof result.rows[0] !== "undefined") {
      names = JSON.parse(result.rows[0].names);
      contributor_name = result.rows[0].contributor_name;
    }

    res.send({
      contributor_name: contributor_name,
      names: names
    });
  });
};

chainsController.prototype.create = function(req, res, next){
  if (!this.app.validator) {
    res.send(500, "Server has not finished loading the validator... please try again shortly");
  }

  var _this = this
    , contributor_name = req.body.contributor_name
    , names = JSON.stringify(req.body.names)
    , created_at = new Date()
    , total_length = req.body.names.length;

  this.app.validator.validate(req.body.names).then(function(isValid) {

    if (isValid) {

      _this.app.query('SELECT MAX(total_length) FROM chains', null, next, function(result) {

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

    } else {
      res.send(422, "Invalid name chain");
      return;
    }
  }).fail(next);

};

module.exports = chainsController;
