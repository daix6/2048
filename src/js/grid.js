module.exports = (function() {
  'use strict';

  var Pawn = require('./pawn.js');

  function Grid() {
    this.x = 4;
    this.y = 4;
    this.nodes = {0: [], 1: [], 2: [], 3: []};
  }

  Grid.prototype.createPawn = function() {
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);
    var value = Math.floor(Math.random() * 2) === 1 ? 4 : 2;

    var p = new Pawn(x, y, value, this);
    this.nodes[x].push(p);

    this.render();
  };

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
