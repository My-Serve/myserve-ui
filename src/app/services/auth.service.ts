import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiRoutes} from "@others/api.routes";
import {
  ICreateOtpCommand,
  ICreateOtpResponse, IOAuthCommand, IOAuthResponse, IRefreshTokenCommand,
  IRefreshTokenResponse,
  IValidateOtpCommand,
  IValidateOtpResponse
} from "@models/auth.models";
import {catchError, from, map, Observable, of, switchMap, tap} from "rxjs";
import {AbstractStorageService} from "./abstracts/storage/abstract.storage.service";
import {StorageKeys} from "@others/storage/storage.keys";
import {AuthPersistence} from "@others/models/auth-persistence";
import {Router} from "@angular/router";
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private _isInitialized: boolean = false;
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;
  private readonly _googleAuthConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    strictDiscoveryDocumentValidation: false,
    clientId: environment.oAuth.google.clientId,
    redirectUri: [window.location.origin, 'callback', 'google' ].join('/'),
    scope: 'openid profile email',
    responseType: 'token id_token',
    showDebugInformation: true,
  }

  constructor(
    private readonly http: HttpClient,
    private readonly storage: AbstractStorageService,
    private readonly router: Router,
    private readonly oAuthService: OAuthService,
  ) {
  }

  public async initialize() : Promise<boolean> {
    this._isInitialized = true;
    this.oAuthService.configure(this._googleAuthConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    await this.oAuthService.loadDiscoveryDocument();
    const persistence = await this.storage.getOrDefaultAsync<AuthPersistence>(StorageKeys.AuthTokens);
    if(!persistence)
      return false;

    this._accessToken = persistence.accessToken;
    this._refreshToken = persistence.refreshToken;
    return true;
  }

  public async requestGoogleLogin(){
    this.oAuthService.initLoginFlow();
  }

  public loginWithGoogle(oauthCommand: IOAuthCommand) : Observable<boolean> {
    oauthCommand.device ??= "WebApp";
    return this.http.post<IOAuthResponse>(ApiRoutes.Auth.oAuth, oauthCommand).pipe(
      switchMap((value) => {
        if (!value.success) {
          return from(this.logout()).pipe(map(() => false));
        }

        if (!value.refreshToken || !value.accessToken) {
          return from(this.logout()).pipe(map(() => false));
        }

        this._accessToken = value.accessToken!;
        this._refreshToken = value.refreshToken!;
        return from(this.persist({
          accessToken: this._accessToken,
          refreshToken: this._refreshToken,
        })).pipe(map(() => true));
      }),
      catchError(() => {
        return from(this.logout()).pipe(map(() => false));
      })
    );
  }

  public requestOtp(body: ICreateOtpCommand): Observable<ICreateOtpResponse> {
    return this.http.post<ICreateOtpResponse>(ApiRoutes.Auth.createOtp, body).pipe(
      catchError((error) => {
        if (error.status !== 200) {
          let response = "An unknown error occurred";
          if(error.status === 500) {
            response = "The server seems to be not online"
          }
          const modifiedResponse: ICreateOtpResponse = {
            success: false,
            message: response,
          };
          return of(modifiedResponse);
        }
        const modifiedResponse: ICreateOtpResponse = {
          success: false,
          message: 'An unknown error occurred while processing your request. Please try again later',
        };
        return of(modifiedResponse)
      })
    );
  }

  public validateOtp(body: IValidateOtpCommand) : Observable<boolean> {
    return this.http.post<IValidateOtpResponse>(ApiRoutes.Auth.validateOtp, body)
      .pipe(
        switchMap((value) => {
          if (!value.success) {
            return from(this.logout()).pipe(map(() => false));
          }

          if (!value.refreshToken || !value.accessToken) {
            return from(this.logout()).pipe(map(() => false));
          }

          this._accessToken = value.accessToken!;
          this._refreshToken = value.refreshToken!;
          return from(this.persist({
            accessToken: this._accessToken,
            refreshToken: this._refreshToken,
          })).pipe(map(() => true));
        }),
        catchError(() => {
          return from(this.logout()).pipe(map(() => false));
        })
      );
  }

  private async persist(authOptions: AuthPersistence): Promise<void> {
    await this.storage.setAsync<AuthPersistence>(StorageKeys.AuthTokens, authOptions);
  }

  public refresh() : Observable<IRefreshTokenResponse | undefined> {
    if(!this.RefreshToken)
      return of(undefined);

    return this.http.post<IRefreshTokenResponse | undefined>(ApiRoutes.Auth.refresh, {
      tokenId: this.RefreshToken
    } as IRefreshTokenCommand).pipe(
      tap((val) => {
        if(!val)
          return;

        this._accessToken = val.accessToken!;
        this._refreshToken = val.refreshToken!;
        return from(this.persist({
          accessToken: this._accessToken,
          refreshToken: this._refreshToken,
        })).pipe(map(() => val));
      })
    )
      ;
  }

  public async logout(): Promise<void> {
    this._refreshToken = null;
    this._accessToken = null;

    await this.storage.removeAsync(StorageKeys.AuthTokens);
    if(this.router.url.includes("/auth"))
      return;

    await this.router.navigate(["auth"]);
  }

  public get AccessToken() : string | null{
    return this._accessToken;
  }

  public get RefreshToken() : string | null{
    return this._refreshToken;
  }

  public get IsLoggedIn(): boolean {
    return this._accessToken != null;
  }
}
