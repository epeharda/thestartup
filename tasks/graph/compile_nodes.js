module.exports = function(grunt) {

  grunt.registerTask('compileNodes', 'Compiles nodes into graph.', function() {

    var _ = require('lodash')
      , fs = require('fs')
      , path = require('path')
      , nodes = require('../../data/nodes.json');


    console.log("Augmenting nodes...");
    _.each(nodes, function(node, index) {
      node.index = index;
      node.offset = null;
    });

    console.log("Creating indices...");
    var byPrefix = {};
    _.each(nodes, function(node) {
      _.each(node.prefixes, function(prefix) {
        if(!_.isArray(byPrefix[prefix])) byPrefix[prefix] = [];
        byPrefix[prefix].push(node.index);
      });
    });

    console.log("Building graph...");
    var graph = [];
    _.each(nodes, function(node) {

      var next =
      _.chain(node.suffixes)
      .map(function(suffix) { return byPrefix[suffix] || []; })
      .flatten()
      .uniq()
      .value()
      .sort();

      node.offset = graph.length;

      if(next.length > 0) graph.push.apply(graph, next);
    });

    console.log("Flattening offsets...");
    var offsets = _.map(nodes, function(node) { return node.offset; });
    offsets.push(graph.length);

    console.log("Flattening names...");
    var names = _.map(nodes, function(node) { return node.name; });

    fs.writeFileSync('./data/graph.json', JSON.stringify({names: names, offsets: offsets, graph: graph}));
    console.log('---> Graph written to data/graph.json!');

  });

}


