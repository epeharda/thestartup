var _ = require('lodash')
  , request = require('request')
  , graph = require('../data/graph.json')
  , names = Object.keys(graph)
  , chain = []
  , index = {}
  , best = [];

function sample(array) {
  var i = _.random(array.length - 1);
  return array[i];
}

function postLongestChain(chain) {

  console.log(chain.length);
  if (best.length < 5) return false;

  var data = {
    contributor_name: process.env.CONTRIBUTOR_NAME || process.env.USERNAME || 'Anonymous',
    names: chain
  };

  console.log('Posting your longest chain so far (' + best.length + ' names long):');
  console.log(JSON.stringify(best));

  request({
    method: 'POST',
    url: process.env.ENDPOINT || 'http://thestartup.quickleft.com/chains',
    body: data,
    json: true
  }, function (err, resp, body) {

    if(err) { throw err; }

    if(body) {
      console.log(body);
    }

  });

}

function loop() {

  // begin chain with random node
  if(chain.length < 1) {
    chain.push(_.random(graph.names.length - 1));
    index[chain[0]] = true;
  }

  var tail = chain[chain.length - 1];
  var nexts = graph.graph.slice(graph.offsets[tail], graph.offsets[tail+1]);
  var next = sample(nexts);

  if(next && !index[next]) {
    index[next] = true;
    chain.push(next);
  } else {

    // Dead End or loop
    if(chain.length > best.length) {
      best = _.map(chain, function(id) { return graph.names[id]; });
      postLongestChain(best);
    }

    // Remove a random chunk from the end of the chain
    var size = _.random(chain.length - 1);
    _.each(chain.slice(size), function(item) {
      index[item] = false;
    });
    chain = chain.slice(0, size);

  }

  setImmediate(loop);
}

loop();
