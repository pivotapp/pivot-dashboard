/**
 * Module dependencies
 */

var stack = require('simple-stack-ui');
var sso = require('./lib/sso-access-token');
var routes = require('./public/javascripts/routes');

/**
 * Expose the app
 */

var app = module.exports = stack({
  restricted: false,
  routes: routes
});

/**
 * Initialize sso login for applications
 */

app.useAfter('base', '/apps', sso());

/**
 * Setup app-wide locals
 */

app.locals({
  app: 'pivot-dashboard',
  env: {
    API_URL: '/api'
  }
});
