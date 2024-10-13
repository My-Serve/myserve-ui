import {environment} from "@env/environment";

export class ApiRoutes {

  private static readonly base : string = `${environment.apiUrl}`

  public static Auth = {
    createOtp: `${ApiRoutes.base}/auth/otp`,
    validateOtp: `${ApiRoutes.base}/auth/otp/validate`,
    refresh: `${ApiRoutes.base}/auth/refresh`,
    oAuth: `${ApiRoutes.base}/auth/oauth`
  }

  public static Profile = {
    me: `${ApiRoutes.base}/me`,
  }

  public static Files = {
    list: `${ApiRoutes.base}/files`,
    id: `${ApiRoutes.base}/files`,
    patch: `${ApiRoutes.base}/files`,
    create: `${ApiRoutes.base}/files`,
    delete: `${ApiRoutes.base}/files`,
    signed: `${ApiRoutes.base}/files/signed`,
  }
}
