import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, from, Observable, of, switchMap, tap, throwError} from "rxjs";
import {IProfileCreateCommand, IProfileCreateResponse, IProfileModel} from "@models/profile-model";
import {AuthService} from "./auth.service";
import {ApiRoutes} from "@others/api.routes";
import {compressImage} from "@utils/image-compression.utils";
import {NgxImageCompressService} from "ngx-image-compress";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _hasProfile? : boolean = undefined;
  private readonly _profile: BehaviorSubject<IProfileModel | undefined > = new BehaviorSubject<IProfileModel | undefined>(undefined);

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly compressService: NgxImageCompressService,
  ) { }

  public async initialize(): Promise<void> {
    this.getProfile();
    return;
  }

  public create(profileCommand: IProfileCreateCommand): Observable<IProfileCreateResponse> {
    const formData = new FormData();
    const newProfileCreateCommand: Omit<IProfileCreateCommand, 'imageFile'> = {
      ...profileCommand,
    };

    formData.append("body", JSON.stringify(newProfileCreateCommand));

    if (profileCommand.imageFile) {
      let imageFileSize = profileCommand.imageFile.size;

      return from(compressImage(profileCommand.imageFile, this.compressService)).pipe(
        switchMap(x => {
          const renamedFile = new File([x], "imageFile", { type: x.type });
          formData.append("profileImage", renamedFile);

          console.log(`Image file has been compressed from ${imageFileSize} to ${renamedFile.size}`);
          return this.http.post<IProfileCreateResponse>(ApiRoutes.Profile.me, formData);
        }),
        catchError(error => {
          console.error(error);
          // Return a default response or an error observable
          return of({
            id: '',
            response: error.toString(),
          } as IProfileCreateResponse);
        })
      );
    } else {
      return this.http.post<IProfileCreateResponse>(ApiRoutes.Profile.me, formData);
    }
  }

  public getProfile() : Observable<IProfileModel | undefined | null> {
    return this.http.get<IProfileModel>(ApiRoutes.Profile.me)
      .pipe(
        tap({
          next: async (val) => {
            this._hasProfile = true;
            this._profile.next(val);
            return val;
          },
          error: async err => {
            return undefined;
          }
        }),
        catchError(async err => {
          if(err instanceof HttpErrorResponse && err.status === 404){
            this._hasProfile = false;
          }

          return undefined;
        })
      )
  }

  public get cached() : IProfileModel {
    return this._profile.value!;
  }

  public async hasProfile(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if(typeof this._hasProfile === 'undefined') {

        this.getProfile().subscribe({
          next: async (val) => {
            resolve(this._hasProfile!)
          }
        })
      }else{
        resolve(this._hasProfile!);
      }
    });
  }
}
