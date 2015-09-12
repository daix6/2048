(function() {
  'use strict';

  var Grid = require('./grid.js');
  var Game = require('./game.js');
  var Handle = require('./handle.js');
  var Layout = require('./layout.js');
  var Store = require('./store.js');

  var game = new Game(Grid, Handle, Layout, Store);

  game.init();

}());
