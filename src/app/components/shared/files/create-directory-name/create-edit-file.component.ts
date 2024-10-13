import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PopUpService} from "@services/pop-up.service";
import {Button} from "primeng/button";
import {FilesService} from "@services/files.service";
import {FormsModule} from "@angular/forms";
import {ToastService} from "@services/toast.service";
import {SpinnerService} from "@services/spinner.service";
import {EToastConstants} from "@constants/e-toast-constants";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-create-directory-name',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    Button,
    FormsModule
  ],
  templateUrl: './create-edit-file.component.html',
  styles: ``
})
export class CreateEditFileComponent implements OnInit, OnDestroy {
  directoryName: string = "";
  modifiedDirectoryName: string = "";
  private popupSubscription!: Subscription;
  protected header: string = ""
  protected isEdit: boolean = false;

  constructor(
    protected readonly popupService: PopUpService,
    protected readonly fileService: FilesService,
    protected readonly toastService: ToastService,
    protected readonly spinnerService: SpinnerService,
  ) {
  }

  ngOnInit(): void {

    }

  cancel(): void {
    this.modifiedDirectoryName = "";
    this.popupService.showCreatedEditPopupDirectory = false;
  }

  ngOnDestroy() {
    this.popupSubscription?.unsubscribe();
  }

  create(): void {
    const spinner = this.spinnerService.create("Creating...");
    this.fileService.createFolder(this.modifiedDirectoryName, this.popupService.currentParentCreatedEditPopupDirectory).subscribe({
      next: value => {
        spinner.release()
        if(!value || !value.file)
          return

        this.fileService.updateList.next({
          id: value.file.parentId ?? undefined
        })
        this.toastService.success(EToastConstants.Success, "Successfully created "+this.modifiedDirectoryName)
        this.cancel();
      },
      error: err => {
        spinner.release()
        this.toastService.error(EToastConstants.Error, "Failed to create the directory")
      }
    })
  }

  initialize() {
    this.directoryName = this.popupService.existingNameCreatedEditPopupDirectory || ''
    this.modifiedDirectoryName = this.directoryName;
    this.isEdit = (this.popupService.createEditPopupDirectory.existingName?.trim().length ?? 0) > 0
    this.header = this.isEdit ? 'Edit ' : 'Create ';
    this.header += this.popupService.createEditPopupDirectory.isFile ? 'File' : 'Directory'
  }

  protected get valid(): boolean {
    if(!this.modifiedDirectoryName.trim().length)
      return false;

    if (this.modifiedDirectoryName.length > 100)
      return false;

    if(this.modifiedDirectoryName.includes("/"))
      return false;

    return true;
  }

  edit() {
    if(!this.popupService.createEditPopupDirectory.existingElementId){
      this.toastService.error(EToastConstants.Error, "An unknown error occurred while identifying the file!")
      return;
    }
    const spinner = this.spinnerService.create("Updating...");
    this.fileService.rename(this.popupService.createEditPopupDirectory.existingElementId!, this.modifiedDirectoryName).subscribe({
      next: value => {
        spinner.release()
        if(!value || !value.parentId)
          return

        this.toastService.success(EToastConstants.Success, "Successfully created "+this.modifiedDirectoryName)
        this.cancel();
      },
      error: err => {
        spinner.release()
        this.toastService.error(EToastConstants.Error, "Failed to create the directory")
      }
    })
  }
}
