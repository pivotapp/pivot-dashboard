/**
 * Module dependencies
 */

var app = require('..');
var lib = require('./hyper-lib');

/**
 * hyper
 */

function hyper() {
  return {
    require: 'hyper',
    scope: true,
    controller: function() {},
    link: function($scope, elem, attrs) {
      if (!attrs.hyperProgressive) elem.css('display', 'none');
      lib(attrs.hyper, $scope, function(err, value, conf) {
        // TODO handle error better
        if (err) return console.log(err);

        safeApply.call($scope, function() {
          $scope[conf.name] = value;
          if (value) elem.css('display', '');
        });
      });
    }
  };
}

/**
 * Safely call apply
 *
 * @param {Function} fn
 * @api private
 */

function safeApply(fn) {
  var phase = this.$$phase;
  if (phase === '$apply' || phase === '$digest') return fn();
  this.$apply(fn);
}

/**
 * Register it with angular
 */

app.directive('hyper', [
  hyper
]);

/**
 * Let others know where to find it
 */

exports = module.exports = 'hyper';
