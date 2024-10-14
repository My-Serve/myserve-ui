import {Component, ElementRef, input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageModule} from "primeng/image";
import {NgOptimizedImage} from "@angular/common";
import {SpinnerService} from "@services/spinner.service";
import {SpinnerLock} from "@others/models/spinner-lock";

@Component({
  selector: 'app-image-previewer',
  standalone: true,
  imports: [
    ImageModule,
    NgOptimizedImage
  ],
  templateUrl: './image-previewer.component.html',
  styles: ``
})
export class ImagePreviewerComponent implements OnInit, OnDestroy{

  constructor(
    private readonly spinnerService: SpinnerService,
  ) {
  }

  ngOnDestroy(): void {
    this.spinnerLock?.release();
  }

  imageUrl = input.required<string>();
  imageName = input.required<string>();
  spinnerLock?: SpinnerLock

  ngOnInit(): void {
    this.spinnerLock = this.spinnerService.create(`Loading ${this.imageName}`)
  }

  loadComplete() {
    this.spinnerLock?.release();
  }
}
