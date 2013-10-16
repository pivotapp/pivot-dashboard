/**
 * Module dependencies
 */

var app = require('..');
var encode = require('websafe-base64').encode;
var slug = require('slug');
var pathToRegexp = require('path-to-regexp');

/**
 * hyperLink
 */

function hyperLink() {
  return {
    require: 'hyperLink',
    controller: function() {},
    link: function($scope, elem, attrs) {
      if (!attrs.hyperProgressive) elem.css('display', 'none');
      var keys = [];
      pathToRegexp(attrs.hyperLink, keys);

      var exp = '[' + keys.map(function(key) {
        return key.name;
      }).toString() + ']';

      watchCollection.call($scope, exp, function(values) {
        if (!values) return;

        var loaded = true;

        var href = attrs.hyperLink;
        keys.forEach(function(key, i) {
          var v = values[i];
          var value = (v && v.href ? encode(v.href) : slug(v || ''));
          if (value === 0 || value) href = href.replace(':' + key.name, value);
          else loaded = false;
        });

        elem.attr('href', href);
        if (loaded) elem.css('display', '');
      });
    }
  };
}

function watchCollection(exp, fn) {
  if (this.$watchCollection) return this.$watchCollection(exp, fn);
  this.$watch(exp, fn, true);
}

/**
 * Register it with angular
 */

app.directive('hyperLink', [
  hyperLink
]);

/**
 * Let others know where to find it
 */

module.exports = 'hyperLink';