module.exports = (function() {
  'use strict';

  function Pawn(x, y, value, gr) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.grid = gr;
  }

  Pawn.prototype.isValid = function() {
    if (this.x < 4 && this.y < 4)
      return true;
    return false;
  };

  Pawn.prototype.getDest = function(dir) {
    var dx, dy;

    if (dir === 0) {
      dx = -1;
      dy = 0;
    } else if (dir === 1) {
      dx = 0;
      dy = -1;
    } else if(dir === 2) {
      dx = 1;
      dy = 0;
    } else if (dir === 3) {
      dx = 0;
      dy = -1;
    } else
      return;
  };

  return Pawn;

}());
