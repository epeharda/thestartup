(function(window, $) {

  var TEMP_NAMES = ['little dog', 'doghouse', 'house warming partners', 'partners', 'partners in crime', 'crime stoppers'];

  var ANIMATION_TIMER = 1000;
  var app = {};

  app.init = function() {
    app.loadNames()
      .then(app.buildNames)
      .then(app.render);
  };

  app.loadNames = function() {
    //return $.get('/names');

    return new $.Deferred().resolve(TEMP_NAMES);
  };

  app.buildNames = function(names) {
    var nameObjects = _.map(names, function(name) {
      return {
        title: name,
        chars: []
      }
    });

    return nameObjects;
  };

  app.render = function(names, index) {
    index = index || 0;
    var $canvas = $('#canvas');

    // build new set of chars
    var $chars = app.buildCharacterMarkup(names, index);
    $canvas.html($chars);

    // *deep breath*
    $canvas.attr('class', 'show');        // show first & overlap
    setTimeout(function() {
      $canvas.attr('class', 'advance');   // show overlap & second
      setTimeout(function() {
        $canvas.attr('class', 'reset');   // fade to black
        setTimeout(function() {
          if (index+3 < names.length) {
            app.render(names, index+1);   // recurse until end
          }
        }, ANIMATION_TIMER);
      }, ANIMATION_TIMER);
    }, ANIMATION_TIMER);
  };

  app.buildCharacterMarkup = function(names, index) {

    var name = names[index].title;
    var nextName = names[index+1].title;

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
    var firstSegment = name.slice(0, name.length - overlap.length);
    var secondSegment = nextName.slice(j);

    var $firstSegment = app.wrapChars(firstSegment, 'first');
    var $overlap = app.wrapChars(overlap, 'overlap');
    var $secondSegment = app.wrapChars(secondSegment, 'second');

    return [].concat($firstSegment, $overlap, $secondSegment);

  };

  app.wrapChars = function(chars, classes) {
    return _.map(chars.split(''), function(c) {
      return $('<span/>', {
        text: c,
        class: classes
      });
    });
  };

  $(document).ready(app.init);

})(this, jQuery);
