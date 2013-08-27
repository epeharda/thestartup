var _ = require('lodash');
var Q = require('q');

function Validator(app) {
  this.app = app;
}

Validator.prototype.validate = function(chain) {
  var _this = this
    , def = Q.defer();

  this.fetchNames(chain).then(function(names) {

    // reject if all names don't exist in DB
    if (_.keys(names).length !== chain.length) {
      def.resolve(false);
      return false;
    }

    // reject if any names don't properly chain
    var namesAreValid = _.all(chain.map(function(name, i) {
      return _this.validateKnownName(names, chain, i);
    }), function(isValid) { return !!isValid; });

    def.resolve(namesAreValid);
    
  });

  return def.promise;

};

Validator.prototype.fetchNames = function(chain) {
  var query
    , def = Q.defer()
    , params = [];

  for(var i = 1; i <= chain.length; i++) {
    params.push('$'+i);
  }

  query = 'SELECT * FROM names WHERE name IN (' + params.join(',') + ')';

  this.app.query(query, chain, console.log, function(result) {

    var names = {};
    _.each(result.rows, function(row) {
      names[row.name] = {
        prefixes: JSON.parse(row.prefixes),
        suffixes: JSON.parse(row.suffixes)
      };
    });

    def.resolve(names);
  });

  return def.promise;
};

Validator.prototype.validateKnownName = function(names, chain, i) {

  var current = names[chain[i]]
    , next = names[chain[i+1]];

  if (typeof next === "undefined") {
    return true;
  }

  var isValid = _.any(current.suffixes, function(suffix) {
    return _.indexOf(next.prefixes, suffix) > -1;
  });

  return isValid;
};

module.exports = Validator;
