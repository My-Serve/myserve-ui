import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {SplitButtonModule} from "primeng/splitbutton";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {NgStyle} from "@angular/common";
import {FilesListItemComponent} from "@shared/files/files-list-item/files-list-item.component";
import {FilesListComponent} from "./files-list/files-list.component";
import {EFileType, IFile, IParentDirectory} from "@models/files-model";
import {FilesService} from "@services/files.service";
import {SpinnerService} from "@services/spinner.service";
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "@services/toast.service";
import {EToastConstants} from "@constants/e-toast-constants";
import {FileDropperDirective} from "@directives/file-dropper.directive";
import {UploadService} from "@services/upload.service";
import {ActiveTaskService} from "@services/active-task.service";
import {TaskLabel} from "@constants/e-task-label";
import {removeQueryParams} from "@utils/string.utils";
import {HttpErrorResponse} from "@angular/common/http";
import {filter, skip, Subscription} from "rxjs";
import {DialogModule} from "primeng/dialog";
import {FileItemComponent} from "@pages/dashboard/home/files/file-item/file-item.component";
import {PopUpService} from "@services/pop-up.service";
import {CreateEditFileComponent} from "@shared/files/create-directory-name/create-edit-file.component";

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    ToolbarModule,
    SplitButtonModule,
    InputTextModule,
    DividerModule,
    BreadcrumbModule,
    NgStyle,
    FilesListItemComponent,
    FilesListComponent,
    FileDropperDirective,
    DialogModule,
    FileItemComponent,
    CreateEditFileComponent,
  ],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {

  id?: string;
  parents: IParentDirectory[] = []
  files: IFile[] = []
  readonly uploadMenuItems: MenuItem[]
  private readonly subscriptions: Subscription[] = [];

  constructor(
    protected readonly fileService: FilesService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly uploadService: UploadService,
    private readonly taskService: ActiveTaskService,
    private readonly popupService: PopUpService
  ) {
    this.uploadMenuItems = [
      {
        label: 'From URL',
      },
      {
        label: 'Directory',
        command:  () => {
          this.popupService.openCreateEditPopupDirectory(undefined, undefined, this.id);
        }
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }


  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.listFiles();
    });


    const favouriteSub = this.fileService.updateFavourite.pipe(
      skip(1), // Skip the initial emission
      filter(x => typeof x !== 'undefined')
    ).subscribe({
      next: value => {
        const foundFile = this.files.find(x => x.id === value?.id);
        if(!foundFile)
          return

        foundFile.favourite = value?.status ?? false;
      }
    })

    const listUpdateSubscription = this.fileService.updateList.pipe(
      skip(1)
    ).subscribe({
      next: value => {
        if(value!.id !== this.id)
          return;

        this.listFiles();
      }
    })

    this.subscriptions.push(favouriteSub);
    this.subscriptions.push(routeSubscription);
    this.subscriptions.push(listUpdateSubscription);
  }

  create() {
    const spinnerLock = this.spinnerService.create("Creating Test");
    this.fileService.createFolder('Test 2', 'f4834018-ad9f-4f5b-aa43-bc8e124c6feb').subscribe({
      next: value => {
        spinnerLock.release();
      },
      error: error => {
        spinnerLock.release();
      }
    })
  }

  listFiles(){
    const listSpinner = this.spinnerService.create("Listing...");
    this.fileService.list(this.id).subscribe({
      next: value => {
        this.files = value.files
        this.parents = value.parents;
        listSpinner.release();
        this.checkFragment();
      },
      error: err => {
        this.toastService.error(EToastConstants.LoadFailed, "Failed to list out your files, please try again later!")
        listSpinner.release();
      }
    })
  }

  checkFragment(){
    try {
      const fragment = this.route.snapshot.fragment;
      if(!fragment){
        return;
      }

      const urlWithoutFragment = this.router.url.split('#')[0];

      // Navigate to the URL without the fragment
      this.router.navigateByUrl(urlWithoutFragment, { replaceUrl: true });

      const foundedFile = this.files.find(x => x.id === fragment);
      if(!foundedFile){
        this.toastService.error(EToastConstants.Error, "Failed to locate the selected file")
        return
      }

      this.fileService.preview(foundedFile.id)
    }catch (err){
      console.error(err)
      this.toastService.error(EToastConstants.Error, "An unknown error occurred while trying to open your content")
    }
  }

  onFileDropped(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      this.createUpload(event[i]);
    }
  }

  async createUpload(file: File): Promise<void> {
    const fileUploadLock = this.spinnerService.create("Preparing Upload")
    this.fileService.requestSignedUrl(file.type, this.parentId).subscribe({
      next: value => {
        fileUploadLock.release();

        if(!value.success){
          this.toastService.error(EToastConstants.Error, value.message || 'An unknown error occurred while authorizing file upload.');
          return;
        }

        const accessUrl = value.accessUrl;
        const task = this.taskService.createTask(TaskLabel.fileUpload(file.name));
        task.act(async (task) => {
          this.uploadService.upload(accessUrl, file.type, file).subscribe({
            next: value => {
              task.setProgress(value);
              if(value >= 100 && !task.completed)
              {
                task.complete();
                const meParentId = this.parentId;
                this.fileService.createFile(file.name, this.parentId, removeQueryParams(accessUrl), file.size, file.type)
                  .subscribe({
                    next: (value) => {
                      this.toastService.success(EToastConstants.UploadSuccess, `${file.name} has been uploaded successfully.`);
                      if(meParentId === this.parentId){
                        this.listFiles();
                      }
                    },
                    error: err => {
                      if(err instanceof HttpErrorResponse){
                        if(err.status === 409)
                        {
                          this.toastService.error(EToastConstants.Error, 'A file/directory with this name already exists!')
                          return;
                        }
                      }

                      this.toastService.error(EToastConstants.Error, err?.message || `An unknown error occurred while uploading ${file.name}`);

                    }
                  })
              }
            },
            error: err => {
              this.toastService.error(EToastConstants.Error, `Failed to upload ${file.name}`);
              task.setError('Error while uploading!')
            }
          })
        })
      },
      error: err => {
        fileUploadLock.release();
        this.toastService.error(EToastConstants.Error, 'An unknown error occurred while authorizing file upload.');
        return;
      }
    })
  }



  onGotoPrevious() {
    if(this.parents.length <= 0)
      return;

    if(this.parents.length === 1)
    {
      this.router.navigate(['home', 'files'])
      return;
    }

    this.router.navigate(['home', 'files', 'dir', this.parents.at(-2)!.id])
  }

  public get parentId() : string | undefined {
    if(this.parents.length <= 0)
      return undefined;

    return this.parents.at(-1)!.id
  }


  traverse(direction: 'left' | 'right') {
    const currentPreviewFile = this.fileService.currentPreviewFile;
    if(!currentPreviewFile)
      return;

    const objects = this.files.filter(x => x.type !== EFileType.Directory);
    const currentObjectIndex = objects.findIndex(x => x.id === currentPreviewFile);
    if(currentObjectIndex === -1)
    {
      this.toastService.error(EToastConstants.Warning, `The existing file doesn't seems to be available now!`)
      this.fileService.closePreview();
      return;
    }

    let nextIndex: number;

    if (direction === 'right') {
      nextIndex = (currentObjectIndex + 1) % objects.length; // Wrap around to 0 if at the end
    } else { // direction === 'left'
      nextIndex = (currentObjectIndex - 1 + objects.length) % objects.length; // Wrap around to last index if at the start
    }

    const nextFile = objects[nextIndex];
    this.fileService.preview(nextFile.id)
  }
}
