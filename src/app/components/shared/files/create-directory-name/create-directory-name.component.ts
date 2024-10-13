import {Component} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PopUpService} from "@services/pop-up.service";
import {Button} from "primeng/button";
import {FilesService} from "@services/files.service";
import {FormsModule} from "@angular/forms";
import {ToastService} from "@services/toast.service";
import {SpinnerService} from "@services/spinner.service";
import {EToastConstants} from "@constants/e-toast-constants";

@Component({
  selector: 'app-create-directory-name',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    Button,
    FormsModule
  ],
  templateUrl: './create-directory-name.component.html',
  styles: ``
})
export class CreateDirectoryNameComponent {
  directoryName!: string;
  modifiedDirectoryName!: string;

  constructor(
    protected readonly popupService: PopUpService,
    protected readonly fileService: FilesService,
    protected readonly toastService: ToastService,
    protected readonly spinnerService: SpinnerService,
  ) {
  }

  cancel(): void {
    this.modifiedDirectoryName = "";
    this.popupService.showCreatedEditPopupDirectory = false;
  }

  create(): void {
    const spinner = this.spinnerService.create("Creating...");
    this.fileService.createFolder(this.modifiedDirectoryName, this.popupService.currentParentCreatedEditPopupDirectory).subscribe({
      next: value => {
        spinner.release()
        if(!value || !value.file)
          return

        this.fileService.updateList.next({
          id: value.file.id
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
  }

  protected get valid(): boolean {
    if(this.modifiedDirectoryName.trim().length)
      return false;

    if (this.modifiedDirectoryName.length > 100)
      return false;

    if(this.modifiedDirectoryName.includes("/") || this.modifiedDirectoryName.includes("."))
      return false;

    return true;
  }
}
