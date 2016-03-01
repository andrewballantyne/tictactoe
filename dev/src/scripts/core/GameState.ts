/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
interface BasicCallback {
  callback:Function;
  scope:Object;
}
interface PlayerChangeCallback extends BasicCallback {
  callback:(player:PlayerType, victor:boolean)=>void;
}
interface GameChangeCallback extends BasicCallback {
  callback:(gameStateType:StateType)=>void;
}

class GameState {
  private currentPlayer:PlayerType;
  private grid:GenericMap<PlayerType>;
  private victoryPossibilities:string[][];
  private victoryPath:number;
  private playerChangeNotifiers:PlayerChangeCallback[];
  private gameChangeNotifiers:GameChangeCallback[];
  private availableSpaces:number;

  constructor() {
    this.currentPlayer = null;
    this.grid = {};
    this.victoryPossibilities = null;
    this.victoryPath = null;
    this.playerChangeNotifiers = [];
    this.gameChangeNotifiers = [];
    this.availableSpaces = 0;

    this.setupRandomPlayer();
    this.setupGrid();
    this.setupVictoryPossibilities();
  }

  /**
   * Register a callback for when the player state changes.
   *
   * Callbacks are triggered on the following conditions:
   *  - If a change in players  = (player === the new player) && (victory === false)
   *  - If a player wins        = (player === winner)         && (victory === true)
   *  - If there is a tie       = (player === null)           && (victory === true)
   *
   * @param callback - A method that handles a PlayerType and a boolean parameter (see above more more details)
   * @param scope - The scope of the method
   */
  public listenForPlayerChanges(callback:(player:PlayerType, victory:boolean)=>void, scope:Object):void {
    this.playerChangeNotifiers.push({
      callback: callback,
      scope: scope
    });
  }

  /**
   * Register a callback for when the game state changes. For a list of what to listen for, look at StateType.
   * @see StateType
   *
   * @param callback - A method that handles a StateType change
   * @param scope - The scope of the method
   */
  public listenForGameChanges(callback:(newState:StateType)=>void, scope:Object):void {
    this.gameChangeNotifiers.push({
      callback: callback,
      scope: scope
    });
  }

  /**
   * Get the currently active player.
   *
   * @returns - The current player
   */
  public getCurrentPlayer():PlayerType {
    return this.currentPlayer;
  }

  /**
   * Register a player selection with the state.
   *
   * @param coordinate - The grid coordinate
   */
  public registerClick(coordinate:string):void {
    this.grid[coordinate] = this.currentPlayer;
    this.availableSpaces--;
    this.validate();
  }

  /**
   * Switch players.
   */
  public switchPlayer():void {
    if (this.currentPlayer === PlayerType.O_PLAYER) {
      this.currentPlayer = PlayerType.X_PLAYER;
    } else {
      this.currentPlayer = PlayerType.O_PLAYER;
    }

    this.notifyForPlayerChange(this.currentPlayer, false);
  }

  /**
   * Get victory path (if one exists).
   *
   * @returns - A string array of coordinates matching the win condition (or null if no victor yet)
   */
  public getVictoryPath():string[] {
    if (this.victoryPath === null) {
      return null;
    }

    return this.victoryPossibilities[this.victoryPath];
  }

  public resetAllData():void {
    Players.resetPlayerScores();
    this.reset();
    this.notifyForGameChange(StateType.RESET_DATA);
  }

  public newGame():void {
    this.reset();
    this.notifyForGameChange(StateType.NEW_GAME);
  }

  private notifyForPlayerChange(player:PlayerType, victor:boolean):void {
    this.notify(this.playerChangeNotifiers, [player, victor]);
  }

  private notifyForGameChange(newGameState:StateType):void {
    this.notify(this.gameChangeNotifiers, [newGameState]);
  }

  private notify(notifyList:BasicCallback[], data:any[]):void {
    for (var i:number = 0; i < notifyList.length; i++) {
      var callbackMapping:BasicCallback = notifyList[i];
      callbackMapping.callback.apply(callbackMapping.scope, data);
    }
  }

  private setupRandomPlayer():void {
    this.currentPlayer = PlayerType[PlayerType[Math.floor(Math.random() * Players.PLAYER_COUNT)]];
  }

  private setupGrid():void {
    this.grid["A1"] = null;
    this.grid["A2"] = null;
    this.grid["A3"] = null;
    this.grid["B1"] = null;
    this.grid["B2"] = null;
    this.grid["B3"] = null;
    this.grid["C1"] = null;
    this.grid["C2"] = null;
    this.grid["C3"] = null;
    this.availableSpaces = 9;
  }
  private setupVictoryPossibilities():void {
    this.victoryPossibilities = [[]];
    this.victoryPossibilities.push(["A1", "A2", "A3"]); // top row
    this.victoryPossibilities.push(["B1", "B2", "B3"]); // middle row
    this.victoryPossibilities.push(["C1", "C2", "C3"]); // bottom row
    this.victoryPossibilities.push(["A1", "B1", "C1"]); // first col
    this.victoryPossibilities.push(["A2", "B2", "C2"]); // second col
    this.victoryPossibilities.push(["A3", "B3", "C3"]); // third col
    this.victoryPossibilities.push(["A1", "B2", "C3"]); // diagonal top-left to bottom-right
    this.victoryPossibilities.push(["A3", "B2", "C1"]); // diagonal top-right to bottom-left
  }

  private validate():void {
    var victor:PlayerType = null;
    var victoryPath:number = -1;

    for (var i:number = 0; i < this.victoryPossibilities.length; i++) {
      var victoryCondition:string[] = this.victoryPossibilities[i];

      var oCount:number = 0;
      var xCount:number = 0;
      for (var cond:number = 0; cond < victoryCondition.length; cond++) {
        var coordinate:string = victoryCondition[cond];

        if (this.grid[coordinate] === PlayerType.O_PLAYER) {
          oCount++;
        }
        if (this.grid[coordinate] === PlayerType.X_PLAYER) {
          xCount++;
        }
      }

      if (oCount === 3) {
        victor = PlayerType.O_PLAYER;
        victoryPath = i;
      }
      if (xCount === 3) {
        victor = PlayerType.X_PLAYER;
        victoryPath = i;
      }
    }

    if (victor !== null) {
      // Someone Won
      console.warn("Victor Determined: " + PlayerType[victor]);
      this.victoryPath = victoryPath;
      this.notifyForPlayerChange(victor, true);
    } else if (this.availableSpaces <= 0) {
      // Tie
      console.warn("Victor Determined: No One");
      this.victoryPath = null;
      this.notifyForPlayerChange(null, true);
    }
  }

  private reset():void {
    this.victoryPath = null;
    this.setupGrid();
    this.setupRandomPlayer();
  }
}