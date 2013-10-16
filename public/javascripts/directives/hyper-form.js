/**
 * Module dependencies
 */

var app = require('..');
var each = require('each');
var client = require('hyperagent');

/**
 * hyperForm
 */

function hyperForm() {
  return {
    require: 'hyperForm',
    scope: true,
    controller: function() {},
    link: function($scope, elem, attrs) {
      elem.css('display', 'none');
      var onsubmit = attrs.hyperDone ? $scope.$eval(attrs.hyperDone) : noop;
      $scope.$watch(attrs.hyperForm, function(value) {
        if (!value || !value.action) return;

        elem.css('display', '');
        elem.attr('method', value.method || 'GET');
        elem.attr('action', value.action);

        $scope.inputs = {};

        each(value.input, function(name, conf) {
          if (conf.type === 'hidden') return elem.append('<input type="hidden" name="' + name + '" value="' + conf.value + '">');
          $scope.inputs[name] = conf;
        });

        // TODO handle form validation
        var lowerMethod = (value.method || 'GET').toLowerCase();

        // TODO improve this - the code looks terrible
        var form = elem[0];
        form.onsubmit = function() {
          var data = {};

          for (var i = form.length - 1; i >= 0; i--) {
            var input = form[i];
            if (input.name) data[input.name] = input.value;
          }

          var req = client[lowerMethod](value.action);

          if (lowerMethod === 'get') req.query(data);
          else req.send(data);

          req
            .on('error', onsubmit)
            .end(function(res) {
              onsubmit(null, res);
              // TODO make a request with the subscription service
              client.get(value.action).forceLoad().end(function() {});
            });
        };
      });
    }
  };
}

function noop() {}

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