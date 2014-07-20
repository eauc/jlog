'use strict';

window.describe = (function() {
  var top_level = true;
  var ctxt = {};
  function resetCtxt() {
    _.each(_.keys(ctxt), function(key) {
      delete ctxt[key];
    });
  }
  var jasmine_describe = window.describe;

  return function describe(desc, body) {
    var is_top_level = top_level;
    top_level = false;

    jasmine_describe(desc, function() {
      beforeEach(function() {
        if(is_top_level) resetCtxt();
      });

      body(ctxt);
    });
    top_level = is_top_level;
  };
})();
