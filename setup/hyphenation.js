var fs = require('fs');
var _ = require('lodash');

var names = require('./data/names.json');

var Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

var nodes = [];
_.each(names, function(name) {
  var words = name.split(/\s+/);
  var prefixSyllables = h.hyphenate(words[0]);
  var suffixSyllables = h.hyphenate(words[words.length - 1]);

  var prefixes = [], suffixes = [];

  for(var i = 1; i <= prefixSyllables.length; i++) {
    prefixes.push(prefixSyllables.slice(0, i).join('').toLowerCase());
  }

  for(var j = 0; j < suffixSyllables.length; j++) {
    suffixes.push(suffixSyllables.slice(j, suffixSyllables.length).join('').toLowerCase());
  }

  var node = {
    name: name,
    prefixes: prefixes,
    suffixes: suffixes
  }

  nodes.push(node);
});

fs.writeFileSync('./data/nodes.json', JSON.stringify(nodes, null, '  '));
console.log('Nodes writen to data/nodes.json');
