/**
 * Module dependencies
 */

var app = require('..');
var client = require('hyperagent');

/**
 * hyper
 */

function hyper() {
  return {
    require: 'hyper',
    scope: true,
    controller: function() {},
    link: function($scope, elem, attrs) {
      var conf = parse(attrs.hyper);

      function done(err, value) {
        if (err) return console.log(err);

        safeApply.call($scope, function() {
          $scope[conf.name] = value;
        });
      }

      // We're requesting the root
      if (conf.isRoot) return client().on('error', done).end(function(res) {
        traverse(conf, res.body, 1, done);
      });

      $scope.$watch(conf.index, function(value) {
        var parent = {};
        parent[conf.index] = value;
        traverse(conf, parent, 0, done);
      });
    }
  };
}

/**
 * Parse the string with the following syntax
 *
 *     name as path.to.my.name
 *
 *     name as .path.to.my.name
 *
 *     path.to.my.name
 *
 *     .path.to.my.name
 *
 * @param {String} str
 * @api private
 */

function parse(str) {
  var parts = str.split(' as ');

  var path = parts[parts.length - 1].split('.');
  var name = parts.length === 1 ? path[path.length - 1] : parts[0];

  return {
    path: path,
    name: name,
    index: path[0],
    isRoot: path[0] === ''
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
 * Traverse properties in the api
 *
 * @param {Object} conf
 * @param {Any} parent
 * @param {Integer} i
 * @param {Function} cb
 * @api private
 */

function traverse(conf, parent, i, cb) {
  // We're done searching
  if (i === conf.path.length) return cb(null, parent);

  var key = conf.path[i];
  var value = parent[key];

  // We couldn't find the property
  if (typeof value === 'undefined') return cb(null);

  // It's local
  if (!value.href) return traverse(conf, value, i + 1, cb);

  // We're just getting the link
  if (conf.path[i + 1] === 'href') return cb(null, value);

  // It's a link
  client.get(value.href).on('error', cb).end(function(res) {
    var body = res.body;

    // We didn't get a body
    if (!body) return cb(null);

    // It's the same name as what the link was
    if (body[key]) return traverse(conf, body[key], i + 1, cb);

    // We're looking for another property
    traverse(conf, body, i + 1, cb);
  });
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

module.exports = 'hyper';