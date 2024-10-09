import {Component, input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-video-previewer',
  standalone: true,
  imports: [],
  templateUrl: './video-previewer.component.html',
  styles: ``
})
export class VideoPreviewerComponent implements OnInit{
  videoUrl = input.required<string>();
  videoName = input.required<string>();

  sanitizedVideoUrl!: SafeResourceUrl

  constructor(
    private readonly sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl())
  }
}
