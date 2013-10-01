var fs = require('fs')
  , pg = require('pg').native
  , dbString = process.env.DATABASE_URL;

module.exports = function(grunt) {

  function renderLoader(current, total) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Loaded '+ current +'/'+ total +' nodes to database.');
  }

  grunt.registerTask('seedDatabase', 'Resets and seeds database.', function() {

    var done = this.async();

    fs.readFile("./data/nodes.json", "utf-8", function(err, data) {

      var client = new pg.Client(dbString);
      var nodes = JSON.parse(data);
      var total = nodes.length;
      var i = 0;

      client.connect(function(err) {
        if (err) { throw err; done(); }

        // reset
        client.query('DELETE FROM names;', null, function(err, result) {
          if (err) { throw err; done(); }
        });

        // seed
        nodes.forEach(function(node) {

          var query = 'INSERT INTO names (name, prefixes, suffixes) VALUES ($1, $2, $3);';
          var values = [node.name, JSON.stringify(node.prefixes), JSON.stringify(node.suffixes)];

          client.query(query, values, function(err, result) {
            if (err) { throw err; done(); }
            renderLoader(i, total);
            if(i+1 > total) {
              client.end();
              done();
            }
          });

        });
      });

    });

  });

}

