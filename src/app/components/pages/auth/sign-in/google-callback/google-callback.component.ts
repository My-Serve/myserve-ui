import {Component, OnInit} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {Router} from "@angular/router";
import {ToastService} from "@services/toast.service";
import {SpinnerService} from "@services/spinner.service";
import {EToastConstants} from "@constants/e-toast-constants";
import {Observable} from "rxjs";
import {AuthService} from "@services/auth.service";
import {OAuthType} from "@models/auth.models";
import {ProfileService} from "@services/profile.service";
import {StorageKeys} from "@others/storage/storage.keys";
import {AbstractStorageService} from "@services/abstracts/storage/abstract.storage.service";

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [],
  templateUrl: './google-callback.component.html',
  styles: ``
})
export class GoogleCallbackComponent implements OnInit{

  constructor(
    private oAuthService: OAuthService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private spinnerService: SpinnerService,
    private profileService: ProfileService,
    private storageService: AbstractStorageService,
  ) {}

  async ngOnInit() {
    const spinnerLock = this.spinnerService.create("Fetching...");

    try {
      await this.oAuthService.loadDiscoveryDocumentAndTryLogin();
      spinnerLock.release();
      if (this.oAuthService.hasValidAccessToken()) {
        const idToken = this.oAuthService.getIdToken();
        const accessToken = this.oAuthService.getAccessToken();
        this.sendTokensToBackend(idToken, accessToken);
      } else {
        spinnerLock.release();
        this.toastService.error(EToastConstants.Error, "Failed to gather your account information from google...")
        await this.router.navigate(['/login']);
      }
    }catch (err){
      spinnerLock.release();
      this.toastService.error(EToastConstants.Error, "Failed to gather your account information from google...")
      await this.router.navigate(['/login']);
    }
  }

  private sendTokensToBackend(idToken: string, accessToken: string) {
    const backendSpinner = this.spinnerService.create("Getting you inside!")
    return this.authService.loginWithGoogle({
      identity: idToken,
      oAuthType: OAuthType.Google
    }).subscribe({
      next: value => {
        backendSpinner.release();
        if(!value){
          this.toastService.error(EToastConstants.Error, 'Failed to authorize your login')
          return
        }

        const profileSpinner = this.spinnerService.create("Checking for your profile")
        this.profileService.getProfile().subscribe({
          next: async (response) => {
            profileSpinner.release();
            if(response){
              await this.checkAndRedirect();
              return;
            }

            if(!await this.profileService.hasProfile()){
              await this.router.navigate(['profile'])
            }else{
              await this.checkAndRedirect();
            }
          },
          error: (error) => {
            profileSpinner.release();
            this.toastService.error(EToastConstants.Error, 'An unknown error happened while validating your otp')
          }
        })
      },
      error: err => {
        backendSpinner.release();
        this.toastService.error(EToastConstants.Error, 'An unknown error happened while login you with google')
      }
    })
  }

  async checkAndRedirect(){
    const redirectUrl = await this.storageService.getOrDefaultStringAsync(StorageKeys.RedirectTo, undefined);
    if(!redirectUrl){
      await this.router.navigate(['home'])
      return;
    }else{
      await this.router.navigate(redirectUrl.split("/"))
      return;
    }
  }

}
