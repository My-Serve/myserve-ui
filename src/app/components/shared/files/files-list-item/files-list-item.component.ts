import {Component, input, output} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {EFileType, IFile} from "../../../../models/files-model";
import {StorageSizePipe} from "../../../../pipes/storage-size.pipe";
import {NameParserPipe} from "../../../../pipes/name-parser.pipe";
import {Router} from "@angular/router";
import {Button} from "primeng/button";

@Component({
  selector: 'app-files-list-item',
  standalone: true,
  imports: [
    DividerModule,
    StorageSizePipe,
    NameParserPipe,
    Button
  ],
  templateUrl: './files-list-item.component.html',
  styles: ``
})
export class FilesListItemComponent {

  fileItem = input.required<IFile>();


  protected readonly EFileType = EFileType;
  constructor(
    protected readonly route: Router,
  ) {
  }

  open() {
    this.route.navigate(['home', 'files', this.fileItem().type.toLowerCase(), this.fileItem().id])
  }

  clickMore($event: MouseEvent) {
    $event.stopPropagation();


  }
}
