module.exports = function(grunt) {

  grunt.registerTask('compressData', 'Compress data before commit', function() {

    var done = this.async();

    var zlib = require('zlib');
    var fs = require('fs');

    var files = ['data/graph.json', 'data/nodes.json', 'data/names.json'];

    function process() {

      var file = files.pop();

      if (file) {
        console.log("---> Compressing " + file);

        var gzip = zlib.createGzip();
        var inf = fs.createReadStream(file);
        var outf = fs.createWriteStream(file + ".gz");

        var gziped = inf.pipe(gzip)
        
        gziped.pipe(outf);
        gziped.on("end", process);
        gziped.on("error", done);

      } else {

        done();

      }

    }

    process();

  });

  grunt.registerTask('decompressData', 'Compress data before commit', function() {

    var done = this.async();

    var zlib = require('zlib');
    var fs = require('fs');

    var files = ['data/graph.json', 'data/nodes.json', 'data/names.json'];

    function process() {

      var file = files.pop();

      if (file) {

        fs.exists(file, function(exists) {

          if (exists) {

            console.log("---> " + file + " exists, not decompressing");
            process();

          } else {

            console.log("---> Decompressing " + file);

            var gunzip = zlib.createGunzip();
            var inf = fs.createReadStream(file + ".gz");
            var outf = fs.createWriteStream(file);

            var gunziped = inf.pipe(gunzip)

            gunziped.pipe(outf);
            gunziped.on("end", process);
            gunziped.on("error", done);
          }
        });

      } else {

        done();

      }

    }

    process();

  });


}
