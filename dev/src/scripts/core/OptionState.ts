/// <reference path="../refAll.d.ts" />

/**
 * Created by Andrew on 3/03/16.
 */
class OptionState extends BasicState {
  private options:EnumMap<boolean>;

  constructor() {
    super();

    this.options = {};

    this.setupOptions();
  }

  public isEnabled(optionValue:OptionType):boolean {
    return this.options[<number>optionValue];
  }

  public adjustState(optionValue:OptionType, newValue:boolean):void {
    this.options[<number>optionValue] = newValue;
    this.notifyForGameChange(StateType.OPTION_CHANGE);
  }

  private setupOptions():void {
    this.options[<number>OptionType.TIES_COUNTED] = true;
  }
}