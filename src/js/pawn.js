module.exports = (function() {
  'use strict';

  function Pawn(x, y, value, gr) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.grid = gr;

    this.merged = false;
    this.previous = null;
  }

  Pawn.prototype.getGrid = function() {
    return this.grid;
  };

  Pawn.prototype.getDest = function(to) {
    var current = {x: this.x, y: this.y};
    while (true) {
      var next = {x: current.x + to.x, y: current.y + to.y};
      if (this.grid.isValid(next.x, next.y) && !this.grid.isOccupied(next.x, next.y))
        current = next;
      else
        break;
    }
    return current;
  }

  Pawn.prototype.getNext = function(to) {
    return this.grid.getPawn(this.x + to.x, this.y + to.y);
  }

  return Pawn;

}());
