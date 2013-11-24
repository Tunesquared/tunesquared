/*
  Provides suggestions based on most popular tunes.
  ...
  No just kidding, right now it's just plain json
*/
'use strict';

var framework = require('../../framework');

/*
  Hard coded suggestion data...
*/
var suggestions = [
  {
    artist: 'AVICII',
    data: '_ovdm2yX4MA',
    source: 'youtube',
    thumb: 'http://i.ytimg.com/vi/_ovdm2yX4MA/1.jpg',
    title: 'Avicii - Levels',
  }, {
    artist: 'LMFAO',
    data: 'SkTt9k4Y-a8',
    source: 'youtube',
    thumb: 'http://i.ytimg.com/vi/SkTt9k4Y-a8/1.jpg',
    title: 'LMFAO - Sorry For Party Rocking'
  }, {
    artist: 'AWOLNATION',
    data: 'JaAWdljhD5o',
    source: 'youtube',
    thumb: 'http://i.ytimg.com/vi/JaAWdljhD5o/1.jpg',
    title: 'SAIL - AWOLNATION'
  }
];

new framework.Router({
  'api/suggestions': function(req, res) {

    res.setHeader('Content-Type', 'application/json');
    res.send(suggestions);
  }
});
