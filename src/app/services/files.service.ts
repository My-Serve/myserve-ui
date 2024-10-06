import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IListOptions} from "../others/models/list-options";
import {ApiRoutes} from "../others/api.routes";
import {EFileType, ICreateFileCommand, IListFilesResponse} from "../models/files-model";

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private readonly http: HttpClient
  ) { }

  list(parentId?: string, listOptions?: IListOptions): Observable<IListFilesResponse> {
    parentId ??= '';
    listOptions ??= {
      skip: 0,
      take: 20,
    }

    const params = {
      parentId: parentId,
      ...listOptions
    };
    return this.http.get<IListFilesResponse>(ApiRoutes.Files.list, {
      params: params
    })
  }

  createFolder(name: string, parentId?: string) : Observable<any> {
    return this.create({
      name: name,
      parentId: parentId,
      type: EFileType.Directory,
      targetSize: 0
    });
  }

  requestUpload(){

  }

  private create(command: ICreateFileCommand) : Observable<any> {
    return this.http.post(ApiRoutes.Files.create, command);
  }

}
