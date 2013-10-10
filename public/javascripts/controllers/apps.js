/**
 * Module dependencies
 */

var app = require('..');
var start = require('in-progress');
var websafe = require('websafe-base64');
var client = require('hyperagent');

/**
 * AppsController
 */

function AppsController($scope, $routeParams) {
  var done = start();

  function onError(err) {
    console.error(err.stack || err.message || err);
    done();
  }

  client()
    .on('error', onError)
    .end(function(res) {

      // Fetch the categories
      res
        .follow('apps')
        .on('error', onError)
        .end(function(res) {
          $scope.$apply(function() {
            $scope.body = res.body;
            done();
          });
        });
    });
}

/**
 * Register it with angular
 */

app.controller('AppsController', [
  '$scope',
  '$routeParams',
  AppsController
]);

/**
 * Let others know where to find it
 */

module.exports = 'AppsController';