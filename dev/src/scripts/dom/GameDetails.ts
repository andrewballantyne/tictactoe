/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
class GameDetails extends AbstractDomTicTacToe {
  private gameState:GameState;
  private optionState:OptionState;
  private newGameBtn:JQuery;
  private newGameRandomPlayerBtn:JQuery;
  private resetDataBtn:JQuery;
  private cancelResetDataBtnConfirmation:()=>void;
  private totalGamesPlayed:JQuery;
  private oPlayerContainer:JQuery;
  private oPlayerScore:JQuery;
  private xPlayerContainer:JQuery;
  private xPlayerScore:JQuery;
  private tiesContainer:JQuery;
  private tiesScore:JQuery;

  constructor(gameState:GameState, optionState:OptionState) {
    super();

    this.gameState = gameState;
    this.optionState = optionState;
    this.newGameBtn = $('#newGameBtn');
    this.newGameRandomPlayerBtn = $('#newGameRandomPlayerBtn').find('input');
    this.resetDataBtn = $('#resetDataBtn');
    this.cancelResetDataBtnConfirmation = null;
    this.totalGamesPlayed = $('#totalGames').find('.value');
    this.oPlayerContainer = $('#oPlayer');
    this.oPlayerScore = this.oPlayerContainer.find('.value');
    this.xPlayerContainer = $('#xPlayer');
    this.xPlayerScore = this.xPlayerContainer.find('.value');
    this.tiesContainer = $('#ties');
    this.tiesScore = this.tiesContainer.find('.value');

    this.setupListeners();

    this.updatePlayer(this.gameState.getCurrentPlayer());
    this.updateScore();
  }

  private setupListeners():void {
    this.gameState.listenForPlayerChanges(this.playerDataChanged, this);
    this.gameState.listenForGameChanges(this.gameDataChanged, this);
    this.optionState.listenForGameChanges(this.gameDataChanged, this);

    this.newGameRandomPlayerBtn.on('change', (e:Event) => {
      this.gameState.setNewGamePlayerRandom(this.newGameRandomPlayerBtn.prop('checked'));
    });
    this.gameState.setNewGamePlayerRandom(this.newGameRandomPlayerBtn.prop('checked')); // force to pick up whatever the dom has right now
    this.newGameBtn.on('click', () => {
      this.cancelResetDataBtnConfirmation();
      this.gameState.newGame();
    });
    this.cancelResetDataBtnConfirmation = this.setupButtonForConfirmation(this.resetDataBtn, () => {
      this.gameState.resetAllData();
    });
  }

  private playerDataChanged(player:PlayerType, victor:boolean):void {
    this.cancelResetDataBtnConfirmation();
    if (victor) {
      // Victory
    } else {
      // Player Change
      this.updatePlayer(player);
    }
  }

  private gameDataChanged(gameStateType:StateType):void {
    this.cancelResetDataBtnConfirmation();
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
      case StateType.OPTION_CHANGE:
        this.updateScore();
        this.tiesIncluded(this.optionState.isEnabled(OptionType.TIES_COUNTED));
        break;
      default:
        console.error("Missing state setting: " + gameStateType);
    }
  }

  private updatePlayer(player:PlayerType):void {
    if (player === PlayerType.O_PLAYER) {
      this.xPlayerContainer.removeClass('active');
      this.oPlayerContainer.addClass('active');
    } else if (player === PlayerType.X_PLAYER) {
      this.oPlayerContainer.removeClass('active');
      this.xPlayerContainer.addClass('active');
    }
  }

  private updateScore():void {
    var oScore:number = Players.getPlayerScore(PlayerType.O_PLAYER);
    var xScore:number = Players.getPlayerScore(PlayerType.X_PLAYER);
    var tieScore:number = Players.getPlayerScore(PlayerType.TIE_PLAYER);
    var total:number = oScore + xScore;
    if (this.optionState.isEnabled(OptionType.TIES_COUNTED)) {
      total += tieScore;
    }

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

  private tiesIncluded(isIncluded:boolean):void {
    if (isIncluded) {
      this.tiesContainer.removeClass('fade');
    } else {
      this.tiesContainer.addClass('fade');
    }
  }
}