import { Injectable } from '@angular/core';
import {ConfirmationService, PrimeIcons} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private _createEditPopupDirectory: {
    show: boolean;
    existingName?: string;
    currentParent?: string;
    isFile: boolean
    existingElementId?: string
  } = {
    show: false,
    existingName: undefined,
    isFile: false,
  };

  constructor(
    private readonly confirmationService: ConfirmationService
  ) { }

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

  public openCreateEditPopupDirectory(existingName?: string, existingElementId?: string, currentParent?: string, isFile?: boolean): void {
    this._createEditPopupDirectory = {
      show: true,
      existingName: existingName,
      currentParent: currentParent,
      isFile: isFile ?? false,
      existingElementId: existingElementId
    }
  }


  get createEditPopupDirectory(): { show: boolean; existingName?: string; currentParent?: string; isFile: boolean, existingElementId?: string } {
    return this._createEditPopupDirectory;
  }

  confirm(message: string, header: string,
          options?: {
            icon?: PrimeIcons
            acceptIcon?: string
            rejectIcon?: string
            acceptText?: string
            noText?: string,
            cb?: (status: boolean) => Promise<boolean>
          }
          ) : Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.confirmationService.confirm({
        message: message,
        header: header,
        icon: options?.icon?.toString() ?? 'pi pi-info-circle',
        acceptLabel: options?.acceptText ?? 'Yes',
        rejectLabel: options?.noText ?? 'No',
        accept: () => {
          try {
            options?.cb?.(true)
          }catch (err){}
          resolve(true);
        },
        reject: () => {
          try {
            options?.cb?.(false);
          }catch (err){}
          resolve(false);
        }
      })
    });
  }
}
