module.exports = (function() {
  'use strict';

  var Pawn = require('./pawn.js');
  var util = require('./util.js');

  function Grid() {
    this.size = 4;
    this.nodes = [];
  }

  Grid.prototype.setUp = function() {
    for (var i = 0; i < this.size; i++) {
      this.nodes[i] = [];
      for (var j = 0; j < this.size; j++)
        this.nodes[i][j] = null;
    }

    this.createPawn();
    this.render();
  }

  Grid.prototype.isValid = function(x, y) {
    return x < this.size && x >= 0 && y < this.size && y >= 0;
  }

  Grid.prototype.isOccupied = function(x, y) {
    if (this.nodes[x][y])
      return true;

    return false;
  }

  Grid.prototype.getPawn = function(x, y) {
    if (!this.isValid(x, y))
      return null;

    return this.nodes[x][y];
  }

  Grid.prototype.createPawn = function() {
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);

    while (this.isOccupied(x, y)) {
      x = Math.floor(Math.random() * 4);
      y = Math.floor(Math.random() * 4);
    }

    var value = Math.random() < 0.3  ? 4 : 2;
    var p = new Pawn(x, y, value, this);

    this.nodes[x][y] = p;
  };

  Grid.prototype.insertPawn = function(p) {
    this.nodes[p.x][p.y] = p;
  }

  Grid.prototype.removePawn = function(x, y) {
    this.nodes[x][y] = null;
  }

  Grid.prototype.movePawn = function(p, x, y) {
    this.nodes[p.x][p.y] = null;
    p.previous = {x: p.x, y: p.y};
    p.x = x;
    p.y = y;
    this.nodes[x][y] = p;
  }

  Grid.prototype.clean = function() {
    var container = document.getElementsByClassName('numbers')[0];
    while (container.firstChild)
      container.removeChild(container.firstChild);
  }

  Grid.prototype.render = function() {
    var container = document.getElementsByClassName('numbers')[0];

    this.clean();

    for (var i = 0; i < this.size; i++)
      for (var j = 0; j < this.size; j++)
        if (this.nodes[i][j]) {
          var node = this.nodes[i][j];
          var p = document.createElement('div');
          p.setAttribute('class', 'c-' + node.value);
          if (p.textContent)
            p.textContent = node.value;
          else
            p.innerText = node.value;

          if (node.merged) {
            util.addClass(p, 'p-' + node.x + '-' + node.y);
            util.addClass(p, 'merged');
          } else if (node.previous) {
            util.addClass(p, 'p-' + node.previous.x + '-' + node.previous.y);
            if (node.previous.x !== node.x && node.previous.y === node.y) {
              var dx = node.x > node.previous.x ? 5 : -5;
              var topb = node.previous.x * 135;
              var tope = node.x * 135;

              var loop = function() {
                topb = topb + dx;
                p.style.top = topb + 'px';
                if (topb !== tope)
                  window.requestAnimationFrame(loop);
                else
                  p.setAttribute('class', p.getAttribute('class').replace(/p-\d-\d/, 'p-' + node.x + '-' + node.y));
              };
              loop();
            } else if (node.previous.x !== node.x && node.previous.y !== node.y) {
              var dy = node.y > node.previous.y ? 5 : -5;
              var leftb = node.previous.y * 135;
              var lefte = node.y * 135;

              var loop = function() {
                leftb = leftb + dy;
                p.style.left = leftb + 'px';
                if (leftb !== lefte)
                  window.requestAnimationFrame(loop);
                else
                  p.setAttribute('class', p.getAttribute('class').replace(/p-\d-\d/, 'p-' + node.x + '-' + node.y));
              };
              loop();
            }
          } else {
            util.addClass(p, 'p-' + node.x + '-' + node.y);
            util.addClass(p, 'new');
          }

          container.appendChild(p);

          node.merged = false;
          node.previous = null;
        }
  };

  return Grid;

}());
