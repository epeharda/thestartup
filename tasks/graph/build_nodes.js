module.exports = function(grunt) {

  grunt.registerTask('buildNodes', 'Builds graph nodes using hyphenation word disassembly.', function() {

    var fs = require('fs')
      , _ = require('lodash')
      , names = require('../../data/names.json')
      , Hypher = require('hypher')
      , english = require('hyphenation.en-us');

    var prefixSyllables
      , suffixSyllables
      , prefixes
      , suffixes
      , h = new Hypher(english)
      , nodes = [];

    _.each(names, function(name) {

      prefixSyllables = _.flatten(_.map(h.hyphenate(name), function(item) {
        return item.match(/\s*[^\s]*/g);
      }));

      suffixSyllables = _.flatten(_.map(h.hyphenate(name), function(item) {
        return item.match(/[^\s]*\s*/g);
      }));

      prefixes = [];
      suffixes = [];

      for(var i = 1; i <= prefixSyllables.length; i++) {
        prefixes.push(prefixSyllables.slice(0, i).join('').toLowerCase());
      }

      for(var j = 0; j < suffixSyllables.length; j++) {
        suffixes.push(suffixSyllables.slice(j, suffixSyllables.length).join('').toLowerCase());
      }

      nodes.push({
        name: name,
        prefixes: _.uniq(prefixes),
        suffixes: _.uniq(suffixes)
      });

    });

    fs.writeFileSync('./data/nodes.json', JSON.stringify(nodes, null, '  '));
    console.log('---> Nodes writen to data/nodes.json!');

  });

}

