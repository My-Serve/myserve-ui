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
import {Subscription} from "rxjs";
import {VideoPreviewerComponent} from "@shared/previewer/video-previewer/video-previewer.component";
import {AudioPreviewerComponent} from "@shared/previewer/audio-previewer/audio-previewer.component";
import {UnknownPreviewerComponent} from "@shared/previewer/unknown-previewer/unknown-previewer.component";

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
    UnknownPreviewerComponent
  ],
  templateUrl: './file-item.component.html',
  styleUrls: ['file-item.component.scss'],
  styles: ``
})
export class FileItemComponent implements OnInit, OnDestroy{
  onNext = output();
  onPrev = output();

  protected contentType: EContentType = EContentType.Unknown;
  protected file?: IFile = undefined;
  protected expiry? : Date = undefined;
  private subscription!: Subscription
  constructor(
    private readonly fileService : FilesService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly dataService: DataService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    const spinnerLock = this.spinnerService.create("Loading...");
    this.subscription = this.fileService.currentPreviewFileSubject.subscribe({
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
}
