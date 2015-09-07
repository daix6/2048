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
      40: 3
    };

    util.addEvent(document, 'keydown', function(event) {
      var direction = map[event.which];
      if (typeof direction !== 'undefined') {
        that.emit('move', direction);
        event.preventDefault();
      }
    });

    var retrys = document.getElementsByClassName('retry');
    for (var i = 0, len = retrys.length; i < len; i++) {
      return function(index) {
        util.addEvent(retrys[index], 'click', function(event) {
          that.emit('retry');
          event.preventDefault();
        });
      }(i);
    }
  }

  return Handle;
}());
