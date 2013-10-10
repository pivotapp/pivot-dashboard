/**
 * Module dependencies
 */

var app = require('.');
var envs = require('envs');
var token = require('access-token');

/**
 * Load the environment
 */

if (window.env) envs.set(window.env);

/**
 * Initialize the client
 */

var client = require('hyperagent');

/**
 * Pass the access token on all of the requests
 */

client.set(token.auth());

/**
 * Initialize the controllers
 */

var IndexController = require('./controllers/index');

/**
 * Initialize the directives
 */

require('./directives/hyper');
require('./directives/hyper-form');
require('./directives/hyper-input');

/**
 * Load the partials
 */

var apps = require('../partials/apps.js');

/**
 * Configure the app
 */

app.config([
  '$routeProvider',
  '$locationProvider',

  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: apps
      });
      // .otherwise({
      //   templateUrl: notFound,
      //   controller: IndexController
      // });

    $locationProvider.html5Mode(true);
  }
]);