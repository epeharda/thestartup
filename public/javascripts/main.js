(function(window, $) {

  var TEMP_NAMES = ['little dog', 'doghouse', 'house warming partners', 'partners', 'partners in crime', 'crime stoppers'];

  var app = {};

  app.init = function() {
    app.loadNames().then(app.renderCharacters);
  };

  app.loadNames = function() {
    //return $.get('/names');

    return new $.Deferred().resolve(TEMP_NAMES);
  };

  app.renderCharacters = function(names) {
    var nextName,
        chars,
        $chars = $('#chars');

    _.each(names, function(name, i, list) {
      nextName = list[i+1] || list[0];
      chars = app.buildCharacterMarkup(name, nextName);
      $chars.append(chars);
    });
  };

  app.buildCharacterMarkup = function(name, nextName) {

    // Second word index.
    var j = 0;

    // Track whether we are currently matching a substring.
    var matching = 0;

    for (var i = 0; i < name.length; i++) {
      if (name.charAt(i) === nextName.charAt(j)) {
        matching = j;
        j++;
      } else {
        matching = 0;
      }
    }

    var overlap = nextName.slice(0, j);
    var baseWord = name.slice(0, name.length - overlap.length);

    var $chars = _.map(baseWord.split(''), function(c) {
      return $('<span/>', { text: c });
    });

    return $chars;

  };

  $(document).ready(app.init);

})(this, jQuery);
