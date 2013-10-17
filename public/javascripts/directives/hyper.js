/**
 * Module dependencies
 */

var app = require('..');
var request = require('hyper-path');
var emitter = require('hyper-emitter');

setInterval(function() {
  emitter.refresh('http://localhost:5000/api/apps/app123/reports/points');
}, 1000);

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
      var req = request(attrs.hyper);

      if (!req.isRoot) $scope.$watch(req.index, function(parent) {
        var root = {};
        root[req.index] = parent;
        req.scope(root);
      }, true);

      req.on(function(err, value) {
        // TODO handle error better
        if (err) return console.log(err);

        safeApply.call($scope, function() {
          $scope[req.target] = value;
          if (value === 0 || value) elem.css('display', '');
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
