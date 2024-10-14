import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SpinnerLock} from "@others/models/spinner-lock";
import {SpinnerService} from "@services/spinner.service";

@Component({
  selector: 'app-video-previewer',
  standalone: true,
  imports: [],
  templateUrl: './video-previewer.component.html',
  styles: ``
})
export class VideoPreviewerComponent implements OnInit, OnDestroy {
  videoUrl = input.required<string>();
  videoName = input.required<string>();
  spinnerLock? :SpinnerLock;
  sanitizedVideoUrl!: SafeResourceUrl

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly spinnerService: SpinnerService,
  ) {
  }

  ngOnDestroy(): void {
    this.spinnerLock?.release();
  }

  ngOnInit(): void {
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl())
    this.spinnerLock = this.spinnerService.create(`Loading ${this.videoName()}`);
  }


  loadComplete() {
    this.spinnerLock?.release();
  }
}
