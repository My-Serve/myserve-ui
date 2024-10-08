import {Component, OnInit} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {SplitButtonModule} from "primeng/splitbutton";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {NgStyle} from "@angular/common";
import {FilesListItemComponent} from "../../../../shared/files/files-list-item/files-list-item.component";
import {FilesListComponent} from "./files-list/files-list.component";
import {IFile, IParentDirectory} from "../../../../../models/files-model";
import {FilesService} from "../../../../../services/files.service";
import {SpinnerService} from "../../../../../services/spinner.service";
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../../services/toast.service";
import {EToastConstants} from "../../../../../constants/e-toast-constants";
import {FileDropperDirective} from "../../../../../directives/file-dropper.directive";
import {UploadService} from "../../../../../services/upload.service";
import {ActiveTaskService} from "../../../../../services/active-task.service";
import {TaskLabel} from "../../../../../constants/e-task-label";
import {removeQueryParams} from "../../../../../utils/string.utils";
import {HttpErrorResponse} from "@angular/common/http";

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
  ],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  id?: string;
  parents: IParentDirectory[] = []
  files: IFile[] = []
  readonly uploadMenuItems: MenuItem[]


  constructor(
    private readonly fileService: FilesService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly uploadService: UploadService,
    private readonly taskService: ActiveTaskService
  ) {
    this.uploadMenuItems = [
      {
        label: 'From URL',
      },
      {
        label: 'Directory',
      }
    ];
  }


  ngOnInit(): void {
    if (this.route.firstChild) {
      this.route.firstChild.params.subscribe(params => {
        this.id = params['id'];
        this.listFiles();
      });
    } else {
      this.listFiles();
    }
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
      },
      error: err => {
        this.toastService.error(EToastConstants.LoadFailed, "Failed to list out your files, please try again later!")
        listSpinner.release();
      }
    })
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
}
