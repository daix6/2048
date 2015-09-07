module.exports = (function() {
  'use strict';

  var util = require('./util.js');

  function Layout() {
    this.score = 0;
    this.win = false;
    this.over = false;
  }

  Layout.prototype.render = function(game) {
    game.grid.render();
    if (game.score && this.score < game.score) {
      this.score = game.score;
      this.renderScore();
    }
    if (game.win)
      this.renderWin();
  }

  Layout.prototype.renderScore = function() {
    var eScore = document.getElementById('score');
    if (eScore.textContent)
      eScore.textContent = this.score;
    else
      eScore.innerHTML = this.score;
  }

  Layout.prototype.renderWin = function() {
    var eWin = document.getElementById('win');
    eWin.style.display = 'block';
    util.addClass(eWin, 'result');
  }

  Layout.prototype.renderOver = function() {
    var eOver = document.getElementById('over');
    eOver.style.display = 'block';
    util.addClass(eOver, 'result');
  }

  return Layout;

}());
