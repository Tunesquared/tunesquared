'use strict';

define(function () {
  function FakeSrc() {

    this.get = function (from, length, cb) {

      // Sets a timeout to better simulate a real source. However, instant source
      // may reveal intersting buggs ;)
      window.setTimeout(function () {
        var data = [];
        if (from < 50) {
          for (var i = from; i < from + length && i < 50; i++) {
            data.push({
              thumb: '/img/song-thumb-' + Math.floor((Math.random() * 9)) + '.jpg',
              artist: 'Lipsum' + Math.floor((Math.random() * 90 + 10)),
              title: 'Resultat n°' + (i + 1),
              source: 'fake',
              data: ((i*40000) % 79447).toString(36) // Deterministic data
            });
          }
        }
        cb(null, data);
      }, 1000);
    };
  }
  FakeSrc.title = 'FakeSrc';

  return FakeSrc;
});
