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
    thumb: '//i.ytimg.com/vi/_ovdm2yX4MA/1.jpg',
    title: 'Levels',
  }, {
    artist: 'LMFAO',
    data: 'SkTt9k4Y-a8',
    source: 'youtube',
    thumb: '//i.ytimg.com/vi/SkTt9k4Y-a8/1.jpg',
    title: 'Sorry For Party Rocking'
  }, {
    artist: 'Scott & Brendo',
    data: 'JW6N18cEZuc',
    source: 'youtube',
    thumb:  '//i.ytimg.com/vi/JW6N18cEZuc/1.jpg',
    title: 'Higher (feat. Peter Hollens)'
  }, {
    artist: 'Art District',
    data: 'z0LUFgItzYw',
    source: 'youtube',
    thumb: '//i.ytimg.com/vi/z0LUFgItzYw/1.jpg',
    title: 'Cell'
  }, {
    artist: 'MACKLEMORE & RYAN LEWIS',
    data: 'QK8mJJJvaes',
    source: 'youtube',
    thumb: '//i.ytimg.com/vi/QK8mJJJvaes/1.jpg',
    title: 'THRIFT SHOP FEAT. WANZ (OFFICIAL VIDEO)'
  }, {
    artist: 'Madeon',
    data: 'P7iESu2XuCU',
    source: 'youtube',
    thumb: '//i.ytimg.com/vi/P7iESu2XuCU/1.jpg',
    title: 'Pendulum - The Island'
  }
];

new framework.Router({
  'api/suggestions': function(req, res) {

    res.setHeader('Content-Type', 'application/json');
    res.send(suggestions);
  }
});
