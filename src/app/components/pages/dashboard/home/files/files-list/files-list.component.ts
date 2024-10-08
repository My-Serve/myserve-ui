import {Component, input, OnInit, output} from '@angular/core';
import {FilesListItemComponent} from "@shared/files/files-list-item/files-list-item.component";
import {
  ParentFilesListItemComponent
} from "@shared/files/parent-files-list-item/parent-files-list-item.component";
import {FilesService} from "@services/files.service";
import {SpinnerService} from "@services/spinner.service";
import {IFile} from "@models/files-model";

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [
    FilesListItemComponent,
    ParentFilesListItemComponent
  ],
  templateUrl: './files-list.component.html',
  styles: ``
})
export class FilesListComponent implements OnInit {
  showParent = input.required<boolean>();
  files = input.required<IFile[]>();
  gotoPrevious = output();

  constructor(
    private readonly fileService: FilesService,
    private readonly spinnerService: SpinnerService,
  ) {
  }

  ngOnInit(): void {

  }

  onGotoPrevious(): void {
    this.gotoPrevious.emit();
  }
}
