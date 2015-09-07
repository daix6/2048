module.exports = (function() {
  'use strict';

  function Layout() {
    this.score = 0;
    this.win = false;
    this.over = false;
  }

  Layout.prototype.render = function(game) {
    if (game.score && this.score < game.score) {
      this.score = game.score;
      this.renderScore();
    }
    game.grid.render();
  }

  Layout.prototype.renderScore = function() {
    var eScore = document.getElementById('score');
    if (eScore.textContent)
      eScore.textContent = this.score;
    else
      eScore.innerText = this.score;
  }

  return Layout;

}());
