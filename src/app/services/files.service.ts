import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {IListOptions} from "@others/models/list-options";
import {ApiRoutes} from "@others/api.routes";
import {
  EFileType,
  EPublicSignedUrlRequestType,
  ICreateFileCommand, ICreateFileResponse, IFile, IGetFileByIdResponse,
  IListFilesResponse,
  IRequestSignedUrlCommand,
  IRequestSignedUrlResponse
} from "@models/files-model";

import {ActiveTaskService} from "./active-task.service";
import {IOperation} from "@others/models/operations";
import {EHeaderKeys, EHeaderValues} from "@constants/e-header-constants";
import mime from 'mime';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private readonly _currentViewingFileId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private _previewFile: boolean = false;
  private readonly _updateFavourite: BehaviorSubject<{ id: string, status: boolean } | undefined> = new BehaviorSubject<{ id: string, status: boolean } | undefined>(undefined);
  private readonly _updateList: BehaviorSubject<{ id: string | undefined} | undefined> = new BehaviorSubject<{ id: string| undefined} | undefined>(undefined);

  constructor(
    private readonly http: HttpClient,
    private readonly taskService: ActiveTaskService,
  ) { }

  list(parentId?: string, listOptions?: IListOptions): Observable<IListFilesResponse> {
    parentId ??= '';
    listOptions ??= {
      skip: 0,
      take: 20,
      orderBy: 'type'
    }

    const params = {
      parentId: parentId,
      ...listOptions
    };
    return this.http.get<IListFilesResponse>(ApiRoutes.Files.list, {
      params: params
    })
  }

  id(id: string, fetchFresh?: boolean) : Observable<IGetFileByIdResponse> {
    let headers = new HttpHeaders();
    fetchFresh ??= false
    if(fetchFresh){
      headers = headers.set(EHeaderKeys.CacheControl, EHeaderValues.NoCache)
    }
    return this.http.get<IGetFileByIdResponse>(`${ApiRoutes.Files.id}/${id}`, {
      headers: headers
    });
  }

  createFolder(name: string, parentId?: string) : Observable<ICreateFileResponse> {
    return this.create({
      name: name,
      parentId: parentId,
      type: EFileType.Directory,
      targetSize: 0
    });
  }

  createFile(name: string, parentId?: string, targetUrl?: string, targetSize: number = 0, mimeType?: string) : Observable<ICreateFileResponse> {
    return this.create({
      name: name,
      parentId: parentId,
      type: EFileType.Object,
      targetUrl: targetUrl,
      targetSize: targetSize,
      mimeType: mimeType
    })
  }

  requestSignedUrl(mimeType: string, parentId?: string) : Observable<IRequestSignedUrlResponse> {
    let randomFileName = crypto.randomUUID().replace("-", "");
    let extensionValue = mime.extension(mimeType)
    if(typeof extensionValue === "undefined" || typeof extensionValue === "boolean") {
      extensionValue = ''
    }else{
      extensionValue = `.${extensionValue}`;
    }
    randomFileName+=extensionValue;

    const command : IRequestSignedUrlCommand = {
      fileName: randomFileName,
      parentId: parentId,
      source: EPublicSignedUrlRequestType.Files,
      durationInMinutes: 60
    }

    return this.http.post<IRequestSignedUrlResponse>(ApiRoutes.Files.signed, command);
  }

  private create(command: ICreateFileCommand) : Observable<ICreateFileResponse> {
    return this.http.post<ICreateFileResponse>(ApiRoutes.Files.create, command);
  }

  public favourite(id: string, status: boolean) : Observable<IFile> {
    const operationBody : IOperation[] = [
      {
        op: 'replace',
        path: '/favourite',
        value: status.toString(),
      }
    ];

    return this.patch(id, operationBody)
      .pipe(
        tap(_ => {
          this._updateFavourite.next({
            id: id,
            status: status
          })
        })
      );
  }

  public rename(id: string, newName: string) : Observable<IFile> {
    const operationBody : IOperation[] = [
      {
        op: 'replace',
        path: '/name',
        value: newName,
      }
    ];

    return this.patch(id, operationBody)
      .pipe(
        tap(value => {
          if(value)
            this._updateList.next({
              id: value?.parentId
            })
        })
      );
  }

  private patch(id: string, command: IOperation[]) : Observable<IFile> {
    return this.http.patch<IFile>(`${ApiRoutes.Files.patch}/${id}`, command);
  }

  public preview(id: string) {
    this._currentViewingFileId.next(id)
    this._previewFile = true;
  }

  public closePreview(){
    this._currentViewingFileId.next(undefined)
    this._previewFile = false;
  }

  public delete(id: string) : Observable<boolean> {
    return this.http.delete(`${ApiRoutes.Files.delete}/${id}`)
      .pipe(
        map(_ => {
          return true;
        }),
        catchError(err => {
          if(err instanceof HttpErrorResponse){
            if(err.status === 404){
              console.error("The provided file doesn't exists")
            }
          }

          return of(false);
        })
      )
  }


  get previewFile(): boolean {
    return this._previewFile;
  }

  set previewFile(value: boolean) {
    this._previewFile = value;
  }

  get currentPreviewFile() : string | undefined {
    return this._currentViewingFileId.value;
  }

  get currentPreviewFileSubject() : BehaviorSubject<string | undefined> {
    return this._currentViewingFileId;
  }

  get updateFavourite(): BehaviorSubject<{ id: string, status: boolean } | undefined> {
    return this._updateFavourite;
  }

  get updateList(): BehaviorSubject<{ id: string | undefined } | undefined> {
    return this._updateList;
  }
}
