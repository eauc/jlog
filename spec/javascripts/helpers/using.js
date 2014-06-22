'use strict';

function using(using_desc, values, func){
  var current_it = window.it;
  var itFactory = function(val) {
    return ('function' !== typeof(using_desc)) ?
      function(desc, func) {
        current_it(desc + ' -- (with "' + using_desc + '"=' + JSON.stringify(val) + ')', func);
      } : function(desc, func) {
        current_it(desc + ' -- (with ' + using_desc.apply(this, val) + ')', func);
      };
  };
  _.each(values, function(val) {
    if(!_.isArray(val)) {
      val = [val];
    }
    window.it = (null === using_desc) ? current_it : itFactory(val);
    func.apply(this, val);
  });
  window.it = current_it;
}
