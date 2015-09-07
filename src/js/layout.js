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

    if (game.win || game.over) {

      game.handle.emit('disable');

      if (game.win)
        this.renderWin();
      else
        this.renderOver();
      if (game.best && this.best < game.best) {
        this.best = game.best;
        this.renderBest();
      }
    }
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

  Layout.prototype.renderBest = function() {
    var eScore = document.getElementById('best');
    if (eScore.textContent)
      eScore.textContent = this.best;
    else
      eScore.innerHTML = this.best;
  }

  Layout.prototype.removeResult = function() {
    var eWin = document.getElementById('win'),
      eOver = document.getElementById('over');
    eWin.style.display = 'none';
    eOver.style.display = 'none';
    util.removeClass(eWin, 'result');
    util.removeClass(eOver, 'result');
  }

  return Layout;

}());
