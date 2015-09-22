module.exports = (function() {
  'use strict';

  var util = require('./util.js');

  function Handle() {
    this.handler = [];
  }

  Handle.prototype.on = function(event, callback) {
    if (!this.handler[event])
      this.handler[event] = [];
    
    this.handler[event].push(callback);
    return this;
  }

  Handle.prototype.emit = function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, len = this.handler[event].length; i < len; i++)
      this.handler[event][i].apply(this, args);

    return this;
  }

  Handle.prototype.remove = function(event) {
    this.handler[event] = [];
    return this;
  }

  Handle.prototype.setUp = function() {
    var that = this;
    var map = {
      37: 0,
      38: 1,
      39: 2,
      40: 3,
      65: 0,
      68: 2,
      87: 1,
      83: 3,
      97: 0,
      119: 1,
      100: 2,
      115: 3
    };

    var touchStart = window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart',
      touchMove = window.navigator.msPointerEnabled ? 'MSPointerMove' : 'touchmove',
      touchEnd = window.navigator.msPointerEnabled ? 'MSPointerUp' : 'touchend';

    util.addEvent(document, 'keydown', function(event) {
      var direction = map[event.which];
      if (typeof direction !== 'undefined') {
        that.emit('move', direction);
        event.preventDefault();
      }
    });

    var fromx, fromy, tox, toy;
    var container = document.getElementsByClassName('game-container')[0];
    util.addEvent(container, touchStart, function(event) {
      if ((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches > 1)
        return;
      // if more than one finger

      if (window.navigator.msPointerEnabled) {
        fromx = event.pageX;
        fromy = event.pageY;
      } else {
        fromx = event.touches[0].clientX;
        fromy = event.touches[0].clientY;
      }

      event.preventDefault();
    });

    util.addEvent(container, touchMove, function(event) {
      event.preventDefault();
      return;
    });

    util.addEvent(container, touchEnd, function(event) {
      if ((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches > 1)
        return;
      // if more than one finger

      if (window.navigator.msPointerEnabled) {
        tox = event.pageX;
        toy = event.pageY;
      } else {
        tox = event.changedTouches[0].clientX;
        toy = event.changedTouches[0].clientY;
      }

      var dx = Math.abs(fromx - tox);
      var dy = Math.abs(fromy - toy);
      
      if (Math.max(dx, dy) > 10 && !(Math.min(dx, dy) > 200))
        that.emit('move', dx > dy ? (tox > fromx ? 2 : 0) : (toy > fromy ? 3 : 1));
    });

    var retrys = document.getElementsByClassName('retry');
    for (var i = 0, len = retrys.length; i < len; i++) {
      (function(index) {
        util.addEvent(retrys[index], 'click', function(event) {
          event.preventDefault();
          that.emit('retry');
        });
        util.addEvent(retrys[index], 'touchend', function(event) {
          event.preventDefault();
          that.emit('retry');
        })
      }(i));
    }

    util.addEvent(window, 'beforeunload', function(event) {
      that.emit('store');
    });
  }

  return Handle;
}());
