(function(window, $) {

  var ANIMATION_TIMER = 1000;
  var app = {};

  app.init = function(category) {
    if(app.timeout) {
      clearTimeout(app.timeout);
    }
    app.loadNames(category || "longest")
      .then(app.parseData)
      .then(app.render);
  };

  app.loadNames = function(category) {
    app.category = category || "longest"
    return $.ajax('/chains/' + app.category, {cache: false});
  };

  app.parseData = function(data) {
    app.chain = data;
    return app.buildNames(data.names);
  };

  app.buildNames = function(names) {
    var nameObjects = _.map(names, function(name) {
      return {
        title: name.toUpperCase(),
        chars: []
      }
    });

    app.updateChain(app.category, nameObjects.length);

    return nameObjects;
  };

  app.render = function(names, index) {
    index = index || 0;
    var $canvas = $('#canvas');

    // build new set of chars
    var $chars = app.buildCharacterMarkup(names, index);
    $canvas.html($chars);

    // *deep breath*
    $canvas.attr('class', 'show');          // show first & overlap
    app.timeout = setTimeout(function() {

      app.updateCurrent(index+2);           // update current counter

      $canvas.attr('class', 'stage');       // first (fade) & overlap & second
      app.timeout = setTimeout(function() {
        $canvas.attr('class', 'advance');   // show overlap & second
        app.timeout = setTimeout(function() {
          $canvas.attr('class', 'reset');   // fade to black
          app.timeout = setTimeout(function() {
            if (index+2 < names.length) {
              app.timeout = app.render(names, index+1);   // recurse until end
            }
          }, ANIMATION_TIMER);
        }, ANIMATION_TIMER);
      }, ANIMATION_TIMER * 2);
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

  app.updateChain = function(category, len) {
    $('#stats .chain').text(category.toUpperCase() + " Chain [" + len + "]");
  };

  app.updateCurrent = function(index) {
    $('#stats .current span').text(index);
  };

  $(function() {
    app.init()
    $("a[data-category]").click(function(event) {
      app.init($(this).data('category'));
    });
  });

})(this, jQuery);
