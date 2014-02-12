/*
  Singleton collection containing suggestions
*/

define(['models/SingletonCollection', 'models/Song'], function(Singleton, Song) {
  'use strict';
  var Suggestions = Singleton.extend({
    url: 'api/suggestions'
  });

  return new Suggestions();
});
