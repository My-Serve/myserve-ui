import {ChangeDetectorRef, Injectable} from '@angular/core';
import {SpinnerLock} from "../others/models/spinner-lock";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private readonly spinnerMap : Record<string, SpinnerLock> = {}

  constructor(
    private readonly cd: ChangeDetectorRef
  ) { }

  public create(text?: string) : SpinnerLock {
    const lock = new SpinnerLock(text ?? 'Loading...', this);
    this.spinnerMap[lock.id] = lock;
    this.cd.detectChanges();
    return lock;
  }

  public release(id: string) {
    delete this.spinnerMap[id];
    this.cd.detectChanges();
  }

  public get first(): SpinnerLock | undefined {
    const keys = Object.keys(this.spinnerMap);
    return keys.length > 0 ? this.spinnerMap[keys.at(-1)!] : undefined;
  }

  public get has() : boolean {
    return Object.keys(this.spinnerMap).length > 0;
  }
}
