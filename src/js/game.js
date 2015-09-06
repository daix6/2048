module.exports = (function() {
  'use strict';

  var util = require('./util');
  var map = {
    0: {x: -1, y: 0},
    1: {x: 0, y: -1},
    2: {x: 1, y: 0},
    3: {x: 0, y: 1}
  };

  function Game(Grid, Handle) {
    this.grid = new Grid();
    this.handle = new Handle();
  }

  Game.prototype.init = function() {
    this.grid.createPawn();    

    this.handle.on('move', this.move.bind(this));
    this.handle.setUp();
  };

  Game.prototype.move = function(dir) {
    var self = this;
    var offset = map[dir];

    var tranverse = {x: [0, 1, 2, 3], y: [0, 1, 2, 3]};
    if (offset.x === 1)
      tranverse.y = [3, 2, 1, 0];
    if (offset.y === 1)
      tranverse.x = [3, 2, 1, 0];

    tranverse.x.forEach(function(x) {
      tranverse.y.forEach(function(y) {
        var pawn = self.grid.getPawn(x, y);

        if (pawn)
          console.log(pawn);
      });
    });
  };

  return Game;

}());
