/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
abstract class AbstractDomTicTacToe {
  private defaultContent:JQuery;

  constructor() {
    this.setupContentDefault();
  }

  protected getSelectionContent(glyphiconName:string):JQuery {
    var thisContent:JQuery = this.defaultContent.clone();
    thisContent.addClass('glyphicon-' + glyphiconName);

    return thisContent;
  }

  private setupContentDefault():void {
    this.defaultContent = $('<span></span>');
    this.defaultContent.addClass('glyphicon');
  }
}