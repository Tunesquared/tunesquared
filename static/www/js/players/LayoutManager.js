
/*
  Allows user interface to fix a div in the page without modifying the DOM.

  This class is used to place music illustrations such as video clips or
  visual effects. These elements may be tied to music playback and modifying the
  DOM may cause playback to stop/restart/lagg... Therefore, this layer
  the uses absolute positionning and timeouts to move the element around and attach it to
  the page without interrupting the playback. (Yeah, it's a big fat hack).

  Usage:
    LayoutManager(elem, options): contructor
      Constructs a layout manager for the provided element.
      Element must be at DOM top-level otherwise glitches may occur.
      options:
        move: ('children'|'root') Wether moving operations should be performed on root or children nodes (defautls to root)
        size: ('children'|'root') Wether resize operations should be performed on root or children nodes (defautls to children)
        resizeMethod: [String] What jquery method to use for resize, ie. 'attr' (defaults to 'css')

    moveTo(left, top[, w, h]): moves the element to position (left, top) and resizes it if necessary

    moveTo(dummy, options): alias for moveToElement

    resize(w, h): Resizes the element

    moveToElement(dummy, options): moves and resizes the element to overlap dummy.
      options: {resize: [Boolean] set to false to disable resizing (defaults to true)}

    attachTo(dummy): attatches the element to the provided dummy. The element will be moved
      and resized to overlap completely dummy's position. Whenever dummy moves

    detach(): Stopps listening for moves of the dummy. Element is left in place

    hide(): Puts the element somewhere where it cannot be seen. Calls detach if it is attached.
*/
define(['jquery', 'underscore'], function($, _) {
  'use strict';

  LayoutManager.UPDATE_DELAY = 100; // 100ms between each check
  LayoutManager.DEFAULT_OPTIONS = {
    move: 'root',
    size: 'children',
    resizeMethod: 'css'
  };

  function LayoutManager(elem, options) {
    this.el = $(elem);
    this.update = $.proxy(this.update, this);

    this.options = _.defaults(options || {}, LayoutManager.DEFAULT_OPTIONS);
  }

  LayoutManager.prototype.moveTo = function(left, top, w, h) {
    if (!_.contains(['number', 'string'], typeof left)) {
      return this.moveToElement(
        left /* elem */,
        top /* options */
      );
    }

    this.getMoveElem()
      .offset({
        left: left,
        top: top,
      });

    this.resize(w, h);
  };

  LayoutManager.prototype.moveToElement = function(dummy, options) {
    this.getMoveElem().offset( dummy.offset() );

    if (!options || options.resize !== false) {
      this.resize(dummy.width(), dummy.height());
    }
  };

  LayoutManager.prototype.resize = function(w, h) {
    this.getSizeElem()[this.options.resizeMethod]({
      width: w,
      height: h
    });
  };

  LayoutManager.prototype.attachTo = function(dummy) {
    this.detach();
    this.target = $(dummy);
    this.interval = window.setInterval(this.update, LayoutManager.UPDATE_DELAY);
    this.update();
  };

  LayoutManager.prototype.detach = function() {
    if (this.interval != null) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
  };

  LayoutManager.prototype.hide = function() {
    this.detach();
    this.moveTo(-10000, -10000);
  };

  // private
  LayoutManager.prototype.update = function() {
    this.moveTo(this.target);
  };

  LayoutManager.prototype.getMoveElem = function() {
    return (this.options.move === 'root') ? this.el : this.el.children();
  };
  LayoutManager.prototype.getSizeElem = function() {
    return (this.options.size === 'root') ? this.el : this.el.children();
  };

  return LayoutManager;
});
