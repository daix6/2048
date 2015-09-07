module.exports = (function() {
  'use strict';

  var util = require('./util');
  var Pawn = require('./pawn.js');
  var Layout = require('./layout.js');

  var map = {
    0: {x: 0, y: -1},
    1: {x: -1, y: 0},
    2: {x: 0, y: 1},
    3: {x: 1, y: 0}
  };

  function Game(Grid, Handle, Layout) {
    this.grid = new Grid();
    this.handle = new Handle();
    this.layout = new Layout();
  }

  Game.prototype.init = function() {
    this.score = 0;
    this.win = false;
    this.over = false;

    this.grid.setUp();
    this.layout.render(this);

    this.handle.on('move', this.move.bind(this));
    this.handle.setUp();
  };

  Game.prototype.move = function(dir) {
    var self = this;
    var offset = map[dir];
    var moved = false;

    var tranverse = {x: [0, 1, 2, 3], y: [0, 1, 2, 3]};
    if (offset.x === 1)
      tranverse.x = [3, 2, 1, 0];
    if (offset.y === 1)
      tranverse.y = [3, 2, 1, 0];

    tranverse.x.forEach(function(x) {
      tranverse.y.forEach(function(y) {
        var pawn = self.grid.getPawn(x, y);

        if (pawn) {
          var dest = pawn.getDest(offset);
          var next = self.grid.getPawn(dest.x + offset.x, dest.y + offset.y);

          if (next && next.value === pawn.value && !next.merged) {
            var mergePawn = new Pawn(next.x, next.y, next.value * 2, self.grid);
            mergePawn.merged = true;

            self.grid.movePawn(pawn, next.x, next.y);
            self.grid.movePawn(next, next.x, next.y);
            self.grid.insertPawn(mergePawn);
            self.score += mergePawn.value;

            moved = true;
          } else {
            if (pawn.x !== dest.x || pawn.y !== dest.y)
              moved = true;
            self.grid.movePawn(pawn, dest.x, dest.y);
          }
        }
      });
    });

    if (moved) {
      self.grid.createPawn();
      self.layout.render(self);
    }
  };

  return Game;

}());
