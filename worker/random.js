var _ = require('lodash');
var graph = require('./graph.json');
var names = Object.keys(graph);
var chain = [];
var index = {};
var best = [];

function sample(array) {
  var i = _.random(array.length - 1);
  return array[i];
}

while(true) {
  if(chain.length < 1) {
    chain.push(sample(names));
    index['!' + chain[0]] = true;
  }

  var tail = chain[chain.length - 1];

  var next = sample(graph[tail] || []);

  if(next && !index['!' + next]) {
    index['!' + next] = true;
    chain.push(next);
  } else {
    // Dead End or loop
    if(chain.length > best.length) {
      best = chain;
      console.log('New best chain of length: ' + best.length + '\n' + JSON.stringify(best));
      // TODO Report Chain if longest
    }

    // Remove a random chunk from the end of the chain
    var size = _.random(chain.length - 1);
    _.each(chain.slice(size), function(item) {
      index['!' + item] = false;
    });
    chain = chain.slice(0, size);
  }
}
