/**
 * Module dependencies
 */

var app = require('.');
var routes = require('./routes');

/**
 * Initialize aux partials
 */

loadPartial('sidenav');
loadPartial('footer');
loadPartial('topnav');
loadPartial('apps');

/**
 * Start the app
 */

module.exports = require('simple-ui').run(app, {
  routes: routes,
  loader: loadPartial
});

/**
 * Helper function for resolving partial paths
 *
 * @api private
 */

function loadPartial(name) {
  return require('../partials/' + name);
}
