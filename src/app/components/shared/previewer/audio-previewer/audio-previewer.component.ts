import {Component, input} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-audio-previewer',
  standalone: true,
  imports: [],
  templateUrl: './audio-previewer.component.html',
  styles: ``
})
export class AudioPreviewerComponent {
  audioUrl = input.required<string>();
  audioName = input.required<string>();

  sanitizedAudioUrl!: SafeResourceUrl

  constructor(
    private readonly sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    this.sanitizedAudioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.audioUrl())
  }
}
