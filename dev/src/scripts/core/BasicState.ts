/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 3/03/16.
 */
abstract class BasicState {
  protected playerChangeNotifiers:PlayerChangeCallback[];
  protected gameChangeNotifiers:GameChangeCallback[];

  constructor() {
    this.playerChangeNotifiers = [];
    this.gameChangeNotifiers = [];
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

  protected notifyForPlayerChange(player:PlayerType, victor:boolean):void {
    this.notify(this.playerChangeNotifiers, [player, victor]);
  }

  protected notifyForGameChange(newGameState:StateType):void {
    this.notify(this.gameChangeNotifiers, [newGameState]);
  }

  private notify(notifyList:BasicCallback[], data:any[]):void {
    for (var i:number = 0; i < notifyList.length; i++) {
      var callbackMapping:BasicCallback = notifyList[i];
      callbackMapping.callback.apply(callbackMapping.scope, data);
    }
  }
}