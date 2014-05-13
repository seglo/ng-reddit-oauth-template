'use strict';

describe('Service: RedditApi', function () {

  // load the service's module
  beforeEach(module('superduperApp'));

  // instantiate service
  var RedditApi;
  beforeEach(inject(function (_RedditApi_) {
    RedditApi = _RedditApi_;
  }));

  xit('should do something', function () {
    expect(!!RedditApi).toBe(true);
  });

  xit('foo', function(){
    expect(RedditApi.login('sean', 'mypass')).toBe('mypass');
  })

});
