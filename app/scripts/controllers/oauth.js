'use strict';

angular.module('redditOAuthTemplateApp')
  .run(function($window) {
    // TODO: move this util method somewhere more appropriate

    // can't parse out query string parameter using $location service
    // because reddit puts it before the hash bang of the url and 
    // https://github.com/angular/angular.js/issues/6172
    $window.location.getQueryVar = function(name, url) {
      if (!url) {
        url = window.location.href;
      }
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
      if (!results) {
        return 0;
      }
      return results[1] || 0;
    };
  })
  .controller('OauthCtrl', function($scope, $window, $log, $location, redditApi) {
    var code = $window.location.getQueryVar('code');
    redditApi.getAccessToken(code).then(function() {
      $location.path('/');
    });
  });