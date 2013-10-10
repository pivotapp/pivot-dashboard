/**
 * Module dependencies
 */

var app = require('..');
var start = require('in-progress');
var client = require('hyperagent');

/**
 * AccountController
 */

function AccountController($scope) {
  var done = start();

  function onError(err) {
    // TODO show a graceful error to the user
    console.error(err.stack || err.message || err);
    done();
  }

  client()
    .on('error', onError)
    .end(function(res) {
      if (!res.body.account) return;

      res
        .follow('account')
        .on('error', onError)
        .end(function(res) {
          $scope.$apply(function() {
            $scope.account = res.body;
            done();
          });
        });
    });
}

/**
 * Register it with angular
 */

app.controller('AccountController', [
  '$scope',
  AccountController
]);

/**
 * Let others know where to find it
 */

module.exports = 'AccountController';