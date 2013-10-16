/**
 * Module dependencies
 */

var app = require('..');
var lib = require('./hyper-lib');

/**
 * hyperBind
 */

function hyperBind() {
  return {
    require: 'hyperBind',
    controller: function() {},
    link: function($scope, elem, attrs) {
      if (!attrs.hyperProgressive) elem.css('display', 'none');
      lib(attrs.hyperBind, $scope, function(err, value) {
        // TODO handle error better
        if (err) return console.log(err);
        elem.text(value || '');
        if (value) elem.css('display', '');
      });
    }
  };
}

/**
 * Register it with angular
 */

app.directive('hyperBind', [
  hyperBind
]);

/**
 * Let others know where to find it
 */

module.exports = 'hyperBind';