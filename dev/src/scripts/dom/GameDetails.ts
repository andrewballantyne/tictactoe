/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
class GameDetails extends AbstractDomTicTacToe {
  private gameState:GameState;
  private currentPlayerPane:JQuery;
  private newGameBtn:JQuery;
  private resetDataBtn:JQuery;
  private totalGamesPlayed:JQuery;
  private oPlayerScore:JQuery;
  private xPlayerScore:JQuery;
  private tiesScore:JQuery;

  constructor(gameState:GameState) {
    super();

    this.gameState = gameState;
    this.currentPlayerPane = $('#currentPlayer');
    this.newGameBtn = $('#newGameBtn');
    this.resetDataBtn = $('#resetDataBtn');
    this.totalGamesPlayed = $('#totalGames').find('.value');
    this.oPlayerScore = $('#oPlayer').find('.value');
    this.xPlayerScore = $('#xPlayer').find('.value');
    this.tiesScore = $('#ties').find('.value');

    this.setupListeners();

    this.updatePlayer(this.gameState.getCurrentPlayer());
  }

  private setupListeners():void {
    this.gameState.listenForPlayerChanges(this.playerDataChanged, this);
    this.gameState.listenForGameChanges(this.gameDataChanged, this);

    this.newGameBtn.on('click', () => {
      this.gameState.newGame();
    });
    this.resetDataBtn.on('click', () => {
      this.gameState.resetAllData();
    });
  }

  private playerDataChanged(player:PlayerType, victor:boolean):void {
    if (victor) {
      // Victory
      Players.playerWon(player);
      this.updateScore();
    } else {
      // Player Change
      this.updatePlayer(player);
    }
  }

  private gameDataChanged(gameStateType:StateType):void {
    switch (gameStateType) {
    case StateType.NEW_GAME:
      this.updatePlayer(this.gameState.getCurrentPlayer());
      break;
    case StateType.RESET_DATA:
      this.updatePlayer(this.gameState.getCurrentPlayer());
      this.updateScore();
      break;
    default:
      console.error("Missing state setting: " + gameStateType);
    }
  }

  private updatePlayer(player:PlayerType):void {
    this.currentPlayerPane.empty();
    this.currentPlayerPane.append(this.getSelectionContent(Players.getPlayerSymbol(player)));
  }

  private updateScore():void {
    var oScore:number = Players.getPlayerScore(PlayerType.O_PLAYER);
    var xScore:number = Players.getPlayerScore(PlayerType.X_PLAYER);
    var tied:number = Players.getPlayerScore(PlayerType.TIE_PLAYER);
    var total:number = oScore + xScore + tied;

    this.totalGamesPlayed.text(total);
    this.oPlayerScore.text(oScore);
    this.xPlayerScore.text(xScore);
    this.tiesScore.text(tied);
  }
}