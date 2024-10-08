

export class Task implements ITask{
  private readonly _id: string;
  private _label: string
  private _progress: number
  private _completed: boolean
  private errorReason?: string
  private _started: boolean
  private _onFinished?: (status: boolean) => void;
  readonly abortSignal: AbortController

  constructor(label: string) {
    this._id = crypto.randomUUID();
    this._label = label;
    this._progress = 0;
    this._completed = false;
    this._started = false;
    this.abortSignal = new AbortController();
  }

  public setLabel(label: string) : Task {
    this._label = label;
    return this;
  }

  public setProgress(progress: number) : Task {
    if(this._completed)
      return this;

    if(progress >= 100)
      this._progress = 100
    else
      this._progress = progress;

    return this;
  }


  get label(): string {
    return this._label;
  }

  get progress(): number {
    return this._progress;
  }

  public get id(): string {
    return this._id;
  }

  public complete(): Task {
    this._progress = 100;
    this._completed = true;
    if (this._onFinished) {
      this._onFinished(true);
    }
    return this;
  }

  public setError(reason: string): Task {
    this.errorReason = reason;
    if (this._onFinished) {
      this._onFinished(false);
    }
    return this;
  }

  public get completed(): boolean {
    return this._completed;
  }

  public get error(): string | undefined {
    return this.errorReason;
  }

  public act: (update: (task: ITask) => Promise<void>) => Promise<void> = async (update) => {
    if(this._started)
      throw new Error("The task is already started once");

    if(this._completed)
      throw new Error("The task is already completed");

    try {
      this._started = true;
      await update(this);
    } catch (error) {
      this.setError("An error occurred during the action.");
      console.error(error);
    }
  };

  set onFinished(value: (status: boolean) => void) {
    this._onFinished = value; // Store the callback
  }

  public get status() : 'Pending' | 'Completed' | 'Error' | 'Progress' {
    if(!this._started)
      return 'Pending';

    if(this.completed)
      return 'Completed';

    if(this.errorReason)
      return 'Error';

    return 'Progress'
  }
}

export interface ITask {
  setError(reason: string): Task
  complete(): Task
  setProgress(progress: number) : Task
  completed: boolean
  abortSignal: AbortController
}

