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
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ToastService} from "../../../../../services/toast.service";
import {EToastConstants} from "../../../../../constants/e-toast-constants";
import {FileDropperDirective} from "../../../../../directives/file-dropper.directive";

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
    // this.id = this.router.snapshot.params["id"]?.toString() || undefined
    // this.router.params.subscribe(params => {
    //   this.id = params['id'];
    //   console.log(this.id); // Should log the ID correctly
    //   this.listFiles();
    // });
    //
    // this.router.params.subscribe({
    //   next: value => {
    //     console.log(value)
    //   },
    //   error: err => {
    //     console.error(err)
    //   },
    //   complete: () => {
    //     console.log('com')
    //   }
    // })
    //
    // this.router.
    // Accessing paramMap correctly
    this.router.events.subscribe({
      next: (value: any) => {
        this.listFiles();
        if(!(value instanceof NavigationEnd))
          return;

        this.id = this.route.snapshot.params["id"]

      }
    })
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

  onFileDropped($event: FileList) {
    console.log($event)
  }
}
