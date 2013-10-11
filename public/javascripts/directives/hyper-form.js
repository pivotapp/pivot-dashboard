/**
 * Module dependencies
 */

var app = require('..');
var each = require('each');

/**
 * hyperForm
 */

function hyperForm() {
  return {
    require: 'hyperForm',
    scope: true,
    controller: function() {},
    link: function($scope, elem, attrs) {
      $scope.$watch(attrs.hyperForm, function(value) {
        if (!value || !value.action) return elem.css('display', 'none');

        elem.css('display', '');
        elem.attr('method', value.method || 'GET');
        elem.attr('action', value.action);

        $scope.inputs = {};

        each(value.input, function(name, conf) {
          if (conf.type === 'hidden') return elem.append('<input type="hidden" name="' + name + '" value="' + conf.value + '">');
          $scope.inputs[name] = conf;
        });

        // TODO handle form submission
      });
    }
  };
}

/**
 * Register it with angular
 */

app.directive('hyperForm', [
  hyperForm
]);

/**
 * Let others know where to find it
 */

module.exports = 'hyperForm';