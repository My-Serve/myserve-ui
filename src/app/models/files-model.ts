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
  favourite: boolean
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

export interface ICreateFileResponse {
  file?: IFile;
  message?: string;
}

export interface IListFilesResponse {
  files: IFile[]
  parents: IParentDirectory[]
}

export interface IRequestSignedUrlCommand {
  fileName: string,
  source: EPublicSignedUrlRequestType,
  durationInMinutes: number,
  parentId?: string
}

export interface IRequestSignedUrlResponse {
  success: boolean,
  message?: string,
  accessUrl: string
}

export interface IGetFileByIdResponse {
  file: IFile;
  expiry: Date
}

export enum EPublicSignedUrlRequestType {
  Profile = "Profile",
  Files = "Files",
  PublicFile = "PublicFile",
}
