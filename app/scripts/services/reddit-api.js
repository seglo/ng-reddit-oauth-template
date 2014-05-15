'use strict';
/*jshint unused: false */
angular.module('redditOAuthTemplateApp')
  .factory('redditConfig', function redditConfig($window) {
    return {
      redditApp: {
        clientId: 'qWs6r0l6hXwQVA',
        clientSecret: 'hT3vlEu20FCqTyH3qDl7t2lf4Zg',
        scope: 'identity,read,mysubreddits',
        redirectUri: $window.chrome.extension.getURL('/') + 'app/index.html#/oauth/'
      }
    };
  })
  .factory('redditApi', function redditApi($http, $log, $window, $q, redditConfig) {
    var baseSslUrl = 'https://ssl.reddit.com';
    var baseOAuthUrl = 'https://oauth.reddit.com';

    var accessToken;

    var get = function(url, config) {
      url = baseOAuthUrl + url;
      return $http.get(url, config).error(logError);
    };

    var post = function(url, params, config) {
      url = baseOAuthUrl + url;
      return $http.post(url, params, config).error(logError);
    };

    var logError = function(data) {
      $log.error('Error: ' + JSON.stringify(data));
      return $q.reject(data);
    };

    // This $http config is used to exchange the request token for a user access token
    var redditAccessTokenConfig = function() {
      return {
        headers: {
          'Authorization': 'Basic ' + btoa(redditConfig.redditApp.clientId + ':' + redditConfig.redditApp.clientSecret),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        withCredentials: true,
        transformRequest: [

          function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
          }
        ]
      };
    };

    // This $http config is used for all reddit API calls after OAuth is complete
    var redditAuthConfig = function() {
      return {
        headers: {
          'Authorization': 'bearer ' + accessToken
        },
        withCredentials: true,
        transformRequest: [

          function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
          }
        ]
      };
    };

    /*
     * Encode request data like jQuery.post (formdata) instead of the default JSON request payload
     * http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
     */
    var param = function(obj) {
      var query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    return {
      authorizeUrl: function() {
        return baseSslUrl +
          '/api/v1/authorize?client_id=' + redditConfig.redditApp.clientId +
          '&response_type=code' +
          '&state=foo' +
          '&redirect_uri=' + $window.encodeURIComponent(redditConfig.redditApp.redirectUri) +
          '&duration=temporary' +
          '&scope=' + redditConfig.redditApp.scope;
      },
      /*jshint camelcase: false */
      getAccessToken: function(code) {
        var authCode = {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redditConfig.redditApp.redirectUri
        };

        return $http
          .post(baseSslUrl + '/api/v1/access_token', authCode, redditAccessTokenConfig())
          .then(function(result) {
            accessToken = result.data.access_token;
          });
      },
      /*jshint camelcase: true */
      getApiMe: function() {
        return get('/api/v1/me', redditAuthConfig());
      },
      isAuthenticated: function() {
        return angular.isDefined(accessToken);
      }
    };
  });
/*jshint unused: true */