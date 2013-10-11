/**
 * Module dependencies
 */

var app = require('..');
var each = require('each');
var start = require('in-progress');
var decode = require('websafe-base64').decode;
var client = require('hyperagent');

/**
 * HyperController
 */

function HyperController($scope, $routeParams) {
  each($routeParams, function(key, value) {
    if (key === 'slug') return;
    var href = decode(value);
    if (href.indexOf('http') !== 0) return;
    fetch(href, key, $scope);
  });
}

function fetch (href, key, $scope) {
  var done = start();

  function onError(err) {
    // TODO show a graceful error to the user
    console.error(err.stack || err.message || err);
  }

  client
    .get(href)
    .on('error', onError)
    .end(function(res) {
      // Expose the value to the view
      $scope.$apply(function() {
        $scope[key] = res.body;
        done();
      });
    });
}

/**
 * Register it with angular
 */

app.controller('HyperController', [
  '$scope',
  '$routeParams',
  HyperController
]);

/**
 * Let others know where to find it
 */

module.exports = 'HyperController';