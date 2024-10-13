import {Component, input, OnInit, ViewChild} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {EFileType, IFile} from "@models/files-model";
import {StorageSizePipe} from "@pipes/storage-size.pipe";
import {NameParserPipe} from "@pipes/name-parser.pipe";
import {Router} from "@angular/router";
import {Button} from "primeng/button";
import {DataService} from "@services/data.service";
import {EContentType} from "@constants/e-content-type";
import {FilesService} from "@services/files.service";
import {MenuItem, PrimeIcons} from "primeng/api";
import {ContextMenuModule} from "primeng/contextmenu";
import {Menu, MenuModule} from "primeng/menu";
import {PopUpService} from "@services/pop-up.service";

@Component({
  selector: 'app-files-list-item',
  standalone: true,
  imports: [
    DividerModule,
    StorageSizePipe,
    NameParserPipe,
    Button,
    ContextMenuModule,
    MenuModule
  ],
  templateUrl: './files-list-item.component.html',
  styles: ``
})
export class FilesListItemComponent implements OnInit{

  fileItem = input.required<IFile>();
  @ViewChild('menu') menu?: Menu;
  protected contentType: EContentType = EContentType.Unknown;
  protected readonly menuItems: MenuItem[] = [];



  protected readonly EFileType = EFileType;
  constructor(
    protected readonly route: Router,
    protected readonly dataService: DataService,
    private readonly fileService: FilesService,
    private readonly popupService: PopUpService
  ) {

  }

  ngOnInit(): void {
    this.contentType = this.dataService.typeByMime(this.fileItem().mimeType);
    this.menuItems.push({
      id: 'edit',
      label: 'Rename',
      command: async (eve) => {
        eve.originalEvent?.preventDefault();
        eve.originalEvent?.stopPropagation();

        this.popupService.openCreateEditPopupDirectory(
          this.fileItem().name, this.fileItem().id ,this.fileItem().parentId, this.fileItem().type !== EFileType.Directory
        )
      },
      icon: PrimeIcons.FILE_EDIT
    })
    if(this.fileItem().type !== EFileType.Directory){
      this.menuItems.push({
        id: 'share',
        label: 'Share',
        command: async (eve) => {

        },
        icon: PrimeIcons.SHARE_ALT
      });
      this.menuItems.push({
        id: 'download',
        label: 'Download',
        command: async (eve) => {

        },
        icon: PrimeIcons.DOWNLOAD
      })
    }
    this.menuItems.push({
      id: 'delete',
      label: "Delete",
      command: async (eve) => {

      },
      icon: PrimeIcons.TRASH
    })
  }

  open() {
    if(this.fileItem().type === EFileType.Directory)
      this.route.navigate(['home', 'files', this.fileItem().type.toLowerCase(), this.fileItem().id])
    else
      this.fileService.preview(this.fileItem().id);
  }

  clickMore($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.menu?.toggle($event);
  }

  protected readonly EContentType = EContentType;

  toggleFavourite(event: MouseEvent) {
    event.stopPropagation();

    this.fileService.favourite(this.fileItem().id, !this.fileItem().favourite).subscribe({
      next: value => {
        this.fileItem().favourite = value.favourite;
      }
    })
  }

}
