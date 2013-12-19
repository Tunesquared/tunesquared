/** @jsx React.DOM */
'use strict';

/* TODO : preloading and fade transition.
  There's already two players and part of the 'transition' logic is implemented
  TODO : we could event display buffering status oO
*/

/*
  Master player component. Controls hidden players as well as the song flow.
  It takes consumes the playlist. To give the player a song, one must simply
  add it to the playlist. One cannot force a song to go in the player, it has
  to be first in the playlist at the moment songs are switched.
*/
define([
  'react',
  'jquery',
  'players/PlayerFactory',
  'mixins/persist',
  'players/LayoutProxy',
  'bootstrap-slider'],
  function (
    React,
    jquery,
    PlayerFactory,
    persist,
    LayoutProxy
) {

  var PROGRESS_STEP = 1000;

	var Player = React.createClass({

    getInitialState: function () {
      return {
        playing: false,
        volume: 50,
        currentPlayer: null,
        progress: 0,
        nextPlayer: null,
        currentSong: null,
        loading: true
      };
    },

    componentWillMount: function() {
      this._progressDrag = false;
    },

    componentDidMount: function () {
      var errors = PlayerFactory.checkCompatibility();
      // TODO : handle compatibility error
      if(errors){
        console.error('Compatibility errors');
        console.log(errors);
        this.props.onError(errors);
      }

      $(this.getDOMNode()).delegate('[data-ref="volume-slider"]', 'slide', this.onVolumeChange);
      $(this.getDOMNode()).delegate('[data-ref="progress-slider"]', 'slideStart', this.onProgressStart);
      $(this.getDOMNode()).delegate('[data-ref="progress-slider"]', 'slideStop', this.onProgressStop);
    },

    componentWillUnmount: function () {
      clearInterval(this._timeout);
    },

    componentWillReceiveProps: function (newProps) {
      if (this.props.playbackController) {
        this.props.playbackController.off(null, null, this);
      }

      if (newProps.playbackController) {
        this.setState(newProps.playbackController.state);
        newProps.playbackController.on('stateChange', this.onCtrlStateChange, this);
      }

    },

    onCtrlStateChange: function(state) {
      this.setState(state);
    },

		componentDidUpdate: function(){
      if (this.state.currentPlayer != null){
        var volume = $(this.refs['volume-slider'].getDOMNode())
          .slider({
            max: 100,
            min: 0,
            tooltip: 'hide'
          });

        if(volume.slider('getValue') !== this.state.volume)
          volume.slider('setValue', this.state.volume);

        var progress = $(this.refs['progress-slider'].getDOMNode()).slider({
          max: PROGRESS_STEP,
          min: 0,
          formater: this.progressFormatter
        });

        if(progress.slider('getValue') !== this.state.progress && this._progressDrag === false)
          progress.slider('setValue', this.state.progress * PROGRESS_STEP);

        if (this.state.currentPlayer.getVolume() !== this.state.volume) {
          this.state.currentPlayer.setVolume(this.state.volume);

          if(this.state.nextPlayer != null){
            this.state.nextPlayer.setVolume(this.state.volume);
          }
        }
      }
		},

    // Formats raw progress bar value to printable value
    progressFormatter: function(val) {
      var secs = Math.round((this.state.currentPlayer.getDuration() * val/PROGRESS_STEP)/1000);
      return ('00' + Math.round((secs/60))).substr(-2) + ':' + ('00' + (secs % 60)).substr(-2);
    },

    onPlay: function (evt) {
      evt.preventDefault();
      if(this.state.currentPlayer)
        this.state.currentPlayer.play();
    },

    onPause: function (evt) {
      evt.preventDefault();
      if(this.state.currentPlayer)
        this.state.currentPlayer.pause();
    },

    onSkip: function(evt){
      evt.preventDefault();
      if(this.state.currentPlayer)
        this.state.currentPlayer.trigger('end');
    },

    onVolumeChange: function(e) {

      this.setState({
        volume: e.value
      });
    },

    onProgressStart: function () {
      this._progressDrag = true;
    },

    onProgressStop: function (e) {
      this._progressDrag = false;
      var player = this.state.currentPlayer;
      if(player){
        player.seekTo(player.getDuration() * e.value/PROGRESS_STEP);
      }
    },

		render: function () {
      if (this.state.currentPlayer != null) {
        var song = this.state.currentPlayer.song.toJSON();

        var playButton = this.state.playing ?
            <a href="#" class="btn btn-primary btn-play" onClick={this.onPause}><i class="icon-pause"></i></a> :
            <a href="#" class="btn btn-primary btn-play" onClick={this.onPlay}><i class="icon-play"></i></a>;

        return (
        <div id="player">
          <div class="player-controls">
            {playButton}
            <a href="#" class="btn btn-default btn-skip" onClick={this.onSkip}>
              <i class="icon-fast-forward"></i>
            </a>
          </div>
          <div class="player-volume">
            <i class="pull-left icon-volume-up volume-icon"></i>
            <div class="volume-slider" data-ref="volume-slider" ref="volume-slider"></div>
          </div>
          <div class="player-track-section clearfix">
            <img class="song-thumb" src={song.thumb} />
            <span class="player-song-title">{song.title}</span>
            <div class="progress-slider" data-ref="progress-slider" ref="progress-slider"></div>
          </div>
        </div>);
      } else if (this.state.loading){
        return <div id="player"> <img src="img/ajax-loader.gif" /></div>;
      }

      return <div id="player"></div>;
		}
	});

	return Player;
});
