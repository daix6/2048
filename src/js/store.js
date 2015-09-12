module.exports = (function() {

  'use strict';

  function Store() {
  }

  Store.prototype.store = function(game) {
    this.storeGame(game);
    this.storeGrid(game);
  }

  Store.prototype.storeGame = function(game) {
    if (!game.win && !game.over)
      window.localStorage.setItem('score', game.score);
    else
      window.localStorage.removeItem('score');
    window.localStorage.setItem('best', game.layout.best);
  }

  Store.prototype.storeGrid = function(game) {
    if (!game.win && !game.over)
      window.localStorage.setItem('nodes', game.grid.toString());
    else
      window.localStorage.removeItem('nodes');
  }

  return Store;

}());
