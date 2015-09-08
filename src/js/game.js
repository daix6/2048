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
    this.best = 0;

    this.aim = 2048;
  }

  Game.prototype.init = function() {
    var that = this;

    that.score = 0;
    that.win = false;
    that.over = false;

    that.grid.setUp();
    that.layout.render(this);
    that.layout.renderScore(0);

    that.handle.on('move', this.move.bind(this));
    that.handle.on('retry', this.retry.bind(this));
    that.handle.on('disable', this.disable.bind(this));
    that.handle.setUp();
  };

  Game.prototype.move = function(dir) {
    var that = this;
    var offset = map[dir];
    var moved = false;

    var tranverse = {x: [0, 1, 2, 3], y: [0, 1, 2, 3]};
    if (offset.x === 1)
      tranverse.x = [3, 2, 1, 0];
    if (offset.y === 1)
      tranverse.y = [3, 2, 1, 0];

    tranverse.x.forEach(function(x) {
      tranverse.y.forEach(function(y) {
        var pawn = that.grid.getPawn(x, y);

        if (pawn) {
          var dest = pawn.getDest(offset);
          var next = that.grid.getPawn(dest.x + offset.x, dest.y + offset.y);

          if (next && next.value === pawn.value && !next.merged) {
            var mergePawn = new Pawn(next.x, next.y, next.value * 2, that.grid);
            mergePawn.merged = true;

            that.grid.movePawn(pawn, next.x, next.y);
            that.grid.movePawn(next, next.x, next.y);
            that.grid.insertPawn(mergePawn);
            that.score += mergePawn.value;

            if (mergePawn.value === that.aim)
              that.win = true;

            moved = true;
          } else {
            if (pawn.x !== dest.x || pawn.y !== dest.y)
              moved = true;
            that.grid.movePawn(pawn, dest.x, dest.y);
          }
        }
      });
    });

    if (moved) {
      that.grid.createPawn();
    } else if (!that.grid.canMove()) {
      that.over = true;
    }
    that.layout.render(that);
    that.layout.renderScore(that.score);
  };

  Game.prototype.retry = function() {
    var that = this;

    that.score = 0;
    that.win = false;
    that.over = false;

    that.layout.removeResult();
    that.grid.setUp();
    that.layout.render(this);
    that.layout.renderScore(0);

    that.handle.on('move', this.move.bind(this));
  }

  Game.prototype.disable = function() {
    var that = this;
    that.handle.remove('move');
  }

  return Game;

}());
