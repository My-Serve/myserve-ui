import {Component, input, output} from '@angular/core';
import {ISearchResult} from "@models/misc-models";
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {EFileType} from "@models/files-model";
import {ToNumberPipe} from "@pipes/to-number.pipe";
import {StorageSizePipe} from "@pipes/storage-size.pipe";

@Component({
  selector: 'app-top-bar-item',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    ToNumberPipe,
    StorageSizePipe
  ],
  templateUrl: './top-bar-item.component.html',
  styles: ``
})
export class TopBarItemComponent {

  entity = input.required<ISearchResult>();
  select = output();

  protected readonly EFileType = EFileType;

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.select.emit();
  }
}
