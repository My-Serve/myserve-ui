import {SpinnerService} from "../../services/spinner.service";

export class SpinnerLock {

  private readonly spinnerService: SpinnerService;
  private readonly _id: string;
  private readonly text: string;

  constructor(
    text: string,
    service: SpinnerService,
  ) {
    this._id = crypto.randomUUID();
    this.text = text;
    this.spinnerService = service;
  }

  public release(){
    this.spinnerService.release(this._id);
  }

  public get id() : string{
    return this._id;
  }

}
