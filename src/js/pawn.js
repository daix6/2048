module.exports = (function() {
  'use strict';

  function Pawn(x, y, value, gr) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.grid = gr;
  }

  Pawn.prototype.getGrid = function() {
    return this.grid;
  };

  return Pawn;

}());
