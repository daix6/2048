module.exports = (function() {
  'use strict';

  var util = require('./util');
  var Pawn = require('./pawn.js');

  var map = {
    0: {x: 0, y: -1},
    1: {x: -1, y: 0},
    2: {x: 0, y: 1},
    3: {x: 1, y: 0}
  };

  function Game(Grid, Handle) {
    this.grid = new Grid();
    this.handle = new Handle();
  }

  Game.prototype.init = function() {
    this.score = 0;
    this.win = false;
    this.over = false;

    this.grid.setUp();

    this.handle.on('move', this.move.bind(this));
    this.handle.setUp();
  };

  Game.prototype.move = function(dir) {
    var self = this;
    var offset = map[dir];

    var tranverse = {x: [0, 1, 2, 3], y: [0, 1, 2, 3]};
    if (offset.x === 1)
      tranverse.x = [3, 2, 1, 0];
    if (offset.y === 1)
      tranverse.y = [3, 2, 1, 0];

    tranverse.x.forEach(function(x) {
      tranverse.y.forEach(function(y) {
        var pawn = self.grid.getPawn(x, y);

        if (pawn) {
          var dest = pawn.getDest(offset); // {x:, y:}
          var next = self.grid.getPawn(dest.x + offset.x, dest.y + offset.y); // Pawn

          if (next && next.value === pawn.value && !next.merged) {
            var mergePawn = new Pawn(next.x, next.y, next.value * 2, self.grid);
            mergePawn.merged = true;

            self.grid.removePawn(next.x, next.y);
            self.grid.removePawn(pawn.x, pawn.y);
            self.grid.insertPawn(mergePawn);
            self.score += mergePawn.value;
          } else
            self.grid.movePawn(pawn, dest.x, dest.y);
        }
      });
    });

    tranverse.x.forEach(function(x) {
      tranverse.y.forEach(function(y) {
        var pawn = self.grid.getPawn(x, y);

        if (pawn)
          pawn.merged = false;
      });
    });

    self.grid.createPawn();
    self.grid.render();
  };

  return Game;

}());
