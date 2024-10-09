import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {IListOptions} from "@others/models/list-options";
import {ApiRoutes} from "@others/api.routes";
import {
  EFileType,
  EPublicSignedUrlRequestType,
  ICreateFileCommand, ICreateFileResponse, IGetFileByIdResponse,
  IListFilesResponse,
  IRequestSignedUrlCommand,
  IRequestSignedUrlResponse
} from "@models/files-model";
import {extension} from "es-mime-types";
import {ActiveTaskService} from "./active-task.service";

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private _currentViewingFileId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private _previewFile: boolean = false;

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

  id(id: string) : Observable<IGetFileByIdResponse> {
    return this.http.get<IGetFileByIdResponse>(`${ApiRoutes.Files.id}/${id}`);
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
    let extensionValue = extension(mimeType)
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

  public preview(id: string) {
    this._currentViewingFileId.next(id)
    this._previewFile = true;
  }

  public closePreview(){
    this._currentViewingFileId.next(undefined)
    this._previewFile = false;
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
}
