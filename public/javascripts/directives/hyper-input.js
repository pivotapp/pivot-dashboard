/**
 * Module dependencies
 */

var app = require('..');

/**
 * hyperInput
 */

function hyperInput() {
  return {
    require: 'hyperInput',
    controller: function() {},
    link: function($scope, elem, attrs) {
      $scope.$watch(attrs.hyperInput, function(conf) {
        if (!conf) return elem.css('display', 'none');

        elem.css('display', '');

        var name = $scope.$eval(attrs.name);
        elem.attr('value', conf.value);
        elem.attr('type', conf.type || 'text');
        elem.attr('placeholder', conf.prompt || conf.placeholder || name);
        if (conf.required) elem.attr('required', 'required');

        // TODO do validation
      });
    }
  };
}

/**
 * Register it with angular
 */

app.directive('hyperInput', [
  hyperInput
]);

/**
 * Let others know where to find it
 */

module.exports = 'hyperInput';