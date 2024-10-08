import {Component, output} from '@angular/core';
import {StorageSizePipe} from "@pipes/storage-size.pipe";

@Component({
  selector: 'app-parent-files-list-item',
  standalone: true,
    imports: [
        StorageSizePipe
    ],
  templateUrl: './parent-files-list-item.component.html',
  styles: ``
})
export class ParentFilesListItemComponent {

  gotoPrevious = output();

  clickOnParent(){
    this.gotoPrevious.emit();
  }
}
