/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 2/28/16.
 */
abstract class AbstractDomTicTacToe {
  private defaultContent:JQuery;

  constructor() {
    this.setupContentDefault();
  }

  /**
   * Setup a provided button with a double-click feature. The first click will prompt a message "<checkmark> Are you sure?", which then
   * the user has to click again and it will trigger the callback method.
   *
   * @param button - The button to make into a double-click (confirmation) button
   * @param callbackOnFinalTrigger - The callback to call once the confirmation has been received
   * @returns - A "cancel" confirmation callback (this method will allow the calling code to reset the button)
   */
  protected setupButtonForConfirmation(button:JQuery, callbackOnFinalTrigger:()=>void):()=>void {
    var contents:string = null;
    button.on('click', () => {
      if (contents === null) {
        // Haven't been clicked yet, save the content and swap it for a confirmation
        contents = button.html();
        button.html('<span class="glyphicon glyphicon-ok"></span> Are you sure?');
      } else {
        // We have shown the confirmation, they clicked anyways, return the original content and trigger the callback
        button.html(contents);
        contents = null;
        callbackOnFinalTrigger();
      }
    });

    return () => {
      if (contents != null) {
        button.html(contents);
        contents = null;
      }
    };
  }

  /**
   * Get a glyphicon specific to the passed name.
   *
   * @param glyphiconName - The name of the glyphicon (ie. for glyphicon-remove, just provide 'remove')
   * @returns - A jQuery object with the glyphicon in it
   */
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