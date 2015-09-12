module.exports = (function() {
  'use strict';

  var Pawn = require('./pawn.js');
  var util = require('./util.js');

  function Grid() {
    this.size = 4;
    this.nodes = [];
  }

  Grid.prototype.setUp = function() {
    if (window.localStorage.getItem('nodes')) {
      var str = window.localStorage.getItem('nodes').split(',');
      for (var i = 0; i < this.size; i++) {
        this.nodes[i] = [];
        for (var j = 0; j < this.size; j++) {
          var v = str[i * this.size + j];
          if (v === 'n')
            this.nodes[i][j] = null;
          else
            this.nodes[i][j] = new Pawn(i, j, parseInt(v), this);
        }
      }
    } else {
      this.clear();
      this.createPawn();
    }
  }

  Grid.prototype.clear = function() {
    for (var i = 0; i < this.size; i++) {
      this.nodes[i] = [];
      for (var j = 0; j < this.size; j++)
        this.nodes[i][j] = null;
    }
  }

  Grid.prototype.isValid = function(x, y) {
    return x < this.size && x >= 0 && y < this.size && y >= 0;
  }

  Grid.prototype.isOccupied = function(x, y) {
    if (this.nodes[x][y])
      return true;

    return false;
  }

  Grid.prototype.isFull = function() {
    for (var i = 0; i < this.size; i++)
      for (var j = 0; j < this.size; j++)
        if (!this.nodes[i][j])
          return false;
    return true;
  }

  Grid.prototype.canMove = function() {
    if (!this.isFull())
      return true;

    for (var i = 0; i < this.size; i++)
      for (var j = 0; j < this.size; j++) {
        if (i < this.size - 1) {
          if (this.nodes[i][j].value === this.nodes[i+1][j].value)
            return true;
        }
        if (j < this.size - 1) {
          if (this.nodes[i][j].value === this.nodes[i][j+1].value)
            return true;
        }
      }

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
            p.innerHTML = node.value;

          if (node.merged) {
            util.addClass(p, 'p-' + node.x + '-' + node.y);
            util.addClass(p, 'merged');
          } else if (node.previous) {
            util.addClass(p, 'p-' + node.previous.x + '-' + node.previous.y);
          } else {
            util.addClass(p, 'p-' + node.x + '-' + node.y);
            util.addClass(p, 'new');
          }

          container.appendChild(p);

          if (node.previous)
            p.setAttribute('class', p.getAttribute('class').replace(/p-\d-\d/, 'p-' + node.x + '-' + node.y));

          node.merged = false;
          node.previous = null;
        }
  };

  Grid.prototype.toString = function() {
    var that = this;
    var result = '';

    for (var i = 0; i < that.size; i++)
      for (var j = 0; j < that.size; j++) {
        if (that.nodes[i][j])
          result += that.nodes[i][j].value;
        else
          result += 'n';

        if (!(i === that.size-1 && i === j))
          result += ',';
      }

    return result;
  }

  return Grid;

}());
