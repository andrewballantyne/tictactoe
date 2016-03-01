/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
class Main {
  constructor() {
    console.log("App started");

    Players.init();

    var gameState:GameState = new GameState();

    new CellWatcher(gameState);
    new GameDetails(gameState);
    new DialogHandler(gameState);
  }
}

window.addEventListener('load', function () {
  new Main();
});