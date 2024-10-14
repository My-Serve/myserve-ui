import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SpinnerService} from "@services/spinner.service";
import {SpinnerLock} from "@others/models/spinner-lock";

@Component({
  selector: 'app-audio-previewer',
  standalone: true,
  imports: [],
  templateUrl: './audio-previewer.component.html',
  styles: ``
})
export class AudioPreviewerComponent implements OnInit, OnDestroy{
  audioUrl = input.required<string>();
  audioName = input.required<string>();
  spinnerLock?: SpinnerLock

  sanitizedAudioUrl!: SafeResourceUrl

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly spinnerService: SpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.spinnerLock = this.spinnerService.create(`Loading ${this.audioName()}`)
    this.sanitizedAudioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.audioUrl())
  }

  ngOnDestroy(): void {
    this.spinnerLock?.release();
  }

  loadComplete() {
    this.spinnerLock?.release();
  }
}
