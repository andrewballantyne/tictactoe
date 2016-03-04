/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 3/03/16.
 */
class OptionWatcher extends AbstractDomTicTacToe {
  private optionState:OptionState;

  private endConditionToggles:JQuery;
  private endConditionToggleOptions:JQuery;
  private endConditionValueContainer:JQuery;
  private endConditionValue:JQuery;
  private endConditionSentences:JQuery;
  private endConditionSentenceOptions:GenericMap<JQuery>;
  private endConditionWarningsContainer:JQuery;
  private endConditionWarningGroups:JQuery;
  private currentEndCondition:JQuery;

  private tieToggle:JQuery;
  private tieToggleOptions:JQuery;

  constructor(optionState:OptionState) {
    super();

    this.optionState = optionState;

    this.endConditionToggles = $('.endConditionToggles');
    this.endConditionToggleOptions = this.endConditionToggles.children();
    this.endConditionValueContainer = $('#endConditionValueContainer');
    this.endConditionSentences = this.endConditionValueContainer.find('.endConditionSentence');
    this.endConditionSentenceOptions = {};
    this.endConditionSentenceOptions['firstTo'] = this.endConditionValueContainer.find('.firstTo');
    this.endConditionSentenceOptions['bestOf'] = this.endConditionValueContainer.find('.bestOf');
    this.endConditionSentenceOptions['afterGames'] = this.endConditionValueContainer.find('.afterGames');
    this.endConditionValue = this.endConditionValueContainer.find('#endConditionValue');
    this.endConditionWarningsContainer = this.endConditionValueContainer.find('.endConditionWarnings');
    this.endConditionWarningGroups = this.endConditionWarningsContainer.children();
    this.currentEndCondition = null;

    this.tieToggle = $('#tiesEnabled');
    this.tieToggleOptions = this.tieToggle.children();

    this.setupDefaultLook();
    this.setupListeners();
  }

  private setupDefaultLook():void {
    this.endConditionValueContainer.hide();
    this.endConditionWarningGroups.hide();

    this.currentEndCondition = this.endConditionToggles.find('[data-target="none"]');
    this.currentEndCondition.addClass('active');

    if (this.optionState.isEnabled(OptionType.TIES_COUNTED)) {
      this.tieToggle.find('.yes').addClass('active');
    } else {
      this.tieToggle.find('.no').addClass('active');
    }
  }

  private setupListeners():void {
    this.endConditionToggleOptions.on('click', (e:Event) => {
      var jThis:JQuery = $(e.currentTarget);
      this.currentEndCondition = jThis;
      this.handleEndConditionChange(jThis);
    });

    this.tieToggleOptions.on('click', (e:Event) => {
      var jThis:JQuery = $(e.currentTarget);

      this.optionState.adjustState(OptionType.TIES_COUNTED, jThis.hasClass('yes'));
      this.handleEndConditionChange(this.currentEndCondition);
    });
  }

  private handleEndConditionChange(jThis:JQuery):void {
    var targetSentenceName:string = jThis.attr('data-target');
    if (targetSentenceName === 'none') {
      // Disabling end conditions
      this.endConditionValueContainer.hide();
      return;
    }
    var targetSentence:JQuery = this.endConditionSentenceOptions[targetSentenceName];
    if (targetSentence == null || targetSentence.length == 0) {
      console.error("Cannot show the needed sentence as the data-target was unable to produce a valid object");
      return;
    }

    this.endConditionValueContainer.show();

    // Handle pre and post text sentences
    this.endConditionSentences.hide();
    targetSentence.show();

    // Handle warnings
    this.endConditionWarningGroups.hide();
    var warningContainers:JQuery = this.endConditionWarningsContainer.find('.' + targetSentenceName + 'Warnings');
    for (var containerIdx:number = 0; containerIdx < warningContainers.length; containerIdx++) {
      var thisContainer:JQuery = $(warningContainers[containerIdx]);
      var warnings:JQuery = thisContainer.children();

      for (var i:number = 0; i < warnings.length; i++) {
        var singleWarning:JQuery = $(warnings.get(i));
        var dataCondition:string = singleWarning.attr('data-condition');
        if (dataCondition == null) {
          // No condition, show
          singleWarning.show();
        } else {
          // Condition, handle
          if (this.validateWarningCondition(dataCondition)) {
            thisContainer.show();
            singleWarning.show();
          } else {
            singleWarning.hide();
          }
        }
      }
    }
  }

  private validateWarningCondition(dataCondition:string):boolean {
    var truthfulValue:boolean = dataCondition.match(/isEnabled/) != null;
    if (truthfulValue) {
      dataCondition = dataCondition.substr('isEnabled'.length);
    } else {
      dataCondition = dataCondition.substr('isDisabled'.length);
    }

    var conditionState:boolean = false;
    switch (dataCondition) {
      case 'TieCounts':
        conditionState = this.optionState.isEnabled(OptionType.TIES_COUNTED);
        break;
      default:
        console.error("Unhandled warning condition (" + dataCondition + ")");
    }

    if (!truthfulValue) {
      conditionState = !conditionState;
    }

    return conditionState;
  }
}