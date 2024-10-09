import {Component, input, OnInit} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {EFileType, IFile} from "@models/files-model";
import {StorageSizePipe} from "@pipes/storage-size.pipe";
import {NameParserPipe} from "@pipes/name-parser.pipe";
import {Router} from "@angular/router";
import {Button} from "primeng/button";
import {DataService} from "@services/data.service";
import {EContentType} from "@constants/e-content-type";
import {FilesService} from "@services/files.service";

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
export class FilesListItemComponent implements OnInit{

  fileItem = input.required<IFile>();
  protected contentType: EContentType = EContentType.Unknown;

  protected readonly EFileType = EFileType;
  constructor(
    protected readonly route: Router,
    protected readonly dataService: DataService,
    private readonly fileService: FilesService,
  ) {
  }

  ngOnInit(): void {
    this.contentType = this.dataService.typeByMime(this.fileItem().mimeType);
  }

  open() {
    if(this.fileItem().type === EFileType.Directory)
      this.route.navigate(['home', 'files', this.fileItem().type.toLowerCase(), this.fileItem().id])
    else
      this.fileService.preview(this.fileItem().id);
  }

  clickMore($event: MouseEvent) {
    $event.stopPropagation();


  }

  protected readonly EContentType = EContentType;
}
