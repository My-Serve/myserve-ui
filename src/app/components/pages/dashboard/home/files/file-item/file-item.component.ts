import {Component, OnDestroy, OnInit, output} from '@angular/core';
import {FilesService} from "@services/files.service";
import {SpinnerService} from "@services/spinner.service";
import {ToastService} from "@services/toast.service";
import {Button} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {EContentType} from "@constants/e-content-type";
import {DataService} from "@services/data.service";
import {ImagePreviewerComponent} from "@shared/previewer/image-previewer/image-previewer.component";
import {IFile} from "@models/files-model";
import {KeyPressDirective} from "@directives/key-press.directive";
import {filter, Subscription} from "rxjs";
import {VideoPreviewerComponent} from "@shared/previewer/video-previewer/video-previewer.component";
import {AudioPreviewerComponent} from "@shared/previewer/audio-previewer/audio-previewer.component";
import {UnknownPreviewerComponent} from "@shared/previewer/unknown-previewer/unknown-previewer.component";
import {EToastConstants} from "@constants/e-toast-constants";
import {AbstractDownloadService} from "@services/abstracts/downloads/abstract-download-service";
import {PdfPreviewerComponent} from "@shared/previewer/pdf-previewer/pdf-previewer.component";

@Component({
  selector: 'app-file-item',
  standalone: true,
  imports: [
    Button,
    TooltipModule,
    ImagePreviewerComponent,
    KeyPressDirective,
    VideoPreviewerComponent,
    AudioPreviewerComponent,
    UnknownPreviewerComponent,
    PdfPreviewerComponent
  ],
  templateUrl: './file-item.component.html',
  styleUrls: ['file-item.component.scss'],
  styles: ``
})
export class FileItemComponent implements OnInit, OnDestroy{
  onNext = output();
  onPrev = output();

  onDelete = output();

  protected contentType: EContentType = EContentType.Unknown;
  protected file?: IFile = undefined;
  protected expiry? : Date = undefined;
  private subscription!: Subscription
  constructor(
    private readonly fileService : FilesService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly dataService: DataService,
    private readonly downloadService: AbstractDownloadService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    const spinnerLock = this.spinnerService.create("Loading...");
    this.subscription = this.fileService.currentPreviewFileSubject
      .pipe(
        filter(x => typeof x !== 'undefined') //when closing it will send undefined
      )
      .subscribe({
      next: value => {
        this.fileService.id(this.fileService.currentPreviewFile!).subscribe({
          next: value => {
            spinnerLock.release();
            this.contentType = this.dataService.typeByMime(value?.file?.mimeType)
            this.file = value.file
            this.expiry = value.expiry;
          },
          error: err => {
            spinnerLock.release();
          }
        })
      },
      error: err => {
        spinnerLock.release();
        console.log(err)
      }
    });

  }

  protected readonly EContentType = EContentType;

  close() {
    this.fileService.closePreview();
  }

  handleKeyDown($event: string) {
    if($event === "ArrowRight"){
      this.onNext.emit();
      return
    }

    if($event === "ArrowLeft"){
      this.onPrev.emit();
      return;
    }
  }

  toggleFavourite() {
    if(!this.file)
    {
      this.toastService.error(EToastConstants.Error, "Failed to favourite the file")
      return;
    }

    this.fileService.favourite(this.file.id, !this.file.favourite).subscribe({
      next: value => {
        if(this.file?.id === value.id){
          if(this.file)
            this.file.favourite = value.favourite;
        }

        if(value.favourite){
          this.toastService.success(EToastConstants.Success, `Saved ${value.name} to favourite`)
        }else{
          this.toastService.success(EToastConstants.Success, `Removed ${value.name} to favourite`)
        }
      },
      error: err => {
        this.toastService.error(EToastConstants.Error, "Failed to favourite the file!")
      }
    })
  }

  deleteFile(){
    if (!this.file) {
      this.toastService.error(EToastConstants.Error, "Failed to delete the file")
      return;
    }

    const me = this.file.name;
    const deleteSpinner = this.spinnerService.create("Deleting...");
    this.fileService.delete(this.file.id).subscribe({
      next: value => {
        deleteSpinner.release();
        if(value){
          this.onDelete.emit();
          this.toastService.success(EToastConstants.Success, `${me} is successfully deleted!`)
          this.fileService.closePreview();
        }else{
          this.toastService.error(EToastConstants.Error, `Failed to delete the file`)
        }
      },
      error: err => {
        deleteSpinner.release();
        this.toastService.error(EToastConstants.Error, `Failed to delete the file`)
      }
    })
  }

  download(){
    if(!this.file)
    {
      this.toastService.error(EToastConstants.Error, "Failed to download the file")
      return;
    }

    let skipCache = false;
    if (!this.expiry) {
      skipCache = true;
    } else {
      const fortyMinutesInMs = 40 * 60 * 1000;
      const currentTime = new Date().getTime();
      const expiryTime = new Date(this.expiry).getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      if (timeUntilExpiry < fortyMinutesInMs) {
        skipCache = true;
      }
    }

    this.fileService.id(this.file.id, skipCache).subscribe({
      next: value => {
        if(!value){
          this.toastService.error(EToastConstants.Error, "Failed to fetch the file to download!")
          return;
        }

        this.downloadService.download(value.file.targetUrl!, value.file.name).subscribe({
          next: downloadResponse => {
            this.toastService.success(EToastConstants.DownloadSuccess, `Your file ${value.file.name} has been downloaded!`)
          }
        })
      },
      error: err => {
        this.toastService.error(EToastConstants.Error, "Failed to fetch the file to download!")
      }
    })
  }
}
