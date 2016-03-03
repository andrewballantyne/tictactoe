/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 3/02/16.
 */
class MainNavHandler extends AbstractDomTicTacToe {
  private mainNavs:JQuery;
  private contentPanes:JQuery;
  private gamePane:JQuery;
  private optionsPane:JQuery;

  constructor() {
    super();

    this.mainNavs = $('.navBtnContainer');
    this.contentPanes = $('.contentPane');
    this.gamePane = $('.gamePane');
    this.optionsPane = $('.optionsPane');

    this.setupListeners();
  }

  private setupListeners():void {
    this.mainNavs.on('click', (e:Event) => {
      var jThis = $(e.currentTarget);
      this.mainNavs.removeClass('active');
      jThis.addClass('active');

      this.contentPanes.removeClass('active');
      switch (jThis.attr('data-target')) {
        case 'gamePane':
          this.gamePane.addClass('active');
          break;
        case 'optionsPane':
          this.optionsPane.addClass('active');
          break;
        default:
          console.error("Unknown navigation change.");
      }
    });
  }
}