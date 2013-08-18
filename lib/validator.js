var _ = require('lodash');

function Validator(graph) {
  this.names = graph.names;
  this.offsets = graph.offsets;
  this.graph = graph.graph;

  this.index = {};
  _.each(this.names, function(name, i) {
    this.index["!" + name] = i;
  }, this);
}

Validator.prototype.validate = function(chain) {
  var ids = _.map(chain, function(name) {
    var id = this.index["!" + name];

    if(!id) {
      return "Unknwon company name: " + name;
    }

    return id;
  }, this);

  var used = {};
  _.each(ids.slice(0, -1), function(id, i) {
    if(used[id]) {
      return '"' + this.names[id] + '" can not be used twice';
    }
    used[id] = true;

    var next = ids[i + 1];
    var nexts = this.graph.slice(this.offsets[id], this.offsets[id + 1]);
    if(nexts.indexOf(next) < 0) {
      return '"' + this.names[next] + '" is not a valid company to follow "' + this.names[id] + '"';
    }
  }, this);

  return true;
};

module.exports = Validator;
