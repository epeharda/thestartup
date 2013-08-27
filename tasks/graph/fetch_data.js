module.exports = function(grunt) {

  grunt.registerTask('fetchData', 'Fetches data from external company datasource.', function() {

    var async = require('async')
      , cheerio = require('cheerio')
      , request = require('request')
      , fs = require('fs')
      , rimraf = require('rimraf')
      , characters = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "other" ]
      , done = this.async();

    async.concat(characters, function(character, callback) {
      var url = 'http://www.crunchbase.com/companies?c=' + character;
      request(url, function(err, resp, body){

        var $ = cheerio.load(body);
        var names = [];

        links = $('.col2_table_listing a');
        $(links).each(function(i, link){
          names.push($(link).text().trim());
        });

        console.log('Names fetched for: ', character);

        callback(null, names);
      });
    }, function(err, names) {

      if(err) { done(false); }

      names = names.sort();

      rimraf.sync('data', function(){});
      fs.mkdirSync('./data');
      fs.writeFileSync('./data/names.json', JSON.stringify(names, null, '  '));
      console.log('---> Company names written to data/names.json!');

      done();
    });

  });

}
