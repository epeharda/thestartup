var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var nodes = require('./data/nodes.json');

var byPrefix = {};
_.each(nodes, function(node) {
  _.each(node.prefixes, function(prefix) {
    if(!_.isArray(byPrefix[prefix])) byPrefix[prefix] = [];
    byPrefix[prefix].push(node.name);
  });
});

var graph = {};
_.each(nodes, function(node) {
  var next = _.chain(node.suffixes)
  .map(function(suffix) {
    return byPrefix[suffix] || []
  })
  .flatten()
  .uniq()
  .value()
  .sort();

  if(next.length > 0) graph[node.name] = next;
});

fs.writeFileSync('./data/graph.json', JSON.stringify(graph, null, '  '));
console.log('Graph written to data/graph.json');
