/*
  Player.js

  This abstract class describes the API all players should implement.
  Instances of Player usually wrapp some external player such as youtube's.
  They should map all actions to the actual player and fix any issue so that the
  exported `Player` complies with this API.

  A player provides the following capabilities:
  - playback control
  - compatibility check
  - Resources management
  - Visualisation

  Each player is disposable and bound to one signle song. It should avoid polluting
  global namespace and free all ressources when removed.

  See comments bellow for further information.
*/

var UNIMPLEMENTED = 'The method is not implemented.';

define(
  ['underscore', 'backbone', 'players/LayoutManager'],
  function (_, Backbone, LayoutManager) {
    'use strict';

    // --- Construction ---

    /*
      Constructor for player.

      Constructs a Player instance for the given `song`. The visualisation will
      be rendered in the DOM `element` and `ready` is called as soon as the player
      is ready to operate.

      Since your player extends `Player`, don't forget to add:
      `_.extend(MyPlayer.prototype, Player.prototype);`
      and to call the superclas's constructor (see example).
      also, `_.extend(MyPlayer, Player);` is recommended but not mandatory.


      arguments:
      - song [Song] : Song model (see models/Song.js) this player is bound to
      - element [DOM Node]: Native DOM node for the visualisation.
      - ready [function]: Callback to invoke when player is ready to play.
        The callback takes one argument: an error string.

      example:
      function MyPlayer(song, element, ready) {
        // Don't to call the super constructor
        Player.apply(this, arguments);

        // You would tipically use some method to create an actual player. This is
        // likely done in some asynchronous fashion and most of the time requires
        // a DOM node, good, we have `element`. Be sure to hide any control from
        // the visualisation, it should only be decorative, not functionnal.
        createHardPlayer(song.get('data'), element, function(error, hardPlayer) {
          // Then maybe you'll get an error, send it.
          if (error)
            return ready('Something went wrong'); // (Try to be more descriptive)

          // If all went fine, you will need a handler to the hard player
          this._handler = hardPlayer;

          // Tell upper layer we're good to go.
          ready();
        });
      }

      _.extend(MyPlayer, Player);
      _.extend(MyPlayer.prototype, Player.prototype);
    */
    function Player(song, element /*, ready*/ ) {

      /* Public attributes */
      /* song contains `song` from the constructor */
      this.song = song;
      /* el contains `element` from the constructor */
      this.el = element;


      /* Private attributes, beware not to overwrite them */
      this._layoutManager = null;
    }

    // --- Events ---

    /*
      Player extends Backbone's Events.
      Possible events are:
      - 'play': when playback just resumed
      - 'pause': when playback just paused
      - 'buffering': when player is buffering
      - 'stop': when player stopps
      - 'end': when player ends

      Contract:
      - pause state should always be user-initiated. That means any pause event
      initiated by the internal player should not leak outside.

    */
    _.extend(Player.prototype, Backbone.Events);


    // --- Class methods ---

    /*
      You must set this property for PlayerFactory to know what player to use when
      it receives a song. It must match Song.source.
    */
    Player.sourceName = 'none';

    /*
      This static method checks for compatibility errors and returns a single string
      explaining what's wrong.
    */
    Player.checkCompatibility = function () {
      throw new Error(UNIMPLEMENTED);
    };


    // --- Instance methods ---

    /*
      Starts music playback.
      Send a 'play' event after playback has resumed.
    */
    Player.prototype.play = function () {
      throw new Error(UNIMPLEMENTED);
    };

    /*
      Pauses music playback.
      Sends a 'pause' event after playback has paused.
    */
    Player.prototype.pause = function () {
      throw new Error(UNIMPLEMENTED);
    };

    /*
      Stopps music playback.
      Sends a 'stop' event after playback has stopped.
    */
    Player.prototype.stop = function () {
      throw new Error(UNIMPLEMENTED);
    };


    /*
      Sets the volume on a scale from 0 to 100.
    */
    Player.prototype.setVolume = function ( /* vol */ ) {
      throw new Error(UNIMPLEMENTED);
    };

    /*
      Seeks player to `time` position. `time` is given in milliseconds.

      Note on seek time:
        Seek time can only be modified by normal playback progression, calls to
        seekTo and calls to stop.
        The underlying player can never force seek time. For instance, if seekTo
        is called and player "laggs", then seek time should not go back to the
        previous position. Instead, it should stick to the new position until the
        underlying player is able to carry on with the playback at the right position.
    */
    Player.prototype.seekTo = function ( /* time */ ) {
      throw new Error(UNIMPLEMENTED);
    };


    /*
      Returns current playback time in milliseconds.
    */
    Player.prototype.getSeekTime = function () {
      throw new Error(UNIMPLEMENTED);
    };

    /*
      Returns song duration in milliseconds.
    */
    Player.prototype.getDuration = function () {
      throw new Error(UNIMPLEMENTED);
    };

    /*
      Returns player state as a string.
      State is one of 'playing' or 'stopped'. Whenever the song is not played,
      the player is 'stopped';
    */
    Player.prototype.getState = function () {
      throw new Error(UNIMPLEMENTED);
    };


    // The following methods don't need or must not be reimplemented.

    /*
      Use this method to free all allocated ressources.
    */
    Player.prototype.release = function () {};

    /*
      final, shouldn't be reimplemented.
      Returns current playback progress normalized between 0 and 1.
    */
    Player.prototype.getProgress = function () {
      return this.getSeekTime() / this.getDuration();
    };

    /*
      final, shouldn't be reimplemented
      Returns the layout manager for this player.

      You can specify layout parameters by defining this.layout in your player's
      constructor. this.layout is passed as options to LayoutManager's constructor

      see players/LayoutManager.js
    */
    Player.prototype.getLayoutManager = function () {
      if (this._layoutManager === null) {
        this._layoutManager = new LayoutManager(this.el, this.layout);
      }
      return this._layoutManager;
    };


    return Player;
  });
