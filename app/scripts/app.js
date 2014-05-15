'use strict';

angular
  .module('redditOAuthTemplateApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/oauth', {
        templateUrl: 'views/oauth.html',
        controller: 'OauthCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($log, redditConfig) {
    $log.info('My chrome-extension reddit OAuth callback is cool: ' + redditConfig.redditApp.redirectUri);
  });
