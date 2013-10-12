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
var HyperController = require('./controllers/hyper');

/**
 * Initialize the directives
 */

require('./directives/hyper');
require('./directives/hyper-bind');
require('./directives/hyper-form');
require('./directives/hyper-input');
require('./directives/hyper-link');

/**
 * Load the partials
 */

var account = require('../partials/account');
var apps = require('../partials/apps');
var appPartial = require('../partials/app');
var events = require('../partials/events');
var bandits = require('../partials/bandits');

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
      })
      .when('/account', {
        templateUrl: account
      })
      .when('/apps/:app', {
        templateUrl: appPartial,
        controller: HyperController
      })
      .when('/apps/:app/events', {
        templateUrl: events,
        controller: HyperController
      })
      .when('/apps/:app/bandits', {
        templateUrl: bandits,
        controller: HyperController
      });
      // .otherwise({
      //   templateUrl: notFound,
      //   controller: IndexController
      // });

    $locationProvider.html5Mode(true);
  }
]);
