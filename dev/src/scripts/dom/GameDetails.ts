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
    this.updateScore();
  }

  private setupListeners():void {
    this.gameState.listenForPlayerChanges(this.playerDataChanged, this);
    this.gameState.listenForGameChanges(this.gameDataChanged, this);

    this.newGameBtn.on('click', () => {
      this.gameState.newGame();
    });
    this.setupButtonForConfirmation(this.resetDataBtn, () => {
      this.gameState.resetAllData();
    });
  }

  private playerDataChanged(player:PlayerType, victor:boolean):void {
    if (victor) {
      // Victory
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
      case StateType.GAME_OVER:
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
    var tieScore:number = Players.getPlayerScore(PlayerType.TIE_PLAYER);
    var total:number = oScore + xScore + tieScore;

    var oScorePercent:number = 0;
    var xScorePercent:number = 0;
    var tieScorePercent:number = 0;
    if (total > 0) {
      oScorePercent = oScore / total;
      xScorePercent = xScore / total;
      tieScorePercent = tieScore / total;
    }

    this.totalGamesPlayed.text(total);
    this.oPlayerScore.text(oScore + " (" + (oScorePercent * 100).toFixed(1) + "%)");
    this.xPlayerScore.text(xScore + " (" + (xScorePercent * 100).toFixed(1) + "%)");
    this.tiesScore.text(tieScore + " (" + (tieScorePercent * 100).toFixed(1) + "%)");
  }
}