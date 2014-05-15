'use strict';

describe('Service: redditApi', function () {

  // load the service's module
  beforeEach(module('redditOAuthTemplateApp'));

  // instantiate service
  var redditApi;
  beforeEach(inject(function (_redditApi_) {
    redditApi = _redditApi_;
  }));

  xit('should do something', function () {
    expect(!!redditApi).toBe(true);
  });

  xit('foo', function(){
    expect(redditApi.login('sean', 'mypass')).toBe('mypass');
  })

});
