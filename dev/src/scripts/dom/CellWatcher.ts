/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
class CellWatcher extends AbstractDomTicTacToe {
  private gameState:GameState;
  private gameSquares:JQuery;

  constructor(gameState:GameState) {
    super();

    this.gameState = gameState;
    this.gameSquares = $('.gameSquare');

    this.setupListeners();
  }

  private setupListeners():void {
    this.gameSquares.on('click', (e:Event) => {
      var thisSquare:JQuery = $(e.currentTarget);

      this.handleSquareClick(thisSquare);
    });

    this.gameState.listenForPlayerChanges(this.playerStateChanged, this);
    this.gameState.listenForGameChanges(this.gameStateChanged, this);
  }

  private playerStateChanged(player:PlayerType, victor:boolean):void {
    if (victor) {
      // This player just won
      this.disable(this.gameSquares);
      var victoryPath:string[] = this.gameState.getVictoryPath();
      this.highlightVictoryPath(victoryPath);
    } else {
      // Switch of players
    }
  }

  private gameStateChanged(gameStateType:StateType):void {
    switch (gameStateType) {
      case StateType.NEW_GAME:
        this.resetSquares();
        break;
      case StateType.RESET_DATA:
        this.resetSquares();
        break;
      default:
        console.error("Missing state setting: " + gameStateType);
    }
  }

  private highlightVictoryPath(victoryPath:string[]):void {
    for (var i:number = 0; i < victoryPath.length; i++) {
      var selector:string = '[data-coordinate=' + victoryPath[i] + ']';
      this.gameSquares.find(selector).addBack(selector).addClass('winningSquare');
    }
  }

  private handleSquareClick(domSquare:JQuery):void {
    var currentPlayer:PlayerType = this.gameState.getCurrentPlayer();

    domSquare.empty();
    domSquare.append(this.getSelectionContent(Players.getPlayerSymbol(currentPlayer)));
    this.gameState.registerClick(domSquare.attr('data-coordinate'));

    this.disable(domSquare);

    this.gameState.switchPlayer();
  }

  private disable(domValue:JQuery):void {
    domValue.addClass('disabled');
    domValue.prop('disabled', true);
  }

  private resetSquares():void {
    this.gameSquares.html('&nbsp;');
    this.gameSquares.removeClass('disabled');
    this.gameSquares.prop('disabled', false);
    this.gameSquares.removeClass('winningSquare');
  }
}