import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileListStateService {

  private readonly closeAllMenusSource = new Subject<{id: string, source: 'context' | 'more'}>();
  private readonly _closeAllMenus$ = this.closeAllMenusSource.asObservable();

  constructor() { }


  get closeAllMenus$(): Observable<{id: string, source: 'context' | 'more'}> {
    return this._closeAllMenus$;
  }

  public close(caller: string, source: 'context' | 'more')  {
    this.closeAllMenusSource.next({
      id: caller,
      source: source,
    })
  }
}
