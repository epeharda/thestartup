var child_process = require('child_process');

module.exports = function(grunt) {

  var child
    , done;

  function start() {

    child = child_process.fork('./lib/server.js');

    child.on('message', function(data) {
      if(data.event === 'listening') {
        done();
      }
    });

    child.on('exit', function(code) {
      console.log('---> Server died...');
      done();
    });

  }

  grunt.registerTask('server', 'Starts the server.', function() {

    done = this.async();

    if(child) {
      console.log('---> Killing stale server instance...');
      child.kill();
    } else {
      console.log('---> Starting server...');
      start();
    }

  });

}

