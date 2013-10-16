define([
  // libs
  '$', 'backbone', 'underscore',

  // application deps
  'views/SongView',
  'views/SearchSongView',
  'models/Song',
  'search/Search',

  // implicit libs
  'bs/collapse'

  ], function($, Backbone, _, SongView, SearchSongView, Song, Search) {

  'use strict';

  var SearchView = Backbone.View.extend({
    CHUNK_SIZE: 20,

    initialize: function() {
      _.bindAll(this, 'loadResult', 'addSong');

      this.searchAggregator = new Search({
        chunkSize: this.CHUNK_SIZE,
        preloadThreshold: 3
      });

      this.searchAggregator.addSrc('youtube');

      this.queryText = '';
      this.query = null;

      // Remembers party song views in order to free them when no more needed
      this.partySongViews = {};

      this.template = _.template($('#searchTemplate').html());

      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));

      this.$partySongs = this.$('#partySongs');
      this.$searchSongs = this.$('#searchSongs');
    },

    loadResult: function(result) {
      var song = new Song(result);
      var view = new SearchSongView({
        model: song
      });

      view.on('addSong', this.addSong);

      this.$searchSongs.append(view.$el);
    },

    // Adds a new song to the playlist
    addSong: function(song) {
      $.mobile.loading('show');
      console.log(song);
      this.party.get('playlist').add(song, {
        success: function() {
          $.mobile.loading('hide');
          window.location.hash = '#';
        },
        error: function() {
          $.mobile.loading('hide');
          $.alert('An error occured', $.tooltip.ERROR);
        },
        //silent: true
      });
    },

    filterPartySongs: function () {
      var q = this.queryText;
      var newViews = {};
      var view, i;

      // Filters collection
      var songs = this.party.get('playlist').filter(function(m) {
        return m.get('title').toLowerCase().indexOf(q.toLowerCase()) !== -1;
      });

      // Generate missing dom nodes
      for(i in songs) {
        view = this.partySongViews[i];
        if (view === undefined) {
          view = new SongView({model: songs[i]});
          this.$partySongs.append(view.el);
        } else {
          delete this.partySongViews[i];
        }
        newViews[i] = view;
      }

      // Removes previous dom nodes we no longer need
      for (i in this.partySongViews) {
        this.partySongViews[i].el.remove();
        this.partySongViews[i].release();
      }

      this.partySongViews = newViews;
    },

    clean: function() {
      for(var i in this.partySongViews) {
        this.partySongViews[i].release();
        delete this.partySongViews[i];
      }
      this.$partySongs.children().remove();
    },

    setParty: function(party) {
      if (this.party == null || party.id != this.party.id) {
        this.clean();
        this.party = party;
        this.render();
      }
    },

    search: function(q) {
      if (this.queryText !== q) {
        this.query = this.searchAggregator.query(q);
        this.query.exec();
        this.queryText = q;
        this.$searchSongs.empty();

        Search.util.fetchResults(this.query, this.CHUNK_SIZE, {
          read: this.loadResult
        });
      }
      this.filterPartySongs();
    }
  });

  return SearchView;
});
