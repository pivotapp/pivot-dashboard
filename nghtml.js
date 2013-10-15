/**
 * Module dependencies
 */

var nghtml = require('nghtml');
var jade = require('jade');

module.exports = nghtml({
  webroot: 'public',
  'module': 'pivot',
  extension: '.jade',
  hook: function (content) {
    var compile = jade.compile(content);
    return compile();
  }
});
