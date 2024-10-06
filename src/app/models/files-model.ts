import {IUserIdentification} from "./profile-model";

export interface IFile {
  id: string;
  name: string;
  parentId?: string;
  targetUrl?: string;
  targetSize: number;
  mimeType?: string;
  owner: string;
  createdAt: string;
  type: EFileType,
  ownerProfile: IUserIdentification
}

export interface IParentDirectory {
  id: string;
  name: string;
}

export enum EFileType {
  Directory = "Dir",
  Object = "Obj",
  Metadata = "Meta"
}

export interface ICreateFileCommand {
  name: string,
  parentId?: string
  type: EFileType,
  targetUrl?: string
  targetSize: number
  mimeType?: string
}

export interface IListFilesResponse {
  files: IFile[]
  parents: IParentDirectory[]
}
