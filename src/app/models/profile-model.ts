export interface IProfileModel {
  id: string,
  firstName: string,
  lastName: string,
  createdAt: Date,
  settings: IProfileSettings,
  profileImageUrl?: string,
  emailAddress: string,
}

export interface IProfileSettings {
  enableNotifications: boolean,
}

export interface IProfileCreateCommand {
  firstName: string,
  lastName: string,
  settings?: IProfileSettings,
  imageFile?: File | null
  contentType?: string | null,
}

export interface IProfileCreateResponse {
  id: string,
  response: string
}

export interface IUserIdentification{
  id: string,
  firstName: string,
  lastName: string,
  email?: string
}
