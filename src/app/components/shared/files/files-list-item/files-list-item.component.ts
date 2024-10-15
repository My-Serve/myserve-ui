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
import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";
import {Menu, MenuModule} from "primeng/menu";
import {PopUpService} from "@services/pop-up.service";
import {FileListStateService} from "@services/file-list-state.service";
import {AbstractDownloadService} from "@services/abstracts/downloads/abstract-download-service";
import {ToastService} from "@services/toast.service";
import {EToastConstants} from "@constants/e-toast-constants";
import {SpinnerService} from "@services/spinner.service";

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
  @ViewChild('contextMenu') contextMenu?: ContextMenu;
  protected contentType: EContentType = EContentType.Unknown;
  protected readonly menuItems: MenuItem[] = [];

  protected readonly EFileType = EFileType;
  constructor(
    protected readonly route: Router,
    protected readonly dataService: DataService,
    private readonly fileService: FilesService,
    private readonly popupService: PopUpService,
    protected readonly fileListStateService: FileListStateService,
    private readonly downloadService: AbstractDownloadService,
    private readonly toastService: ToastService,
    private readonly spinnerService: SpinnerService
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
          eve.originalEvent?.preventDefault();
          eve.originalEvent?.stopPropagation();
        },
        icon: PrimeIcons.SHARE_ALT
      });
      this.menuItems.push({
        id: 'download',
        label: 'Download',
        command: async (eve) => {
          eve.originalEvent?.preventDefault();
          eve.originalEvent?.stopPropagation();

          this.download();
        },
        icon: PrimeIcons.DOWNLOAD
      })
    }
    this.menuItems.push({
      id: 'delete',
      label: "Delete",
      command: async (eve) => {
        eve.originalEvent?.preventDefault();
        eve.originalEvent?.stopPropagation();

        this.delete();
      },
      icon: PrimeIcons.TRASH
    })

    this.fileListStateService.closeAllMenus$.subscribe({
      next: value => {
        if(value && value.id === this.fileItem().id)
        {
          if(value.source === "context")
            this.menu?.hide();
          else
            this.contextMenu?.hide();
          return;
        }

        this.contextMenu?.hide();
        this.menu?.hide();
      },
      error: err => {
        console.error(err);
      }
    })
  }

  download(){
    if(this.fileItem().type === EFileType.Directory)
    {
      this.toastService.error(EToastConstants.Error, "Downloading an entire folder is not supported right now!")
      return
    }

    this.downloadService.download(this.fileItem().targetUrl!, this.fileItem().name).subscribe({
      next: downloadResponse => {
        this.toastService.success(EToastConstants.DownloadSuccess, `Your file ${this.fileItem().name} has been downloaded!`)
      }
    })
  }

  delete(){
    const me = this.fileItem().name;
    const deleteSpinner = this.spinnerService.create(`Deleting ${me}...`)
    this.fileService.delete(this.fileItem().id).subscribe({
      next: value => {
        deleteSpinner.release();
        if(value){
          this.fileService.updateList.next({
            id: this.fileItem().parentId ?? undefined
          })
          this.toastService.success(EToastConstants.Success, `${me} is successfully deleted!`)
          this.fileService.closePreview();
        }else{
          this.toastService.error(EToastConstants.Error, `Failed to delete the file`)
        }
      },
      error: err => {
        deleteSpinner.release();
        this.toastService.error(EToastConstants.Error, `Failed to delete the file`)
      }
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
    this.fileListStateService.close(this.fileItem().id, "more");
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
