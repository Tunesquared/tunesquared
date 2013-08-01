/** @jsx React.DOM */
'use strict';

/*
  Master player component. Controls hidden players as well as the song flow.
  It takes consumes the playlist. To give the player a song, one must simply
  add it to the playlist. One cannot force a song to go in the player, it has
  to be first in the playlist at the moment songs are switched.
*/
define(['react', 'jquery', 'jquery-ui'], function (React, jquery) {

	var Player = React.createClass({

    getInitialState: function () {
      /* States for the player are : 'empty', it waits for a new song to come in and start */
      return {
        /* When true, music is playing or will be as soon as the player will be fed with a song.
          Therefore, there exists a state where playing is true but no song is loaded. */
        playing: false,

        /* Volume is stored in player state so that it actually acts as a master
         and can keep it consistent across different player implementations */
        volume: 0.5,

        /* Player in foreground it's state is linked to the UI (loading, progress, etc...) */
        currentPlayer: null,

        /*
          Player in background, this one preloads the next track and, if there is time,
          contributes to the "smooth transition". It's state is never shown, it replaces currentPlayer
          when current song is skipped or ends.
          Assert : There can not be a nextPlayer if currentPlayer == null
        */
        nextPlayer: null
      };
    },

    componentWillReceiveProps: function (newProps) {
      if (this.props.playlist && newProps.playlist && this.props.playlist !== newProps.playlist) {
        this.props.playlist.off(null, null, this);
        this.fetchPlaylistForNextSong(newProps.playlist);
      }

    },

		componentDidUpdate: function(){
			$(this.refs['volume-slider'].getDOMNode()).slider({animate: 'fast'});
		},

    /*
      Tries to extract next song from the playlist.
      If it fails, listen to playlist's 'add' event to retry
    */
    fetchPlaylistForNextSong: function (playlist) {
      console.log('fetching playlist');

      if (playlist.length === 0){
        console.log('try again');
        playlist.once('add', this.fetchPlaylistForNextSong);
      } else {
        var song = playlist.first();
        playlist.remove(song);

        this.onNextSong(song);
      }
    },

    /* Called by fetchPlaylistForNextSong when it actually fetched a song from the playlist */
    onNextSong: function (song) {
      console.log('houra, song available : ');
      console.log(song);
    },

		render: function () {
			return <div id="player">
				<div class="container-fluid">
          <div class="row-fluid">
              <div class="span4">
                  <div class="img-container small"><img src="img/eve6.jpg" /></div>

              </div>
              <div class="span8">
                  <ul class="song-attributes">
                      <li><strong>Dat song</strong></li>
                      <li>by eve6</li>
                  </ul>
              </div>
          </div>
          <hr />
          <div class="row-fluid">
              <div class="player-actions clearfix">
                  <div class="action"><a href="#" class="btn play-button" ref="play-button" ><i class="icon-play"></i></a></div>
                  <div class="action"><a href="#" class="btn forward-button" ref="fwd-button"><i class="icon-fast-forward"></i></a></div>
                  <div class="action volume"><i class="icon-volume-up pull-left"></i><div class="volume-slider" ref="volume-slider"></div></div>
              </div>
          </div>
          <div class="row-fluid">
              <div ref="player-progress-slider"></div>
          </div>
      	</div>
      </div>;
		}
	});

	return Player;
});
