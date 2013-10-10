/**
 * Module dependencies
 */

var app = require('..');
var client = require('hyperagent');
var start = require('in-progress');
var each = require('each');
var type = require('type');
var slug = require('slug');
var websafe = require('websafe-base64').encode;

/**
 * IndexController
 */

function IndexController($scope, $location) {
  $scope.$watch(function() {
    return $location.path();
  }, function(val) {
    $scope.path = val;
  });

  $scope.sidenav = {categories: false, links: false};
  $scope.resetSidenav = function() {
    $scope.sidenav.categories = false;
    $scope.sidenav.links = false;
  };

  $scope.urlFor = function(obj, root) {
    if (!obj) return;

    return $scope.absUrl('/' + [
      root,
      slug(obj.name || obj.title || ''),
      websafe(obj.href)
    ].join('/'));
  };

  $scope.absUrl = function(path) {
    if (!path) return;

    //var port = $location.port() ? ':' + $location.port() : '';
    var port = '';

    return [
      $location.protocol() + ':/',
      $location.host() + port,
    ].join('/') + path;
  };

  // expose an easy way to submit a form
  $scope.submit = function(form, values, cb) {
    var done = start();

    if (type(values) === 'function') {
      cb = values;
      values = {};
    }

    if (!values) values = {};

    var method = (form.method || 'post').toLowerCase();

    each(form.input, function(key, conf) {
      if (conf.name) key = conf.name;
      if (!values[key]) values[key] = conf.value;
    });

    (client[method])(form.action)
      .send(values)
      .on('error', function(err) {
        done();
        cb(err);
      })
      .end(function(res){
        done();
        if (res.ok && res.body.href === form.action) subscribe.publish(form.action);
        if (cb) cb(null, res);
      });
  };
}

/**
 * Register it with angular
 */

app.controller('IndexController', [
  '$scope',
  '$location',
  IndexController
]);

/**
 * Let others know where to find it
 */

module.exports = 'IndexController';