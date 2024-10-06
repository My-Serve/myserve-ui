import { Directive, ElementRef, HostBinding, HostListener, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFileDropper]',
  standalone: true
})
export class FileDropperDirective {
  @HostBinding('class.fileover') fileOver: boolean = false;
  fileDropped = output<FileList>();
  private overlay!: HTMLElement;
  private isShown: boolean = false;
  private dragCounter: number = 0;
  private hideOverlayTimeout: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.createOverlay();
  }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
    this.showOverlay();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.fileOver = false;
      this.debouncedHideOverlay();
    }
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    this.showOverlay();
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    this.dragCounter = 0;
    const files = event.dataTransfer?.files || ({} as FileList);
    this.hideOverlay();
    this.fileDropped.emit(files);
  }

  private createOverlay(): HTMLElement {
    this.overlay = this.renderer.createElement('div');
    this.renderer.addClass(this.overlay, 'absolute');
    this.renderer.addClass(this.overlay, 'inset-0');
    this.renderer.addClass(this.overlay, 'bg-black');
    this.renderer.addClass(this.overlay, 'bg-opacity-50');
    this.renderer.addClass(this.overlay, 'flex');
    this.renderer.addClass(this.overlay, 'items-center');
    this.renderer.addClass(this.overlay, 'justify-center');
    this.renderer.addClass(this.overlay, 'fade-in-out');
    this.renderer.addClass(this.overlay, 'opacity-0');
    this.renderer.addClass(this.overlay, 'pointer-events-none');

    this.overlay.innerHTML = `
      <div class="text-white text-center">
        <svg class="w-24 h-24 mx-auto mb-4 file-drop-animation" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
        </svg>
        <p class="text-xl">Drop your file here</p>
      </div>
    `;

    this.renderer.appendChild(this.el.nativeElement, this.overlay);
    return this.overlay;
  }

  private showOverlay() {
    if (this.isShown) return;

    this.isShown = true;
    this.renderer.setStyle(this.overlay, 'opacity', '1');
    this.renderer.setStyle(this.overlay, 'pointer-events', 'auto');

    // Clear any pending hide operations
    if (this.hideOverlayTimeout) {
      clearTimeout(this.hideOverlayTimeout);
    }
  }

  private hideOverlay() {
    if (!this.isShown) return;

    this.isShown = false;
    this.renderer.setStyle(this.overlay, 'opacity', '0');
    this.renderer.setStyle(this.overlay, 'pointer-events', 'none');
  }

  private debouncedHideOverlay() {
    if (this.hideOverlayTimeout) {
      clearTimeout(this.hideOverlayTimeout);
    }
    this.hideOverlayTimeout = setTimeout(() => {
      this.hideOverlay();
    }, 100); // Adjust this delay as needed
  }
}
