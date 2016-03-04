/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
class Main {
  constructor() {
    console.log("App started");

    Players.init();

    var optionState:OptionState = new OptionState();
    var gameState:GameState = new GameState();

    new CellWatcher(gameState);
    new GameDetails(gameState, optionState);
    new DialogHandler(gameState);
    new MainNavHandler();
    new OptionWatcher(optionState);
  }
}

window.addEventListener('load', function () {
  new Main();
});