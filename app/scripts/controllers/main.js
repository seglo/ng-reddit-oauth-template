'use strict';

angular.module('redditOAuthTemplateApp')
  .controller('MainCtrl', function($scope, $log, $window, redditApi) {
    if (redditApi.isAuthenticated()) {
      angular.element('#getUserInfo').removeAttr('disabled');
    }

    $scope.authorizeApp = function() {
      $window.location.href = redditApi.authorizeUrl();
    };

    $scope.getUserInfo = function() {
      redditApi.getApiMe().then(function(result) {
        $scope.userInfo = JSON.stringify(result.data, undefined, 2);
      });
    };
  });