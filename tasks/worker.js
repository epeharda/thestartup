var child_process = require('child_process');

module.exports = function(grunt) {

  var child
    , done;

  function start() {

    child = child_process.fork('./lib/worker.js');

    child.on('message', function(data) {
      if(data.event === 'listening') {
        done();
      }
    });

    child.on('exit', function(code) {
      console.log('---> Worker died...');
      done();
    });

  }

  grunt.registerTask('spawnWorker', 'Spawns new worker to generate chains.', function() {

    done = this.async();

    if(child) {
      console.log('---> Killing stale worker...');
      child.kill();
    } else {
      console.log('---> Spawning worker...');
      start();
    }

  });

}

