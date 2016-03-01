/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 3/01/16.
 */
class DialogHandler extends AbstractDomTicTacToe {
  private gameState:GameState;
  private gameOverDialog:JQuery;
  private gameOverDialogSubTitle:JQuery;
  private modalNewGameBtn:JQuery;
  private modalResetDataBtn:JQuery;
  private cancelResetDataBtnConfirmation:()=>void;

  constructor(gameState:GameState) {
    super();

    this.gameState = gameState;
    this.gameOverDialog = $('#gameOverDialog');
    this.gameOverDialogSubTitle = this.gameOverDialog.find('.subTitle');
    this.modalNewGameBtn = this.gameOverDialog.find('#modalNewGameBtn');
    this.modalResetDataBtn = this.gameOverDialog.find('#modalResetDataBtn');
    this.cancelResetDataBtnConfirmation = null;

    this.setupListeners();
  }

  private setupListeners():void {
    this.gameState.listenForPlayerChanges(this.handlePlayerChanges, this);
    this.gameState.listenForGameChanges(this.handleGameChanges, this);

    this.modalNewGameBtn.on('click', () => {
      this.closeDialog();
      this.gameState.newGame();
    });
    this.cancelResetDataBtnConfirmation = this.setupButtonForConfirmation(this.modalResetDataBtn, () => {
      this.closeDialog();
      this.gameState.resetAllData();
    });
  }

  private handlePlayerChanges(player:PlayerType, victor:boolean):void {
    if (victor) {
      // There was a victory (or a tie)
      this.showGameOverDialog(player);
    } else {
      // Switching of players
    }
  }

  private handleGameChanges(gameStateType:StateType):void {
    switch (gameStateType) {
      case StateType.NEW_GAME:
      case StateType.RESET_DATA:
        this.closeDialog();
        break;
      case StateType.GAME_OVER:
        break;
    }
  }

  private showGameOverDialog(victoryPlayer:PlayerType):void {
    this.gameOverDialogSubTitle.empty();
    if (victoryPlayer != null) {
      // Player Won
      this.gameOverDialogSubTitle.append(this.getSelectionContent(Players.getPlayerSymbol(victoryPlayer)));
      this.gameOverDialogSubTitle.append(" Player Wins!");
    } else {
      // No one won - Tie
      this.gameOverDialogSubTitle.append("Tie - No Victor");
    }

    this.gameOverDialog.modal({
      backdrop: 'static'
    });
  }

  private closeDialog():void {
    this.cancelResetDataBtnConfirmation();
    this.gameOverDialog.modal('hide');
  }
}