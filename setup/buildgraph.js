var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var nodes = require('./data/nodes.json');

console.log("Augmenting nodes");
_.each(nodes, function(node, index) {
  node.index = index;
  node.offset = null;
});

console.log("Creating indecies");
var byPrefix = {};
_.each(nodes, function(node) {
  _.each(node.prefixes, function(prefix) {
    if(!_.isArray(byPrefix[prefix])) byPrefix[prefix] = [];
    byPrefix[prefix].push(node.index);
  });
});


console.log("Building graph");
var graph = [];
_.each(nodes, function(node) {
  var next = _.chain(node.suffixes)
  .map(function(suffix) {
    return byPrefix[suffix] || []
  })
  .flatten()
  .uniq()
  .value()
  .sort();

  node.offset = graph.length;
  if(next.length > 0) graph.push.apply(graph, next);
});

console.log("Flattening offsets");
var offsets = _.map(nodes, function(node) { return node.offset; });
offsets.push(graph.length);

console.log("Flattending names");
var names = _.map(nodes, function(node) { return node.name; });

console.log("Writing data/graph.json");
fs.writeFileSync('./data/graph.json', JSON.stringify({names: names, offsets: offsets, graph: graph}));
console.log('Graph written to data/graph.json');
