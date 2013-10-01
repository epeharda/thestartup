module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    fetchData: {
      foo: [1, 2, 3],
      bar: 'hello world',
      baz: false
    }

  });

  grunt.loadTasks('./tasks');
  grunt.loadTasks('./tasks/graph');

  grunt.registerTask('worker', ['decompressData', 'spawnWorker']);

  grunt.registerTask('graph:publish', ['fetchData', 'buildNodes', 'compileNodes', 'compressData']);
  grunt.registerTask('setupDatabase', ['decompressData', 'seedDatabase']);

};
