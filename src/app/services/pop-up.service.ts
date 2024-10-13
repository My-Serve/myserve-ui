import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private _createEditPopupDirectory: {
    show: boolean;
    existingName?: string;
    currentParent?: string;
  } = {
    show: false,
    existingName: undefined
  };

  constructor() { }

  public get showCreatedEditPopupDirectory(): boolean {
    return this._createEditPopupDirectory.show;
  }

  public get existingNameCreatedEditPopupDirectory(): string | undefined{
    return this._createEditPopupDirectory.existingName;
  }

  public get currentParentCreatedEditPopupDirectory(): string | undefined{
    return this._createEditPopupDirectory.currentParent;
  }

  public set showCreatedEditPopupDirectory(value: boolean) {
    this._createEditPopupDirectory = {
      ...this._createEditPopupDirectory,
      show: value
    };
  }

  public openCreateEditPopupDirectory(existingName?: string, currentParent?: string): void {
    this._createEditPopupDirectory = {
      show: true,
      existingName: existingName,
      currentParent: currentParent
    }
  }
}
