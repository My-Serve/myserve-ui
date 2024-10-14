import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {SpinnerService} from "@services/spinner.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SpinnerLock} from "@others/models/spinner-lock";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-pdf-previewer',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './pdf-previewer.component.html',
  styles: ``
})
export class PdfPreviewerComponent implements OnInit, OnDestroy{
  pdfName = input.required<string>();
  pdfUrl = input.required<string>();
  pdfSize = input.required<number>();

  shouldUseDefaultRendered: boolean = false;

  sanitizedPdfUrl?: SafeResourceUrl;
  sanitizedGoogleViewerUrl?: SafeResourceUrl;
  spinnerLock?: SpinnerLock
  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly sanitizer: DomSanitizer,
  ) {
  }

  ngOnDestroy(): void {
    this.spinnerLock?.release();
  }

  ngOnInit(): void {
    this.spinnerLock = this.spinnerService.create(`Loading ${this.pdfName()}...`)
    this.sanitizeUrls();
    const maxSize = 25 * 1024 * 1024;
    if(this.pdfSize() > maxSize) {
      this.shouldUseDefaultRendered = true;
    }
  }

  private sanitizeUrls() {
    this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl());
    const googleViewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(this.pdfUrl())}#toolbar=0&scrollbar=0`;
    this.sanitizedGoogleViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
  }

}
