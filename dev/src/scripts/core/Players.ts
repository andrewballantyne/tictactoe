/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
class Players {
  public static PLAYER_COUNT:number = 2;

  private static playerMapping:EnumMap<string>;
  private static score:EnumMap<number>;

  /**
   * Setup the player data.
   */
  public static init():void {
    Players.playerMapping = {};
    Players.playerMapping[<number>PlayerType.O_PLAYER] = 'certificate';
    Players.playerMapping[<number>PlayerType.X_PLAYER] = 'remove';

    Players.score = {};
    Players.score[<number>PlayerType.O_PLAYER] = 0;
    Players.score[<number>PlayerType.X_PLAYER] = 0;
    Players.score[<number>PlayerType.TIE_PLAYER] = 0;
  }

  /**
   * Get a player symbol (currently a glyphicon name).
   *
   * Note: if a tie is passed in for the player, a null is returned.
   *
   * @param player - The player you're trying to get the symbol for
   * @returns - The string value for the glyphicon name (ie, for glyphicon-remove, it would just be 'remove'); or null if player == tie
   */
  public static getPlayerSymbol(player:PlayerType):string {
    if (player == null) return null;
    return Players.playerMapping[<number>player];
  }

  /**
   * Gets a player's score.
   *
   * @param player - The player of which you are trying to find out the score of
   * @returns - The numerical number of wins
   */
  public static getPlayerScore(player:PlayerType):number {
    return Players.score[<number>player];
  }

  /**
   * Increments the score for the provided player.
   *
   * @param player - The player that won (null === tie)
   */
  public static playerWon(player:PlayerType):void {
    if (player === null) {
      Players.score[<number>PlayerType.TIE_PLAYER]++;
    } else {
      Players.score[<number>player]++;
    }
  }

  /**
   * Resets the player's score to zero.
   */
  public static resetPlayerScores():void {
    Players.score[<number>PlayerType.O_PLAYER] = 0;
    Players.score[<number>PlayerType.X_PLAYER] = 0;
    Players.score[<number>PlayerType.TIE_PLAYER] = 0;
  }
}