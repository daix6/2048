module.exports = (function() {
  'use strict';

  var Pawn = require('./pawn.js');

  function Grid() {
    this.x = 4;
    this.y = 4;
    this.nodes = {0: [], 1: [], 2: [], 3: []};
  }

  Grid.prototype.isValid = function(x, y) {
    return x < this.x && x >= 0 && y < this.y && y >= 0;
  }

  Grid.prototype.isOccupied = function(x, y) {
    for (var i = 0, len = this.nodes[x].length; i < len; i++)
      if (this.nodes[x][i].y === y)
        return true;

    return false;
  }

  Grid.prototype.createPawn = function() {
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);

    while (this.isOccupied(x, y)) {
      x = Math.floor(Math.random() * 4);
      y = Math.floor(Math.random() * 4);
    }

    var value = Math.floor(Math.random() * 2) === 1 ? 4 : 2;
    var p = new Pawn(x, y, value, this);

    this.nodes[x].push(p);

    this.render();
  };

  Grid.prototype.getPawn = function(x, y) {
    for (var i = 0, len = this.nodes[x].length; i < len; i++)
      if (this.nodes[x][i].y === y)
        return this.nodes[x][i];
  }

  Grid.prototype.render = function() {
    var container = document.getElementsByClassName('numbers')[0];

    for (var i in this.nodes) {
      for (var j = 0, len = this.nodes[i].length; j < len; j++) {
        var node = this.nodes[i][j];
        var p = document.createElement('div');
        p.setAttribute('class', 'p-' + node.x + '-' + node.y + ' ' + 'c-' + node.value);
        if (p.textContent)
          p.textContent = node.value;
        else
          p.innerText = node.value;
        container.appendChild(p);
      }
    }
  };

  return Grid;

}());
