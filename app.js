/**
 * Module dependencies
 */

var stack = require('simple-stack-ui');
var sso = require('./lib/sso-access-token');

/**
 * Expose the app
 */

var app = module.exports = stack({
  restricted: false
});

/**
 * Initialize sso login for applications
 */

app.useAfter('base', '/apps', sso());

/**
 * Setup app-wide locals
 */

app.env('API_URL', '/api');
